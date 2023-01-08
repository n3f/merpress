import { PlainText, useBlockProps } from '@wordpress/block-editor';
import { useCallback } from '@wordpress/element';
import { MermaidBlock } from './mermaid-block';
import { MerpressContext } from './context';

export default function Edit( props ) {
	const { content = '' } = props.attributes;
	const blockProps = useBlockProps();

	const updateContent = useCallback(
		( _content ) => {
			props.setAttributes( { content: _content } );
		},
		[ content ]
	);

	const merpressContext = {
		content,
		setContent: updateContent,
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
