import { useBlockProps } from '@wordpress/block-editor';

export default function Save( props ) {
	const { content, img } = props.attributes;
	const classes = `mermaid ${ img && img.src ? 'img-override' : ''}`.trim();
	const blockProps = useBlockProps.save( {
		className: classes,
	} );

	return <>
		<pre { ...blockProps }>{ content }</pre>
		{ img.src && <img src={ img.src } width={ img.width } height={ img.height } /> }
	</>
}
