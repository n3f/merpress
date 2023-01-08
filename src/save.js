import { useBlockProps } from '@wordpress/block-editor';

export default function Save( props ) {
	const { content } = props.attributes;
	const blockProps = useBlockProps.save( {
		className: 'mermaid',
	} );

	return <pre { ...blockProps }>{ content }</pre>;
}
