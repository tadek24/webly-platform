<?php
/**
 * Plugin Name: Webly Bridge
 * Description: Bezpieczny most treści pomiędzy panelem Webly a WordPressem.
 * Version: 0.4.0
 * Author: Webly
 */

if (!defined('ABSPATH')) {
    exit;
}

define('WEBLY_BRIDGE_VERSION', '0.4.0');

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

add_action('init', function () {
    if (!get_role('webly_manager')) {
        add_role('webly_manager', 'Menedżer Webly', ['read' => true]);
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
    $roles = is_array($user->roles) ? $user->roles : [];
    $platform_role = (in_array('administrator', $roles, true) || in_array('webly_manager', $roles, true)) ? 'ADMIN' : 'CUSTOMER';
    return [
        'id' => (int) $user->ID,
        'email' => (string) $user->user_email,
        'name' => (string) ($user->display_name ?: $user->user_email),
        'role' => $platform_role,
        'access' => get_user_meta($user->ID, 'webly_access', true) === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE',
    ];
}

function webly_bridge_default_packages() {
    return [
        ['id' => 'START', 'name' => 'Start', 'price' => 79, 'setup' => 990, 'description' => 'Prosta strona lub landing page.', 'audience' => 'Dla jednoosobowej firmy i kampanii', 'siteLimit' => 1, 'features' => ['1 witryna', 'własna domena', 'formularz kontaktowy', 'hosting i SSL']],
        ['id' => 'PRO', 'name' => 'Pro', 'price' => 149, 'setup' => 1490, 'description' => 'Pełna strona firmowa z większą liczbą sekcji.', 'audience' => 'Dla rozwijającej się firmy', 'siteLimit' => 3, 'features' => ['3 witryny', 'galerie i formularze', 'podstawowe SEO', 'opieka techniczna']],
        ['id' => 'COMMERCE', 'name' => 'Commerce', 'price' => 299, 'setup' => 2990, 'description' => 'Zarządzany sklep internetowy Webly.', 'audience' => 'Dla własnego sklepu internetowego', 'siteLimit' => 2, 'features' => ['produkty i warianty', 'płatności i dostawy', 'panel zamówień', 'zarządzany WooCommerce']],
        ['id' => 'OMNICHANNEL', 'name' => 'Omnichannel', 'price' => 699, 'setup' => 5990, 'description' => 'Sklep z obsługą wielu kanałów sprzedaży.', 'audience' => 'Dla sprzedaży marketplace', 'siteLimit' => 4, 'features' => ['Allegro i ERLI', 'Amazon i Empik', 'BaseLinker lub Apilo', 'automatyzacje zamówień']],
    ];
}

function webly_bridge_packages() {
    $packages = get_option('webly_packages', []);
    if (!is_array($packages) || count($packages) < 3) {
        $packages = webly_bridge_default_packages();
        update_option('webly_packages', $packages, false);
    }
    return array_values($packages);
}

function webly_bridge_default_integrations() {
    return [
        ['id' => 'stripe', 'name' => 'Stripe', 'category' => 'PAYMENTS', 'description' => 'Karty, BLIK i płatności międzynarodowe.', 'selected' => false, 'availability' => 'READY'],
        ['id' => 'przelewy24', 'name' => 'Przelewy24', 'category' => 'PAYMENTS', 'description' => 'BLIK i szybkie przelewy dla polskich klientów.', 'selected' => false, 'availability' => 'READY'],
        ['id' => 'payu', 'name' => 'PayU', 'category' => 'PAYMENTS', 'description' => 'Płatności online i odroczone.', 'selected' => false, 'availability' => 'READY'],
        ['id' => 'inpost', 'name' => 'InPost', 'category' => 'DELIVERY', 'description' => 'Paczkomaty, kurier i etykiety wysyłkowe.', 'selected' => false, 'availability' => 'READY'],
        ['id' => 'dpd', 'name' => 'DPD', 'category' => 'DELIVERY', 'description' => 'Kurier krajowy i zagraniczny.', 'selected' => false, 'availability' => 'READY'],
        ['id' => 'dhl', 'name' => 'DHL', 'category' => 'DELIVERY', 'description' => 'Przesyłki kurierskie i punkty odbioru.', 'selected' => false, 'availability' => 'READY'],
        ['id' => 'baselinker', 'name' => 'BaseLinker', 'category' => 'ERP', 'description' => 'Synchronizacja ofert, stanów i zamówień.', 'selected' => false, 'availability' => 'READY'],
        ['id' => 'apilo', 'name' => 'Apilo', 'category' => 'ERP', 'description' => 'Obsługa sprzedaży wielokanałowej.', 'selected' => false, 'availability' => 'READY'],
        ['id' => 'allegro', 'name' => 'Allegro', 'category' => 'MARKETPLACE', 'description' => 'Oferty, ceny, stany i zamówienia Allegro.', 'selected' => false, 'availability' => 'READY'],
        ['id' => 'erli', 'name' => 'ERLI', 'category' => 'MARKETPLACE', 'description' => 'Synchronizacja katalogu i zamówień ERLI.', 'selected' => false, 'availability' => 'PLANNED'],
        ['id' => 'amazon', 'name' => 'Amazon', 'category' => 'MARKETPLACE', 'description' => 'Sprzedaż na europejskich rynkach Amazon.', 'selected' => false, 'availability' => 'PLANNED'],
        ['id' => 'empik', 'name' => 'EmpikPlace', 'category' => 'MARKETPLACE', 'description' => 'Produkty i zamówienia EmpikPlace.', 'selected' => false, 'availability' => 'PLANNED'],
        ['id' => 'emap', 'name' => 'eMAP', 'category' => 'MARKETPLACE', 'description' => 'Kolejny kanał sprzedaży wybierany na życzenie.', 'selected' => false, 'availability' => 'PLANNED'],
    ];
}

function webly_bridge_store_data($customer_id) {
    $store = get_user_meta($customer_id, 'webly_store_data', true);
    if (!is_array($store) || !isset($store['products'])) {
        $store = ['mode' => class_exists('WooCommerce') ? 'WOOCOMMERCE' : 'PREVIEW', 'products' => [], 'orders' => [], 'integrations' => webly_bridge_default_integrations(), 'updatedAt' => current_time('c')];
        update_user_meta($customer_id, 'webly_store_data', $store);
    }
    if (!isset($store['integrations']) || !is_array($store['integrations'])) {
        $store['integrations'] = webly_bridge_default_integrations();
    }
    return $store;
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

    $allowed_types = ['hero', 'text', 'features', 'image', 'gallery', 'quote', 'stats', 'products', 'contact', 'cta', 'divider', 'spacer'];
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

        foreach (['kicker', 'title', 'body', 'buttonLabel'] as $field) {
            if (isset($block[$field]) && is_string($block[$field])) {
                $item[$field] = sanitize_textarea_field($block[$field]);
            }
        }

        foreach (['buttonHref', 'imageUrl'] as $field) {
            if (isset($block[$field]) && is_string($block[$field])) {
                $item[$field] = esc_url_raw($block[$field]);
            }
        }
        if (isset($block['imageAlt']) && is_string($block['imageAlt'])) {
            $item['imageAlt'] = sanitize_text_field($block['imageAlt']);
        }

        if (isset($block['items']) && is_array($block['items'])) {
            $item['items'] = array_values(array_map('sanitize_text_field', array_slice($block['items'], 0, 16)));
        }

        if (isset($block['images']) && is_array($block['images'])) {
            $item['images'] = [];
            foreach (array_slice($block['images'], 0, 16) as $image) {
                if (!is_array($image) || empty($image['url'])) continue;
                $item['images'][] = [
                    'id' => isset($image['id']) ? absint($image['id']) : 0,
                    'url' => esc_url_raw($image['url']),
                    'alt' => sanitize_text_field(isset($image['alt']) ? $image['alt'] : ''),
                    'name' => sanitize_text_field(isset($image['name']) ? $image['name'] : ''),
                ];
            }
        }

        if (isset($block['style']) && is_array($block['style'])) {
            $style = $block['style'];
            $item['style'] = [
                'backgroundColor' => sanitize_hex_color(isset($style['backgroundColor']) ? $style['backgroundColor'] : '') ?: '',
                'textColor' => sanitize_hex_color(isset($style['textColor']) ? $style['textColor'] : '') ?: '',
                'backgroundImage' => esc_url_raw(isset($style['backgroundImage']) ? $style['backgroundImage'] : ''),
                'backgroundPosition' => in_array(isset($style['backgroundPosition']) ? $style['backgroundPosition'] : '', ['center', 'top', 'bottom', 'left', 'right'], true) ? $style['backgroundPosition'] : 'center',
                'overlay' => min(80, max(0, absint(isset($style['overlay']) ? $style['overlay'] : 0))),
                'padding' => in_array(isset($style['padding']) ? $style['padding'] : '', ['compact', 'normal', 'airy'], true) ? $style['padding'] : 'normal',
                'width' => isset($style['width']) && $style['width'] === 'contained' ? 'contained' : 'wide',
            ];
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
            update_user_meta($user_id, 'webly_access', 'ACTIVE');
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

            if (get_user_meta($user->ID, 'webly_access', true) === 'SUSPENDED') {
                return new WP_Error('account_suspended', 'Dostęp do konta został wstrzymany. Skontaktuj się z Webly.', ['status' => 403]);
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
                if ($kind === 'STORE') {
                    webly_bridge_store_data($customer_id);
                }
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
                if (!webly_bridge_valid_customer($customer_id) || !in_array($plan, ['START', 'PRO', 'COMMERCE', 'OMNICHANNEL'], true)) {
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

    register_rest_route('webly/v1', '/packages', [
        [
            'methods' => 'GET',
            'callback' => function () {
                return ['ok' => true, 'packages' => webly_bridge_packages()];
            },
            'permission_callback' => 'webly_bridge_authorized',
        ],
        [
            'methods' => 'PUT',
            'callback' => function (WP_REST_Request $request) {
                $incoming = $request->get_param('packages');
                if (!is_array($incoming)) return new WP_Error('invalid_packages', 'Nieprawidłowa lista pakietów.', ['status' => 400]);
                $allowed_ids = ['START', 'PRO', 'COMMERCE', 'OMNICHANNEL'];
                $packages = [];
                foreach (array_slice($incoming, 0, 4) as $package) {
                    if (!is_array($package)) continue;
                    $id = strtoupper(sanitize_key(isset($package['id']) ? $package['id'] : ''));
                    if (!in_array($id, $allowed_ids, true)) continue;
                    $features = isset($package['features']) && is_array($package['features']) ? array_values(array_map('sanitize_text_field', array_slice($package['features'], 0, 12))) : [];
                    $packages[] = [
                        'id' => $id,
                        'name' => sanitize_text_field(isset($package['name']) ? $package['name'] : $id),
                        'price' => max(0, floatval(isset($package['price']) ? $package['price'] : 0)),
                        'setup' => max(0, floatval(isset($package['setup']) ? $package['setup'] : 0)),
                        'description' => sanitize_textarea_field(isset($package['description']) ? $package['description'] : ''),
                        'audience' => sanitize_text_field(isset($package['audience']) ? $package['audience'] : ''),
                        'siteLimit' => max(1, absint(isset($package['siteLimit']) ? $package['siteLimit'] : 1)),
                        'features' => $features,
                    ];
                }
                if (count($packages) < 3) return new WP_Error('invalid_packages', 'Brakuje wymaganych pakietów.', ['status' => 400]);
                update_option('webly_packages', $packages, false);
                return ['ok' => true, 'packages' => $packages];
            },
            'permission_callback' => 'webly_bridge_authorized',
        ],
    ]);

    register_rest_route('webly/v1', '/customer/media', [
        [
            'methods' => 'GET',
            'callback' => function (WP_REST_Request $request) {
                $customer_id = webly_bridge_customer_id($request);
                if (!webly_bridge_valid_customer($customer_id)) return new WP_Error('customer_not_found', 'Nie znaleziono klienta.', ['status' => 404]);
                $media = get_user_meta($customer_id, 'webly_media', true);
                return ['ok' => true, 'media' => is_array($media) ? array_values($media) : []];
            },
            'permission_callback' => 'webly_bridge_authorized',
        ],
        [
            'methods' => 'POST',
            'callback' => function (WP_REST_Request $request) {
                $customer_id = webly_bridge_customer_id($request);
                if (!webly_bridge_valid_customer($customer_id)) return new WP_Error('customer_not_found', 'Nie znaleziono klienta.', ['status' => 404]);
                $mime = sanitize_mime_type($request->get_param('mimeType'));
                $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
                if (!isset($allowed[$mime])) return new WP_Error('invalid_media', 'Dozwolone są pliki JPG, PNG, WEBP i GIF.', ['status' => 400]);
                $raw = base64_decode((string) $request->get_param('data'), true);
                if ($raw === false || strlen($raw) === 0 || strlen($raw) > 4 * MB_IN_BYTES) return new WP_Error('invalid_media', 'Plik jest pusty albo przekracza 4 MB.', ['status' => 400]);
                $base_name = sanitize_file_name(pathinfo((string) $request->get_param('fileName'), PATHINFO_FILENAME));
                $filename = ($base_name ?: 'webly-image') . '.' . $allowed[$mime];
                $upload = wp_upload_bits($filename, null, $raw);
                if (!empty($upload['error'])) return new WP_Error('upload_failed', $upload['error'], ['status' => 500]);
                $attachment_id = wp_insert_attachment(['post_mime_type' => $mime, 'post_title' => $base_name ?: 'Webly image', 'post_status' => 'inherit'], $upload['file']);
                if (!is_wp_error($attachment_id)) {
                    require_once ABSPATH . 'wp-admin/includes/image.php';
                    wp_update_attachment_metadata($attachment_id, wp_generate_attachment_metadata($attachment_id, $upload['file']));
                }
                $asset = ['id' => is_wp_error($attachment_id) ? 0 : (int) $attachment_id, 'url' => esc_url_raw($upload['url']), 'alt' => sanitize_text_field($base_name), 'name' => $filename];
                $media = get_user_meta($customer_id, 'webly_media', true);
                $media = is_array($media) ? $media : [];
                array_unshift($media, $asset);
                update_user_meta($customer_id, 'webly_media', array_slice($media, 0, 100));
                return ['ok' => true, 'asset' => $asset];
            },
            'permission_callback' => 'webly_bridge_authorized',
        ],
    ]);

    register_rest_route('webly/v1', '/customer/store', [
        'methods' => 'GET',
        'callback' => function (WP_REST_Request $request) {
            $customer_id = webly_bridge_customer_id($request);
            if (!webly_bridge_valid_customer($customer_id)) return new WP_Error('customer_not_found', 'Nie znaleziono klienta.', ['status' => 404]);
            return ['ok' => true, 'store' => webly_bridge_store_data($customer_id)];
        },
        'permission_callback' => 'webly_bridge_authorized',
    ]);

    register_rest_route('webly/v1', '/customer/store/products', [
        'methods' => 'POST',
        'callback' => function (WP_REST_Request $request) {
            $customer_id = webly_bridge_customer_id($request);
            $product = $request->get_param('product');
            if (!webly_bridge_valid_customer($customer_id) || !is_array($product)) return new WP_Error('invalid_product', 'Nieprawidłowy produkt.', ['status' => 400]);
            $name = sanitize_text_field(isset($product['name']) ? $product['name'] : '');
            $sku = sanitize_text_field(isset($product['sku']) ? $product['sku'] : '');
            if (strlen($name) < 2 || !$sku) return new WP_Error('invalid_product', 'Podaj nazwę i SKU.', ['status' => 400]);
            $store = webly_bridge_store_data($customer_id);
            $store['products'][] = [
                'id' => 'product_' . substr(str_replace('-', '', wp_generate_uuid4()), 0, 10),
                'name' => $name,
                'sku' => $sku,
                'price' => max(0, floatval(isset($product['price']) ? $product['price'] : 0)),
                'stock' => max(0, absint(isset($product['stock']) ? $product['stock'] : 0)),
                'status' => isset($product['status']) && $product['status'] === 'DRAFT' ? 'DRAFT' : 'ACTIVE',
                'imageUrl' => esc_url_raw(isset($product['imageUrl']) ? $product['imageUrl'] : ''),
            ];
            $store['updatedAt'] = current_time('c');
            update_user_meta($customer_id, 'webly_store_data', $store);
            return ['ok' => true, 'store' => $store];
        },
        'permission_callback' => 'webly_bridge_authorized',
    ]);

    register_rest_route('webly/v1', '/customer/store/integrations', [
        'methods' => 'PUT',
        'callback' => function (WP_REST_Request $request) {
            $customer_id = webly_bridge_customer_id($request);
            $selected = $request->get_param('selected');
            if (!webly_bridge_valid_customer($customer_id) || !is_array($selected)) return new WP_Error('invalid_integrations', 'Nieprawidłowa lista integracji.', ['status' => 400]);
            $selected = array_map('sanitize_key', $selected);
            $store = webly_bridge_store_data($customer_id);
            foreach ($store['integrations'] as &$integration) {
                $integration['selected'] = in_array($integration['id'], $selected, true);
            }
            unset($integration);
            $store['updatedAt'] = current_time('c');
            update_user_meta($customer_id, 'webly_store_data', $store);
            return ['ok' => true, 'store' => $store];
        },
        'permission_callback' => 'webly_bridge_authorized',
    ]);

    register_rest_route('webly/v1', '/admin/overview', [
        'methods' => 'GET',
        'callback' => function () {
            $customers = [];
            $site_count = 0;
            $store_count = 0;
            $revenue = 0;
            $package_prices = [];
            foreach (webly_bridge_packages() as $package) $package_prices[$package['id']] = floatval($package['price']);
            foreach (get_users(['orderby' => 'registered', 'order' => 'DESC']) as $user) {
                $payload = webly_bridge_customer_payload($user);
                if ($payload['role'] === 'ADMIN') continue;
                $sites = webly_bridge_customer_sites($user->ID);
                $subscription = webly_bridge_subscription($user->ID);
                $site_count += count($sites);
                foreach ($sites as $site) if (isset($site['kind']) && $site['kind'] === 'STORE') $store_count++;
                if (isset($package_prices[$subscription['plan']]) && !in_array($subscription['status'], ['CANCELED'], true)) $revenue += $package_prices[$subscription['plan']];
                $customers[] = array_merge($payload, ['subscription' => $subscription, 'sites' => $sites]);
            }
            return ['ok' => true, 'overview' => ['customers' => $customers, 'packages' => webly_bridge_packages(), 'totals' => ['customers' => count($customers), 'sites' => $site_count, 'stores' => $store_count, 'monthlyRevenue' => $revenue]]];
        },
        'permission_callback' => 'webly_bridge_authorized',
    ]);

    register_rest_route('webly/v1', '/admin/customers/(?P<id>\d+)', [
        'methods' => 'PUT',
        'callback' => function (WP_REST_Request $request) {
            $customer_id = absint($request['id']);
            $user = get_user_by('id', $customer_id);
            if (!$user) return new WP_Error('customer_not_found', 'Nie znaleziono klienta.', ['status' => 404]);
            $subscription = webly_bridge_subscription($customer_id);
            $plan = strtoupper(sanitize_key($request->get_param('plan')));
            $status = strtoupper(sanitize_key($request->get_param('status')));
            $access = strtoupper(sanitize_key($request->get_param('access')));
            if (in_array($plan, ['START', 'PRO', 'COMMERCE', 'OMNICHANNEL'], true)) $subscription['plan'] = $plan;
            if (in_array($status, ['TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED'], true)) $subscription['status'] = $status;
            if (in_array($access, ['ACTIVE', 'SUSPENDED'], true)) update_user_meta($customer_id, 'webly_access', $access);
            update_user_meta($customer_id, 'webly_subscription', $subscription);
            return ['ok' => true, 'customer' => array_merge(webly_bridge_customer_payload($user), ['subscription' => $subscription, 'sites' => webly_bridge_customer_sites($customer_id)])];
        },
        'permission_callback' => 'webly_bridge_authorized',
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
