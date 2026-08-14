<?php
/**
 * Plugin Name: Webly Bridge
 * Description: Bezpieczny most treści pomiędzy panelem Webly a WordPressem.
 * Version: 0.2.1
 * Author: Webly
 */

if (!defined('ABSPATH')) {
    exit;
}

define('WEBLY_BRIDGE_VERSION', '0.2.1');

function webly_bridge_defaults() {
    return [
        'home.hero' => [
            'eyebrow' => '01 / Nie zaczynaj od pustej kartki',
            'title' => 'Strona, która',
            'accent' => 'od razu',
            'tail' => 'wygląda',
            'lastLine' => 'jak Twoja.',
            'lead' => 'Gotowy projekt, Twoje treści i pełne zaplecze techniczne. Uruchamiamy stronę, a potem dbamy, żeby po prostu działała.',
            'primaryLabel' => 'Zobacz projekty',
            'primaryHref' => '/szablony',
            'secondaryLabel' => 'Jak to działa',
            'secondaryHref' => '/oferta',
        ],
        'offer.hero' => [
            'eyebrow' => '01 / Oferta',
            'title' => 'Wybierz punkt startu.',
            'accent' => 'Nie buduj zaplecza.',
            'lead' => 'Każdy wariant obejmuje projekt, uruchomienie i późniejszą opiekę. Różni je skala — nie jakość wykonania.',
        ],
        'templates.hero' => [
            'eyebrow' => '01 / Biblioteka',
            'title' => 'Punkty wyjścia z',
            'accent' => 'własnym charakterem.',
            'lead' => 'Nie zmieniamy wyłącznie logo i koloru przycisku. Każdy kierunek ma odrębną kompozycję, rytm i zachowanie.',
        ],
        'pricing.hero' => [
            'eyebrow' => '01 / Cennik',
            'title' => 'Płacisz za efekt.',
            'accent' => 'Nie za liczbę kliknięć.',
            'lead' => 'Na początku opłata za przygotowanie i uruchomienie. Później prosty abonament za technikę, opiekę i rozwój produktu.',
        ],
        'contact.hero' => [
            'eyebrow' => '01 / Kontakt',
            'title' => 'Najpierw krótka',
            'accent' => 'rozmowa o Twojej firmie.',
            'lead' => 'Nie musisz znać technologii ani mieć gotowego briefu. Napisz, czym się zajmujesz i czego potrzebujesz.',
        ],
    ];
}

register_activation_hook(__FILE__, function () {
    if (!get_option('webly_bridge_token')) {
        update_option('webly_bridge_token', wp_generate_password(48, false, false), false);
    }
    if (!get_option('webly_content_published')) {
        update_option('webly_content_published', webly_bridge_defaults(), false);
    }
    if (!get_option('webly_content_draft')) {
        update_option('webly_content_draft', webly_bridge_defaults(), false);
    }
});

function webly_bridge_authorized(WP_REST_Request $request) {
    $stored = (string) get_option('webly_bridge_token', '');
    $provided = (string) $request->get_header('x-webly-token');

    return $stored !== '' && $provided !== '' && hash_equals($stored, $provided);
}

function webly_bridge_allowed_key($key) {
    return array_key_exists($key, webly_bridge_defaults());
}

function webly_bridge_clean_content($content) {
    if (!is_array($content)) {
        return [];
    }

    $allowed_fields = [
        'eyebrow',
        'title',
        'accent',
        'tail',
        'lastLine',
        'lead',
        'primaryLabel',
        'primaryHref',
        'secondaryLabel',
        'secondaryHref',
    ];
    $clean = [];

    foreach ($content as $key => $value) {
        if (!in_array($key, $allowed_fields, true) || (!is_string($value) && !is_numeric($value))) {
            continue;
        }

        $clean[$key] = sanitize_textarea_field((string) $value);
    }

    return $clean;
}

add_action('rest_api_init', function () {
    register_rest_route('webly/v1', '/health', [
        'methods' => 'GET',
        'callback' => function () {
            return [
                'ok' => true,
                'site' => get_bloginfo('name'),
                'woocommerce' => class_exists('WooCommerce'),
                'bridgeVersion' => WEBLY_BRIDGE_VERSION,
            ];
        },
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('webly/v1', '/content', [
        [
            'methods' => 'GET',
            'callback' => function (WP_REST_Request $request) {
                $key = sanitize_text_field($request->get_param('key'));
                $status = $request->get_param('status') === 'draft' ? 'draft' : 'published';

                if (!webly_bridge_allowed_key($key)) {
                    return new WP_Error('invalid_key', 'Nieprawidłowy klucz treści.', ['status' => 400]);
                }
                if ($status === 'draft' && !webly_bridge_authorized($request)) {
                    return new WP_Error('forbidden', 'Brak dostępu.', ['status' => 403]);
                }

                $option = $status === 'draft' ? 'webly_content_draft' : 'webly_content_published';
                $all = get_option($option, webly_bridge_defaults());

                return [
                    'ok' => true,
                    'key' => $key,
                    'status' => $status,
                    'content' => isset($all[$key]) ? $all[$key] : webly_bridge_defaults()[$key],
                ];
            },
            'permission_callback' => '__return_true',
        ],
        [
            'methods' => 'PUT',
            'callback' => function (WP_REST_Request $request) {
                $key = sanitize_text_field($request->get_param('key'));

                if (!webly_bridge_allowed_key($key)) {
                    return new WP_Error('invalid_key', 'Nieprawidłowy klucz treści.', ['status' => 400]);
                }

                $content = webly_bridge_clean_content($request->get_param('content'));
                if (!$content) {
                    return new WP_Error('invalid_content', 'Treść jest pusta.', ['status' => 400]);
                }

                $drafts = get_option('webly_content_draft', webly_bridge_defaults());
                $drafts[$key] = array_merge(webly_bridge_defaults()[$key], $content);
                update_option('webly_content_draft', $drafts, false);

                return [
                    'ok' => true,
                    'key' => $key,
                    'status' => 'draft',
                    'content' => $drafts[$key],
                    'updatedAt' => current_time('c'),
                ];
            },
            'permission_callback' => 'webly_bridge_authorized',
        ],
    ]);

    register_rest_route('webly/v1', '/publish', [
        'methods' => 'POST',
        'callback' => function (WP_REST_Request $request) {
            $key = sanitize_text_field($request->get_param('key'));

            if (!webly_bridge_allowed_key($key)) {
                return new WP_Error('invalid_key', 'Nieprawidłowy klucz treści.', ['status' => 400]);
            }

            $drafts = get_option('webly_content_draft', webly_bridge_defaults());
            $published = get_option('webly_content_published', webly_bridge_defaults());
            $published[$key] = isset($drafts[$key]) ? $drafts[$key] : webly_bridge_defaults()[$key];
            update_option('webly_content_published', $published, false);

            return [
                'ok' => true,
                'key' => $key,
                'status' => 'published',
                'content' => $published[$key],
                'publishedAt' => current_time('c'),
            ];
        },
        'permission_callback' => 'webly_bridge_authorized',
    ]);
});

add_action('admin_menu', function () {
    add_options_page('Webly Bridge', 'Webly Bridge', 'manage_options', 'webly-bridge', 'webly_bridge_settings_page');
});

function webly_bridge_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_POST['webly_rotate_token']) && check_admin_referer('webly_rotate_token')) {
        update_option('webly_bridge_token', wp_generate_password(48, false, false), false);
        echo '<div class="notice notice-success"><p>Wygenerowano nowy token.</p></div>';
    }

    $token = esc_attr(get_option('webly_bridge_token', ''));
    ?>
    <div class="wrap">
        <h1>Webly Bridge</h1>
        <p>Most jest gotowy do połączenia z panelem Webly.</p>
        <table class="form-table">
            <tr><th>Adres API</th><td><code><?php echo esc_html(rest_url('webly/v1')); ?></code></td></tr>
            <tr>
                <th>WP_API_TOKEN</th>
                <td>
                    <input type="text" readonly value="<?php echo $token; ?>" class="regular-text code" onclick="this.select()" />
                    <p class="description">Przechowuj jako sekret wyłącznie po stronie Vercela.</p>
                </td>
            </tr>
            <tr><th>Wersja</th><td><?php echo esc_html(WEBLY_BRIDGE_VERSION); ?></td></tr>
        </table>
        <form method="post">
            <?php wp_nonce_field('webly_rotate_token'); ?>
            <button class="button" name="webly_rotate_token" value="1">Wygeneruj nowy token</button>
        </form>
    </div>
    <?php
}
