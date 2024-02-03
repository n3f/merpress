<?php
/**
 * Plugin Name: MerPress
 * Plugin URI: https://github.com/n3f/merpress
 * Description: Merpress lets you create diagrams and visualizations using <a href="https://mermaid-js.github.io/mermaid/">MermaidJS</a>.
 * Version: 1.1.0-beta
 * Requires at least: 4.6
 *
 * @package MerPress
 */

declare( strict_types=1 );

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MERMAID_PLUGIN_VERSION', '1.1.0-beta' );

add_action(
	'init',
	function () {
		wp_register_style(
			'mermaid-gutenberg-block',
			plugin_dir_url( __FILE__ ) . 'public/mermaid-block.css',
			[],
			MERMAID_PLUGIN_VERSION
		);

		// Register the mermaidjs block.
		$result = register_block_type( __DIR__ . '/build' );
		if ( false === $result ) {
			error_log( 'Failed to register block type' );
		}
	}
);
