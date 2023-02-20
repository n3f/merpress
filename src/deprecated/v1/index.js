import { useBlockProps } from '@wordpress/block-editor';

/**
 * When the deprecation is evaluated, the save function is called with the
 * attributes below 👇️.  If the output matches the current block data, then the
 * parsed attributes are passed to the migrate function.  The migrate function
 * receives an object of attributes (simple key/value pairs and not the full
 * attribute definition). It can then remove deprecated attributes and add new
 * ones. **Subsequent deprecations might need to update the migration function**.
 *
 * Creating a deprecation should be as simple as:
 * 1. Copy the current block's save function.
 * 2. Copy the current block's attributes.
 * 3. Add a migrate function.
 *
 * Example data to migrate:
 * ```
 * <!-- wp:merpress/mermaidjs -->
 * <pre class="mermaid">graph TD
 * A --> B[ok looks good!]
 * %% saving seems to work</pre>
 * <!-- /wp:merpress/mermaidjs -->
 * ```
 */
export default {
	attributes: {
		content: {
			type: 'string',
			source: 'text',
			selector: 'pre.mermaid',
		},
	},
	save: ( { attributes: { content } } ) => {
		const blockProps = useBlockProps.save( {
			className: 'mermaid',
		} );
		return <pre { ...blockProps }>{ content }</pre>;
	},
	migrate: ( attributes ) => {
		return {
			...attributes,
			imgs: [],
			diagramSource: 'mermaid',
		};
	},
	supports: {
		html: false,
		className: false,
	},
};
