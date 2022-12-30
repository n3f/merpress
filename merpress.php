<?php

/**
 * Plugin Name: MerPress
 * Plugin URI: https://github.com/n3f/merpress
 * Description: Merpress lets you create diagrams and visualizations using <a href="https://mermaid-js.github.io/mermaid/">MermaidJS</a>.
 * Version: 1.0.10-pre
 * Requires at least: 4.6
 *
 * @package MerPress
 */

define( 'MERMAID_JS_VERSION', '9.3.0' );
define( 'MERMAID_PLUGIN_VERSION', '1.0.10-pre' );

add_action(
	'init',
	function () {
		wp_register_script( 'mermaid', plugin_dir_url( __FILE__ ) . 'assets/mermaid.min.js', [], MERMAID_JS_VERSION, true );

		wp_register_script(
			'mermaid-init',
			plugin_dir_url( __FILE__ ) . 'assets/mermaid-init.js',
			[
				'jquery',
				'mermaid',
			],
			MERMAID_PLUGIN_VERSION,
			true
		);

		// wp_register_script(
		// 	'mermaid-gutenberg-block',
		// 	plugin_dir_url( __FILE__ ) . 'assets/mermaid-block.js',
		// 	[ 'mermaid' ],
		// 	MERMAID_PLUGIN_VERSION,
		// 	true
		// );

		wp_register_style(
			'mermaid-gutenberg-block',
			plugin_dir_url( __FILE__ ) . 'assets/mermaid-block.css',
			[ 'wp-edit-blocks' ],
			MERMAID_PLUGIN_VERSION
		);

		$result = register_block_type( __DIR__ . '/build' );
		if ( $result === false ) {
			error_log( 'Failed to register block type' );
		}

		// $enqueue_mermaid = function () {
		// 	wp_enqueue_script( 'mermaid-init' );
		// };

		// add_action( 'loop_end', $enqueue_mermaid );
		// add_action( 'loop_no_results', $enqueue_mermaid );
	}
);
