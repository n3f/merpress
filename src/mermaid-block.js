import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useMerpressContext } from './context';

export function MermaidBlock() {
	const [ isError, setError ] = useState( false );
	const container = useRef( null );
	const { isSelected, content, updateContext } = useMerpressContext();

	useEffect( () => {
		try {
			window.mermaid.parse( content );
			setError( false );
		} catch ( e ) {
			updateContext( { svg: {} } );
			setError( true );
			return;
		}
		container.current.removeAttribute( 'data-processed' );
		container.current.innerHTML = content;
		window.mermaid.init( undefined, container.current );
		const svgEl = container.current.querySelector( 'svg' );
		const { width, height } = svgEl.getBoundingClientRect();
		const svgText = new XMLSerializer().serializeToString( svgEl );
		updateContext( { svg: { svgText, width, height } } );
	}, [ content, isSelected ] );

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
