import { PlainText, useBlockProps } from '@wordpress/block-editor';
import { useCallback, useState } from '@wordpress/element';
import { MermaidBlock } from './mermaid-block';
import { MerpressContext } from './context';

export default function Edit( props ) {
	const { content = '' } = props.attributes;
	const [ svg, setSvg ] = useState( '' );
	const blockProps = useBlockProps();

	const updateContent = useCallback(
		( _content ) => {
			props.setAttributes( { content: _content } );
		},
		[ content ]
	);

	const updateContext = ( context ) => {
		if ( context && context.content ) {
			updateContent( context.content );
		}
		if ( context && context.svg !== undefined ) {
			setSvg( context.svg );
		}
	};

	const merpressContext = {
		isSelected: props.isSelected,
		content,
		svg,
		setContext: updateContext,
	};

	return (
		<MerpressContext.Provider value={ merpressContext }>
			<div { ...blockProps }>
				{ props.isSelected && (
					<>
						<pre className="mermaid-editor wp-block-code">
							<PlainText
								onChange={ updateContent }
								value={ content }
							/>
						</pre>
						<hr />
					</>
				) }
				<MermaidBlock />
			</div>
		</MerpressContext.Provider>
	);
}
