<?php
/**
 * Plugin Name: Webly Bridge
 * Description: Bezpieczny most treści pomiędzy panelem Webly a WordPressem.
 * Version: 0.3.0
 * Author: Webly
 */

if (!defined('ABSPATH')) {
    exit;
}

define('WEBLY_BRIDGE_VERSION', '0.3.0');

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

function webly_bridge_customer_payload($user) {
    return [
        'id' => (int) $user->ID,
        'email' => (string) $user->user_email,
        'name' => (string) ($user->display_name ?: $user->user_email),
    ];
}

function webly_bridge_subscription($customer_id) {
    $subscription = get_user_meta($customer_id, 'webly_subscription', true);
    if (!is_array($subscription) || empty($subscription['plan'])) {
        $subscription = [
            'plan' => 'START',
            'status' => 'TRIALING',
            'renewsAt' => wp_date('c', current_time('timestamp') + (14 * DAY_IN_SECONDS)),
        ];
        update_user_meta($customer_id, 'webly_subscription', $subscription);
    }
    return $subscription;
}

function webly_bridge_customer_sites($customer_id) {
    $sites = get_user_meta($customer_id, 'webly_customer_sites', true);
    return is_array($sites) ? array_values($sites) : [];
}

function webly_bridge_save_customer_sites($customer_id, $sites) {
    update_user_meta($customer_id, 'webly_customer_sites', array_values($sites));
}

function webly_bridge_site_index($sites, $site_id) {
    foreach ($sites as $index => $site) {
        if (isset($site['id']) && hash_equals((string) $site['id'], (string) $site_id)) {
            return $index;
        }
    }
    return -1;
}

function webly_bridge_clean_blocks($blocks) {
    if (!is_array($blocks)) {
        return [];
    }

    $allowed_types = ['hero', 'text', 'features', 'cta', 'spacer'];
    $clean = [];

    foreach (array_slice($blocks, 0, 30) as $block) {
        if (!is_array($block)) {
            continue;
        }

        $type = sanitize_key(isset($block['type']) ? $block['type'] : '');
        if (!in_array($type, $allowed_types, true)) {
            continue;
        }

        $item = [
            'id' => sanitize_key(isset($block['id']) ? $block['id'] : wp_generate_uuid4()),
            'type' => $type,
        ];

        foreach (['kicker', 'title', 'body', 'buttonLabel', 'buttonHref'] as $field) {
            if (isset($block[$field]) && is_string($block[$field])) {
                $item[$field] = sanitize_textarea_field($block[$field]);
            }
        }

        if (isset($block['items']) && is_array($block['items'])) {
            $item['items'] = array_values(array_map('sanitize_text_field', array_slice($block['items'], 0, 8)));
        }

        $item['align'] = isset($block['align']) && $block['align'] === 'center' ? 'center' : 'left';
        $clean[] = $item;
    }

    return $clean;
}

function webly_bridge_customer_id(WP_REST_Request $request) {
    return absint($request->get_param('customerId'));
}

function webly_bridge_valid_customer($customer_id) {
    return $customer_id > 0 && get_user_by('id', $customer_id);
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

    register_rest_route('webly/v1', '/customer/auth/register', [
        'methods' => 'POST',
        'callback' => function (WP_REST_Request $request) {
            $email = sanitize_email($request->get_param('email'));
            $name = sanitize_text_field($request->get_param('name'));
            $password = (string) $request->get_param('password');

            if (!is_email($email) || strlen($name) < 2 || strlen($password) < 8) {
                return new WP_Error('invalid_registration', 'Sprawdź imię, adres e-mail i hasło.', ['status' => 400]);
            }
            if (email_exists($email)) {
                return new WP_Error('email_exists', 'Konto z tym adresem e-mail już istnieje.', ['status' => 409]);
            }

            $user_id = wp_insert_user([
                'user_login' => $email,
                'user_email' => $email,
                'user_pass' => $password,
                'display_name' => $name,
                'first_name' => $name,
                'role' => 'subscriber',
            ]);

            if (is_wp_error($user_id)) {
                return new WP_Error('registration_failed', $user_id->get_error_message(), ['status' => 400]);
            }

            webly_bridge_subscription($user_id);
            webly_bridge_save_customer_sites($user_id, []);
            return ['ok' => true, 'customer' => webly_bridge_customer_payload(get_user_by('id', $user_id))];
        },
        'permission_callback' => 'webly_bridge_authorized',
    ]);

    register_rest_route('webly/v1', '/customer/auth/login', [
        'methods' => 'POST',
        'callback' => function (WP_REST_Request $request) {
            $email = sanitize_email($request->get_param('email'));
            $password = (string) $request->get_param('password');
            $user = wp_authenticate($email, $password);

            if (is_wp_error($user)) {
                return new WP_Error('invalid_credentials', 'Nieprawidłowy adres e-mail lub hasło.', ['status' => 401]);
            }

            webly_bridge_subscription($user->ID);
            return ['ok' => true, 'customer' => webly_bridge_customer_payload($user)];
        },
        'permission_callback' => 'webly_bridge_authorized',
    ]);

    register_rest_route('webly/v1', '/customer/sites', [
        [
            'methods' => 'GET',
            'callback' => function (WP_REST_Request $request) {
                $customer_id = webly_bridge_customer_id($request);
                if (!webly_bridge_valid_customer($customer_id)) {
                    return new WP_Error('customer_not_found', 'Nie znaleziono klienta.', ['status' => 404]);
                }
                return ['ok' => true, 'sites' => webly_bridge_customer_sites($customer_id)];
            },
            'permission_callback' => 'webly_bridge_authorized',
        ],
        [
            'methods' => 'POST',
            'callback' => function (WP_REST_Request $request) {
                $customer_id = webly_bridge_customer_id($request);
                if (!webly_bridge_valid_customer($customer_id)) {
                    return new WP_Error('customer_not_found', 'Nie znaleziono klienta.', ['status' => 404]);
                }

                $name = sanitize_text_field($request->get_param('name'));
                $template_id = sanitize_key($request->get_param('templateId'));
                $kind = strtoupper(sanitize_key($request->get_param('kind')));
                $theme = sanitize_key($request->get_param('theme'));
                $blocks = webly_bridge_clean_blocks($request->get_param('blocks'));

                if (strlen($name) < 2 || !$blocks || !in_array($kind, ['BUSINESS', 'LANDING', 'STORE'], true)) {
                    return new WP_Error('invalid_site', 'Brakuje nazwy, typu lub treści witryny.', ['status' => 400]);
                }

                $id = 'site_' . substr(str_replace('-', '', wp_generate_uuid4()), 0, 12);
                $slug_base = sanitize_title($name) ?: 'moja-strona';
                $site = [
                    'id' => $id,
                    'customerId' => $customer_id,
                    'name' => $name,
                    'slug' => $slug_base . '-' . substr($id, -5),
                    'kind' => $kind,
                    'status' => 'DRAFT',
                    'templateId' => $template_id,
                    'theme' => $theme ?: 'sand',
                    'blocks' => $blocks,
                    'createdAt' => current_time('c'),
                    'updatedAt' => current_time('c'),
                ];

                $sites = webly_bridge_customer_sites($customer_id);
                $sites[] = $site;
                webly_bridge_save_customer_sites($customer_id, $sites);
                return ['ok' => true, 'site' => $site];
            },
            'permission_callback' => 'webly_bridge_authorized',
        ],
    ]);

    register_rest_route('webly/v1', '/customer/sites/(?P<id>[a-zA-Z0-9_-]+)', [
        [
            'methods' => 'GET',
            'callback' => function (WP_REST_Request $request) {
                $customer_id = webly_bridge_customer_id($request);
                $sites = webly_bridge_customer_sites($customer_id);
                $index = webly_bridge_site_index($sites, sanitize_text_field($request['id']));
                if ($index < 0) {
                    return new WP_Error('site_not_found', 'Nie znaleziono witryny.', ['status' => 404]);
                }
                return ['ok' => true, 'site' => $sites[$index]];
            },
            'permission_callback' => 'webly_bridge_authorized',
        ],
        [
            'methods' => 'PUT',
            'callback' => function (WP_REST_Request $request) {
                $customer_id = webly_bridge_customer_id($request);
                $sites = webly_bridge_customer_sites($customer_id);
                $index = webly_bridge_site_index($sites, sanitize_text_field($request['id']));
                if ($index < 0) {
                    return new WP_Error('site_not_found', 'Nie znaleziono witryny.', ['status' => 404]);
                }

                if ($request->get_param('name')) {
                    $sites[$index]['name'] = sanitize_text_field($request->get_param('name'));
                }
                if (is_array($request->get_param('blocks'))) {
                    $blocks = webly_bridge_clean_blocks($request->get_param('blocks'));
                    if ($blocks) {
                        $sites[$index]['blocks'] = $blocks;
                    }
                }
                $sites[$index]['updatedAt'] = current_time('c');
                webly_bridge_save_customer_sites($customer_id, $sites);
                return ['ok' => true, 'site' => $sites[$index]];
            },
            'permission_callback' => 'webly_bridge_authorized',
        ],
        [
            'methods' => 'DELETE',
            'callback' => function (WP_REST_Request $request) {
                $customer_id = webly_bridge_customer_id($request);
                $sites = webly_bridge_customer_sites($customer_id);
                $index = webly_bridge_site_index($sites, sanitize_text_field($request['id']));
                if ($index < 0) {
                    return new WP_Error('site_not_found', 'Nie znaleziono witryny.', ['status' => 404]);
                }

                $published = get_option('webly_published_customer_sites', []);
                unset($published[$sites[$index]['slug']]);
                update_option('webly_published_customer_sites', $published, false);
                array_splice($sites, $index, 1);
                webly_bridge_save_customer_sites($customer_id, $sites);
                return ['ok' => true];
            },
            'permission_callback' => 'webly_bridge_authorized',
        ],
    ]);

    register_rest_route('webly/v1', '/customer/sites/(?P<id>[a-zA-Z0-9_-]+)/publish', [
        'methods' => 'POST',
        'callback' => function (WP_REST_Request $request) {
            $customer_id = webly_bridge_customer_id($request);
            $sites = webly_bridge_customer_sites($customer_id);
            $index = webly_bridge_site_index($sites, sanitize_text_field($request['id']));
            if ($index < 0) {
                return new WP_Error('site_not_found', 'Nie znaleziono witryny.', ['status' => 404]);
            }

            $sites[$index]['status'] = 'PUBLISHED';
            $sites[$index]['publishedAt'] = current_time('c');
            $sites[$index]['updatedAt'] = current_time('c');
            webly_bridge_save_customer_sites($customer_id, $sites);
            $published = get_option('webly_published_customer_sites', []);
            $published[$sites[$index]['slug']] = $sites[$index];
            update_option('webly_published_customer_sites', $published, false);
            return ['ok' => true, 'site' => $sites[$index]];
        },
        'permission_callback' => 'webly_bridge_authorized',
    ]);

    register_rest_route('webly/v1', '/customer/subscription', [
        [
            'methods' => 'GET',
            'callback' => function (WP_REST_Request $request) {
                $customer_id = webly_bridge_customer_id($request);
                if (!webly_bridge_valid_customer($customer_id)) {
                    return new WP_Error('customer_not_found', 'Nie znaleziono klienta.', ['status' => 404]);
                }
                return ['ok' => true, 'subscription' => webly_bridge_subscription($customer_id)];
            },
            'permission_callback' => 'webly_bridge_authorized',
        ],
        [
            'methods' => 'PUT',
            'callback' => function (WP_REST_Request $request) {
                $customer_id = webly_bridge_customer_id($request);
                $plan = strtoupper(sanitize_key($request->get_param('plan')));
                if (!webly_bridge_valid_customer($customer_id) || !in_array($plan, ['START', 'PRO', 'COMMERCE'], true)) {
                    return new WP_Error('invalid_subscription', 'Nieprawidłowy klient lub plan.', ['status' => 400]);
                }
                $subscription = webly_bridge_subscription($customer_id);
                $subscription['plan'] = $plan;
                update_user_meta($customer_id, 'webly_subscription', $subscription);
                return ['ok' => true, 'subscription' => $subscription];
            },
            'permission_callback' => 'webly_bridge_authorized',
        ],
    ]);

    register_rest_route('webly/v1', '/site/public', [
        'methods' => 'GET',
        'callback' => function (WP_REST_Request $request) {
            $slug = sanitize_title($request->get_param('slug'));
            $published = get_option('webly_published_customer_sites', []);
            if (!$slug || !isset($published[$slug])) {
                return new WP_Error('site_not_found', 'Nie znaleziono opublikowanej witryny.', ['status' => 404]);
            }
            return ['ok' => true, 'site' => $published[$slug]];
        },
        'permission_callback' => '__return_true',
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
