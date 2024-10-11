<?php
/**
 * Plugin Name: MerPress
 * Plugin URI: https://github.com/n3f/merpress
 * Description: Merpress lets you create diagrams and visualizations using <a href="https://mermaid-js.github.io/mermaid/">MermaidJS</a>.
 * Version: 1.1.5
 * Requires at least: 4.6
 *
 * @package MerPress
 */

declare( strict_types=1 );

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MERMAID_PLUGIN_VERSION', '1.1.5' );
define( 'MERMAID_JS_VERSION', '11.3.0' );

add_action(
	'init',
	function () {
		$mermaid_config = [
			'mermaid_version' => MERMAID_JS_VERSION,
			'mermaid_url'     => plugin_dir_url( __FILE__ ) . 'public/mermaid.min.js',
		];

		wp_register_script(
			'mermaid',
			$mermaid_config['mermaid_url'],
			[],
			$mermaid_config['mermaid_version'],
			false
		);

		// Register the mermaidjs block.
		$result = register_block_type( __DIR__ . '/build' );
		if ( false === $result ) {
			error_log( 'Failed to register block type' );
		}
	}
);
