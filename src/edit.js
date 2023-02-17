import { PlainText, useBlockProps, BlockControls } from '@wordpress/block-editor';
import { Toolbar, ToolbarButton } from '@wordpress/components';
import { useCallback, useState } from '@wordpress/element';
import { capturePhoto, update } from '@wordpress/icons';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import { MermaidBlock } from './mermaid-block';
import { MerpressContext } from './context';

const IMG_STATE = Object.freeze( {
	NOT_SAVED: { value: 0, label: 'not saved' },
	SAVING: { value: 1, label: 'saving' },
	SAVED: { value: 2, label: 'saved' },
} );


export default function Edit( { attributes, setAttributes, isSelected } ) {
	const { content = '', img={} } = attributes;
	const [ svg, setSvg ] = useState( '' );
	const [ imgState, setImgState ] = useState( IMG_STATE.NOT_SAVED );
	const { createNotice, removeNotice } = useDispatch( noticesStore );
	const blockProps = useBlockProps();

	const saveImg = ( evt ) => {
		console.log( 'saveImg' );
		setImgState( IMG_STATE.SAVING );
		const notice = createNotice( 'info', 'Saving diagram as PNG', { type: 'snackbar'});
		setTimeout( async () => {
			let p = await notice;
			console.log(notice, p);
			removeNotice( p.notice.id );
			let w = await createNotice( 'warning', 'Saved diagram as PNG' );
			setImgState( IMG_STATE.SAVED );
		}, 5000 );
	};

	const resetImg = ( evt ) => {
		console.log( 'resetImg' );
		setImgState( IMG_STATE.NOT_SAVED );
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
