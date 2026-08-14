<?php
/**
 * Plugin Name: Webly Bridge
 * Description: Bezpieczny most pomiędzy panelem Webly a WordPress/WooCommerce.
 * Version: 0.1.0
 * Author: Webly
 */

if (!defined('ABSPATH')) { exit; }

add_action('rest_api_init', function () {
    register_rest_route('webly/v1', '/health', [
        'methods' => 'GET',
        'callback' => function () {
            return new WP_REST_Response([
                'ok' => true,
                'site' => get_bloginfo('name'),
                'woocommerce' => class_exists('WooCommerce'),
                'bridgeVersion' => '0.1.0',
            ]);
        },
        'permission_callback' => '__return_true',
    ]);
});

