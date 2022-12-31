import { useBlockProps } from '@wordpress/block-editor';
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
// import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

// import _, { ReactComponent as Logo } from '../assets/markdeep.svg';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
// debugger;
registerBlockType( metadata, {
	description:  <>
		<p>{ __('Create diagrams and flow charts using text via Mermaid', 'merpress') }.</p>
		<a href=''>{ __( 'Documentation', 'merpress' ) }</a>
	</>,

	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	/**
	 * @see ./save.js
	 */
	save: function (props) {
		const blockProps = useBlockProps.save({
			className: 'mermaid',
		});
		return <pre { ...blockProps }>
			{ props.attributes.content }
		</pre>
	}
} );
