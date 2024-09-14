import { useBlockProps } from '@wordpress/block-editor';

export default function Save( props ) {
	const { content, imgs, diagramSource, align } = props.attributes;
	const blockProps = useBlockProps.save( {
		className: `diagram-source-${ diagramSource }${
			align ? ` align${ align }` : ''
		}`,
	} );

	return (
		<div { ...blockProps }>
			<pre className="mermaid">{ content }</pre>
			{ /* Putting a key to make react happy...*/ }
			{ imgs.map( ( img, i ) => {
				return (
					<img
						key={ i }
						src={ img.src }
						width={ img.width }
						height={ img.height }
						alt=""
					/>
				);
			} ) }
		</div>
	);
}
