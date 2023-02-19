import { uploadMedia } from '@wordpress/media-utils';

const RESIZE_FACTOR = 2;

/**
 * Using an svg string convert to a base64 encoded img.
 * 
 * @param {*} svg {object} an svg element.
 *            svg.svgText {string} the svg text.
 *            svg.width {number} the width of the svg.
 *            svg.height {number} the height of the svg.
 * @returns Promise<string> a png base64 encoded string. 
 */
export function convertSVGToPNG( { svgText, width, height } ) {
	const svg64 = 'data:image/svg+xml;base64,' + btoa( unescape( encodeURIComponent( svgText ) ) );
	const img = new Image();
	img.src = svg64;

	return new Promise( ( resolve, reject ) => {
		img.onload = () => {
			var canvas = document.createElement( 'canvas' );
			var ctx = canvas.getContext( '2d' );
			canvas.width = width * RESIZE_FACTOR;
			canvas.height = height * RESIZE_FACTOR;
			ctx.clearRect( 0, 0, canvas.width, canvas.height );
			ctx.drawImage( img, 0, 0 );
			const png = canvas.toDataURL( 'image/png' );
			// console.log( 'img', png );
			resolve( png );
		}
		img.onerror = ( e ) => {
			reject( e );
		}
	} );
}

/**
 * Store the png string in the media library.
 */
export async function storePNG( pngDataURL ){
	// console.log( 'storePNG', pngDataURL );
	// First convert image to a proper blob file
	const resp = await fetch( pngDataURL );
	const blob = await resp.blob();
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