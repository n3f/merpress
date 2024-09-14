import {
	PlainText,
	useBlockProps,
	BlockControls,
} from '@wordpress/block-editor';
import {
	ToolbarDropdownMenu,
	Toolbar,
	ToolbarButton,
	NoticeList,
} from '@wordpress/components';
import { useEffect, useState, useCallback } from '@wordpress/element';
import { capturePhoto, cog } from '@wordpress/icons';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import { MermaidBlock } from './mermaid-block';
import { MerpressContext } from './context';
import { convertSVGToPNG, storePNG } from './utils';

import './editor.scss';

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
		align,
	} = attributes;

	const [ svg, setSvg ] = useState( {} );
	const [ imgState, setImgState ] = useState( IMG_STATE.NOT_SAVED );
	const [ blockNotices, setBlockNotices ] = useState( [] );
	const [ refreshTrigger, setRefreshTrigger ] = useState( 0 );

	const { createNotice, removeNotice } = useDispatch( noticesStore );
	const blockProps = useBlockProps( {
		className: align ? `align${ align }` : '',
	} );

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
		if ( imgs && imgs.length > 0 ) {
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
		if ( diagramSource === DIAGRAM.IMAGE && imgs && imgs.length === 0 ) {
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
	}, [ diagramSource, imgs, setAttributes ] );

	/**
	 * This is an exported function for updating MerpressContext.
	 *
	 * Update this when additional attributes are needed to be distributed.
	 *
	 * @param {*} context
	 */
	const updateContext = useCallback(
		( context ) => {
			if ( context && context.svg !== undefined ) {
				setSvg( context.svg );
			}
			if ( context && context.content !== undefined ) {
				setAttributes( { content: context.content } );
			}
		},
		[ setAttributes ]
	);

	const merpressContext = {
		isSelected,
		content,
		svg,
		updateContext,
	};

	useEffect( () => {
		setRefreshTrigger( ( prev ) => prev + 1 );
	}, [ align ] );

	return (
		<MerpressContext.Provider value={ merpressContext }>
			{
				<BlockControls>
					<Toolbar label={ __( 'Merpress', 'merpress' ) }>
						<ToolbarButton
							label={ __( 'Store diagram as PNG', 'merpress' ) }
							icon={ capturePhoto }
							onClick={ saveImg }
							isBusy={ imgState === IMG_STATE.SAVING }
						/>
						<ToolbarDropdownMenu
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
								// Fixes problem with blocks default styling.
								// Test by setting a theme with a different background color and white text.
								style={ {
									backgroundColor: 'inherit',
								} }
							/>
						</pre>
						<hr />
					</>
				) }

				{ blockNotices.length > 0 && (
					<NoticeList
						notices={ blockNotices }
						className="merpress-notice-list"
					/>
				) }

				<MermaidBlock refreshTrigger={ refreshTrigger } />
			</div>
		</MerpressContext.Provider>
	);
}
