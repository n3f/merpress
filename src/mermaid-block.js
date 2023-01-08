import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useMerpressContext } from './context';

export function MermaidBlock() {
	const [ isError, setError ] = useState( false );
	const container = useRef( null );
	const { content } = useMerpressContext();

	useEffect( () => {
		try {
			window.mermaid.parse( content );
			setError( false );
		} catch ( e ) {
			setError( true );
		}
		container.current.removeAttribute( 'data-processed' );
		container.current.innerHTML = content;
		window.mermaid.init( undefined, container.current );
	}, [ content ] );

	return (
		<>
			{ isError && (
				<div className="error">
					{ __( 'Syntax Error', 'merpress' ) }
				</div>
			) }
			<div
				ref={ container }
				className={ 'mermaid ${error ? "mermaid-error" : "" }' }
			/>
		</>
	);
}
