<?php
/**
 * Plugin Name: Google Drive E-Book & Magazine Embedder
 * Description: Embed flipbook readers for Google Drive PDFs using a simple shortcode.
 * Version: 1.0.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) exit;

function render_drive_ebook_reader($atts) {
    $args = shortcode_atts(array(
        'id'     => '',
        'reader' => 'https://yourdomain.com/reader.html',
        'secret' => '',
        'width'  => '100%',
        'height' => '650px',
    ), $atts, 'ebook_reader');

    if (empty($args['id'])) {
        return '<p style="color: red;">Error: Missing Google Drive File ID.</p>';
    }

    $iframe_src = esc_url(add_query_arg('id', sanitize_text_field($args['id']), $args['reader']));
    if (!empty($args['secret'])) {
        $iframe_src = esc_url(add_query_arg('secret', sanitize_text_field($args['secret']), $iframe_src));
    }

    return sprintf(
        '<div class="ebook-reader-container" style="width: %s; height: %s; max-width: 100%%; margin: 20px auto;">
            <iframe src="%s" style="width: 100%%; height: 100%%; border: 0; border-radius: 8px;" allowfullscreen></iframe>
        </div>',
        esc_attr($args['width']),
        esc_attr($args['height']),
        $iframe_src
    );
}
add_shortcode('ebook_reader', 'render_drive_ebook_reader');
?>