import { __ } from '@wordpress/i18n';

/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import deprecatedV1 from './deprecated/v1';

// eslint-disable-next-line no-unused-vars
import _, { ReactComponent as Logo } from '../public/icon.svg';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
// TODO: revisit description because the non-string block description is deprecated. In order to provide a link refer
// to the following issue: https://github.com/WordPress/gutenberg/issues/49887
registerBlockType( metadata, {
	description: (
		<>
			<p>
				{ __(
					'Create diagrams and flow charts using text via Mermaid',
					'merpress'
				) }
				.
			</p>
			<a href="https://mermaid.js.org/syntax/flowchart.html">
				{ __( 'Documentation', 'merpress' ) }
			</a>
		</>
	),

	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	icon: Logo,

	/**
	 * @param {Object} props Properties passed from the editor.
	 */
	save: Save,

	deprecated: [ deprecatedV1 ],
} );
