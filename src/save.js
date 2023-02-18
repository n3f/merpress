import { useBlockProps } from '@wordpress/block-editor';

export default function Save( props ) {
	const { content, imgs } = props.attributes;
	const blockProps = useBlockProps.save();

	return <div {...blockProps}>
		<pre class="mermaid">{ content }</pre>
		{/* Putting a key to make react happy...*/}
		{ imgs.map( (img, i) => <img key={i} src={ img.src } width={ img.width } height={ img.height } /> ) }
	</div>
}
