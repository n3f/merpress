const MERMAID_CONFIG = {
	startOnLoad: true,
	flowchart: {
		useMaxWidth: true,
	},
};

function loadMermaid( mermaid ) {
	// Loop until mermaid is defined
	if ( ! mermaid ) {
		setTimeout( () => {
			loadMermaid( window?.mermaid || '' );
		}, 100 );
		return;
	}
	mermaid.initialize( MERMAID_CONFIG );
}

loadMermaid( window?.mermaid || '' );
