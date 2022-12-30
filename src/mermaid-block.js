import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function MermaidBlock( props ) {
	const { content } = props;
	const [ isError, setError ] = useState( false );
	const container = useRef( null );

	useEffect( () => {
		try {
			mermaid.parse( content );
			setError( false );
			container.current.removeAttribute( 'data-processed' );
			container.current.innerHTML = content;
			mermaid.init( undefined, container.current );
		} catch ( e ) {
			setError( true );
		}
	}, [ content ] );
 
	return <>
		{ isError && <div className='error'>{__( 'Syntax Error', 'merpress' ) }</div> }
		<div ref={ container } className={ 'mermaid ${error ? "mermaid-error" : "" }' }/>
	</>;
}
