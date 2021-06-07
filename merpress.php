<?php

/**
 * Plugin Name: MerPress
 * Plugin URI: https://github.com/n3f/merpress
 * Description: Merpress lets you create diagrams and visualizations using <a href="https://mermaid-js.github.io/mermaid/">MermaidJS</a>.
 * Version: 1.0.0
 * Requires at least: 4.6
 */

define( 'MERMAID_JS_VERSION', '8.8.0' );
define( 'MERMAID_PLUGIN_VERSION', '0.1.1' );

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

		wp_register_script(
			'mermaid-gutenberg-block',
			plugin_dir_url( __FILE__ ) . 'assets/mermaid-block.js',
			[ 'mermaid' ],
			MERMAID_PLUGIN_VERSION,
			true
		);

		wp_register_style(
			'mermaid-gutenberg-block',
			plugin_dir_url( __FILE__ ) . 'assets/mermaid-block.css',
			[ 'wp-edit-blocks' ],
			MERMAID_PLUGIN_VERSION
		);

		register_block_type(
			'merpress/mermaidjs',
			[
				'editor_script' => 'mermaid-gutenberg-block',
				'editor_style' => 'mermaid-gutenberg-block',
			]
		);

		add_action(
			'loop_end',
			function () {
				wp_enqueue_script( 'mermaid-init' );
			}
		);
	}
);
