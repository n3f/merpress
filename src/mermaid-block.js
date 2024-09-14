import { useState, useCallback, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useMerpressContext } from './context';

export function MermaidBlock( { refreshTrigger } ) {
	const [ isError, setError ] = useState( false );
	const container = useRef( null );
	const { content, updateContext } = useMerpressContext();

	const processContent = useCallback(
		async function processContent( _content ) {
			try {
				await window.mermaid.parse( _content );
				setError( false );
				container.current?.removeAttribute( 'data-processed' );
				container.current.innerHTML = _content;

				const getSVG = () => {
					return new Promise( ( resolve ) => {
						const cb = () => {
							const svgEl =
								container.current.querySelector( 'svg' );
							resolve( svgEl );
						};
						window.mermaid.run( {
							nodes: [ container.current ],
							postRenderCallback: cb,
						} );
					} );
				};
				const svg = await getSVG();
				updateContext( { svg } );
			} catch ( e ) {
				// eslint-disable-next-line no-console
				console.error( e );
				updateContext( { svg: {} } );
				setError( true );
			}
		},
		[ updateContext ]
	);

	useEffect( () => {
		processContent( content );
	}, [ content, processContent, refreshTrigger ] );

	return (
		<>
			{ isError && (
				<div className="error">
					{ __( 'Syntax Error', 'merpress' ) }
				</div>
			) }
			<div
				ref={ container }
				className={ `mermaid ${ isError ? 'mermaid-error' : '' }` }
			/>
		</>
	);
}
