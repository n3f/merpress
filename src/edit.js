import { PlainText, useBlockProps } from '@wordpress/block-editor';
import { MermaidBlock } from './mermaid-block';

export default function Edit( props ) {
	const { content = '' } = props.attributes;
	const blockProps = useBlockProps();

	const updateContent = ( _content ) => {
		props.setAttributes( { content: _content } );
	};

	return (
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
			<MermaidBlock content={ content } />
		</div>
	);
}
