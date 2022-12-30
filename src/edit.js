import { PlainText, useBlockProps } from '@wordpress/block-editor';
import { MermaidBlock } from './mermaid-block';

export default function Edit( props ) {
    const { content = '' } = props.attributes;
    const blockProps = useBlockProps();

    function updateContent( content ) {
        props.setAttributes( { content } );
    }

    return <div { ...blockProps } >
        { props.isSelected &&
        <pre className='mermaid-editor wp-block-code'>
            <PlainText onChange={ updateContent } value={ content } />
        </pre>
        }
        { props.isSelected && <hr/> }
        <MermaidBlock content={ content } />
    </div>
}
