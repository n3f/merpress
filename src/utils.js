import { uploadMedia } from '@wordpress/media-utils';

// Change the image size to 2x the original size.
const RESIZE_FACTOR = 2;

/**
 * Using an svg string convert to a base64 encoded img.
 *
 * @param {Object} svgEl an svg element.
 * @return {Promise<string>} a png base64 encoded string.
 */
export function convertSVGToPNG( svgEl ) {
	/* global XMLSerializer */
	const serializer = new XMLSerializer();
	const svgString = serializer.serializeToString( svgEl );
	const svgBlob = new Blob( [ svgString ], {
		type: 'image/svg+xml;charset=utf-8',
	} );
	const svgUrl = URL.createObjectURL( svgBlob );

	return new Promise( ( resolve, reject ) => {
		/* global Image */
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement( 'canvas' );
			const ctx = canvas.getContext( '2d' );
			canvas.width = svgEl.width.baseVal.value * RESIZE_FACTOR;
			canvas.height = svgEl.height.baseVal.value * RESIZE_FACTOR;

			ctx.clearRect( 0, 0, canvas.width, canvas.height );
			ctx.drawImage( img, 0, 0, canvas.width, canvas.height );

			URL.revokeObjectURL( svgUrl );
			resolve( canvas.toDataURL( 'image/png' ) );
		};
		img.onerror = ( error ) => {
			URL.revokeObjectURL( svgUrl );
			reject( error );
		};
		img.src = svgUrl;
	} );
}

/**
 * Store the png string in the media library.
 *
 * @param {string} pngDataURL a png base64 encoded url.
 */
export async function storePNG( pngDataURL ) {
	// console.log( 'storePNG', pngDataURL );
	// First convert image to a proper blob file
	const resp = await fetch( pngDataURL );
	const blob = await resp.blob();
	// eslint-disable-next-line no-undef
	const file = new File( [ blob ], 'merpress.png', {
		type: 'image/png',
	} );

	return new Promise( ( resolve, reject ) => {
		uploadMedia( {
			filesList: [ file ],
			onFileChange: ( [ img ] ) => {
				if ( ! img.id ) {
					// Otherwise the image is loaded twice...
					return;
				}
				resolve( img );
			},
			onError: ( e ) => {
				reject( e );
			},
			allowedTypes: [ 'image' ],
		} );
	} );
}
