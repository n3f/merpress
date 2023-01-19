( function ( mermaid ) {
	if ( typeof mermaid !== 'undefined' ) {
		mermaid.initialize( {
			startOnLoad: false,
			flowchart: {
				useMaxWidth: true,
			},
		} );
		mermaid.init();

		const reloadMermaid = function () {
			setTimeout( function () {
				mermaid.init();
			}, 1000 );
		};
		window.addEventListener( 'load', reloadMermaid );
		// deal with infinite scroll loading
		document.body.addEventListener( 'load', reloadMermaid );
	}
} )( window.mermaid );
