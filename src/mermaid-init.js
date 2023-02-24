( function ( mermaid ) {
	if ( typeof mermaid !== 'undefined' ) {
		mermaid.run();

		const reloadMermaid = function () {
			setTimeout( function () {
				mermaid.run();
			}, 1000 );
		};
		window.addEventListener( 'load', reloadMermaid );
		// deal with infinite scroll loading
		// document.body.addEventListener( 'load', reloadMermaid );
	}
} )( window.mermaid );
