import { PlainText, useBlockProps, BlockControls } from '@wordpress/block-editor';
import { Toolbar, ToolbarButton } from '@wordpress/components';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { capturePhoto, update } from '@wordpress/icons';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import { MermaidBlock } from './mermaid-block';
import { MerpressContext } from './context';
import { convertSVGToPNG, storePNG } from './utils';

const IMG_STATE = Object.freeze( {
	NOT_SAVED: { value: 0, label: 'not saved' },
	SAVING: { value: 1, label: 'saving' },
	SAVED: { value: 2, label: 'saved' },
} );


export default function Edit( { attributes, setAttributes, isSelected } ) {
	const { content = '', img={} } = attributes;
	const [ svg, setSvg ] = useState( {} );
	const [ imgState, setImgState ] = useState( IMG_STATE.NOT_SAVED );
	const { createNotice, removeNotice } = useDispatch( noticesStore );
	const blockProps = useBlockProps();

	const saveImg = async ( evt ) => {
		console.log( 'saveImg' );
		setImgState( IMG_STATE.SAVING );
		const notice = await createNotice( 'info', __( 'Saving diagram as PNG', 'merpress' ), { type: 'snackbar'});
		try {
			const png = await convertSVGToPNG( svg );
			const media = await storePNG( png );
			console.log( 'media', media );
			setAttributes( {
				img: {
					src: media.url,
					width: svg.width,
					height: svg.height,
				}
			} );

			// Handle all the notices and state changes/cleanup.
			removeNotice( notice.notice.id );
			let w = await createNotice( 'info', __( 'Saved diagram as PNG', 'merpress' ), { type: 'snackbar'} );
			setTimeout( () => removeNotice( w.notice.id ), 3500 );
		} catch ( e ) {
			console.log( 'error', e );
			createNotice( 'error', __( 'Error saving diagram as PNG', 'merpress' ) );
			setImgState( IMG_STATE.NOT_SAVED );
		}
	};

	useEffect( () => {
		if ( img.src ) {
			setImgState( IMG_STATE.SAVED );
		}
		else {
			setImgState( IMG_STATE.NOT_SAVED );
		}
	}, [ img ] );

	const resetImg = ( evt ) => {
		console.log( 'resetImg' );
		setAttributes( { img: {} } );
	};

	const updateContent = useCallback(
		( _content ) => {
			setAttributes( { content: _content } );
		},
		[ content ]
	);

	const updateContext = ( context ) => {
		if ( context && context.content ) {
			updateContent( context.content );
		}
		if ( context && context.svg !== undefined ) {
			console.log( 'svg', context.svg );
			setSvg( context.svg );
		}
	};

	const merpressContext = {
		isSelected,
		content,
		svg,
		setContext: updateContext,
	};

	return (
		<MerpressContext.Provider value={ merpressContext }>
			{
				<BlockControls>
					<Toolbar label={ __( 'MerPress', 'merpress' ) }>
						<ToolbarButton
							label={ __( 'Store diagram as PNG', 'merpress' ) }
							icon={ capturePhoto }
							onClick={ saveImg }
							isBusy={ imgState == IMG_STATE.SAVING }
							/>
						{ imgState == IMG_STATE.SAVED && <ToolbarButton
							label={ __( 'Unset PNG', 'merpress' ) }
							icon={ update }
							onClick={ resetImg }
							/> }
					</Toolbar>
				</BlockControls>
			}
			<div { ...blockProps }>
				{ isSelected && (
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
				<MermaidBlock />
			</div>
		</MerpressContext.Provider>
	);
}
