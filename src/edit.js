import {
	PlainText,
	useBlockProps,
	BlockControls,
} from '@wordpress/block-editor';
import {
	DropdownMenu,
	Toolbar,
	ToolbarButton,
	NoticeList,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { capturePhoto, cog } from '@wordpress/icons';
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

const DIAGRAM = Object.freeze( {
	MERMAID: 'mermaid',
	IMAGE: 'image',
} );

export default function Edit( { attributes, setAttributes, isSelected } ) {
	const {
		content = '',
		imgs = [],
		diagramSource = DIAGRAM.MERMAID,
	} = attributes;

	const [ svg, setSvg ] = useState( {} );
	const [ imgState, setImgState ] = useState( IMG_STATE.NOT_SAVED );
	const [ blockNotices, setBlockNotices ] = useState( [] );

	const { createNotice, removeNotice } = useDispatch( noticesStore );
	const blockProps = useBlockProps();

	/**
	 * Called from the camera button.  Saves the current diagram as a PNG,
	 * updates the block attributes and controls messaging via notices.
	 */
	const saveImg = async () => {
		setImgState( IMG_STATE.SAVING );
		const notice = await createNotice(
			'info',
			__( 'Saving diagram as PNG', 'merpress' ),
			{ type: 'snackbar' }
		);
		try {
			const png = await convertSVGToPNG( svg );
			const media = await storePNG( png );
			setAttributes( {
				imgs: [
					{
						src: media.url,
						width: svg.width,
						height: svg.height,
					},
				],
			} );

			// Handle all the notices and state changes/cleanup.
			removeNotice( notice.notice.id );
			const w = await createNotice(
				'info',
				__( 'Saved diagram as PNG', 'merpress' ),
				{ type: 'snackbar' }
			);
			setTimeout( () => removeNotice( w.notice.id ), 3500 );
		} catch ( e ) {
			// eslint-disable-next-line no-console
			console.log( 'saveImg error', e );
			createNotice(
				'error',
				__( 'Error saving diagram as PNG', 'merpress' )
			);
			setImgState( IMG_STATE.NOT_SAVED );
		}
	};

	/**
	 * Update the IMG_STATE when the imgs attribute changes. (SAVING, SAVED, NOT_SAVED)
	 */
	useEffect( () => {
		if ( imgs.length > 0 ) {
			setImgState( IMG_STATE.SAVED );
		} else {
			setImgState( IMG_STATE.NOT_SAVED );
		}
	}, [ imgs ] );

	/**
	 * When the diagramSource is DIAGRAM.IMAGE, it's possible the diagram will be
	 * out of date. Add a notice letting the user know.
	 */
	useEffect( () => {
		if ( diagramSource === DIAGRAM.IMAGE && imgs.length === 0 ) {
			setAttributes( { diagramSource: DIAGRAM.MERMAID } );
		}

		if ( diagramSource === DIAGRAM.IMAGE ) {
			setBlockNotices( [
				{
					id: 'merpress-image-diagram',
					content: __(
						'Using linked image. Might be out of date from diagram. (The diagram is shown here).',
						'merpress'
					),
					status: 'info',
					isDismissible: false,
				},
			] );
		} else {
			setBlockNotices( [] );
		}
	}, [ diagramSource ] );

	/**
	 * This is an exported function for updating MerpressContext.
	 *
	 * Update this when additional attributes are needed to be distributed.
	 *
	 * @param {*} context
	 */
	const updateContext = ( context ) => {
		if ( context && context.svg !== undefined ) {
			setSvg( context.svg );
		}
		if ( context && context.content !== undefined ) {
			setAttributes( { content: context.content } );
		}
	};

	const merpressContext = {
		isSelected,
		content,
		svg,
		updateContext,
	};

	return (
		<MerpressContext.Provider value={ merpressContext }>
			{
				<BlockControls>
					<Toolbar>
						<ToolbarButton
							label={ __( 'Store diagram as PNG', 'merpress' ) }
							icon={ capturePhoto }
							onClick={ saveImg }
							isBusy={ imgState === IMG_STATE.SAVING }
						/>
						<DropdownMenu
							icon={ cog }
							label={ __( 'MerPress settings', 'merpress' ) }
							controls={ [
								{
									title: __(
										'Use mermaid as diagram',
										'merpress'
									),
									isDisabled:
										diagramSource === DIAGRAM.MERMAID,
									onClick: () => {
										setAttributes( {
											diagramSource: DIAGRAM.MERMAID,
										} );
									},
								},
								{
									title: __(
										'Use image as diagram',
										'merpress'
									),
									isDisabled:
										diagramSource === DIAGRAM.IMAGE ||
										imgs.length === 0,
									onClick: () => {
										setAttributes( {
											diagramSource: DIAGRAM.IMAGE,
										} );
									},
								},
								{
									title: __(
										'Unset saved image',
										'merpress'
									),
									isDisabled:
										imgState === IMG_STATE.NOT_SAVED,
									onClick: () => {
										setAttributes( { imgs: [] } );
									},
								},
							] }
						/>
					</Toolbar>
				</BlockControls>
			}
			<div { ...blockProps }>
				{ isSelected && (
					<>
						<pre className="mermaid-editor wp-block-code">
							<PlainText
								onChange={ ( newContent ) => {
									updateContext( { content: newContent } );
								} }
								value={ content }
							/>
						</pre>
						<hr />
					</>
				) }
				<NoticeList notices={ blockNotices } />
				<MermaidBlock />
			</div>
		</MerpressContext.Provider>
	);
}
