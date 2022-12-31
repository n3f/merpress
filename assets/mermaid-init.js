(function ( mermaid ) {
	if (typeof mermaid !== "undefined") {
		mermaid.initialize({
			startOnLoad: false,
			flowchart: {
				useMaxWidth: true,
			}
		});
		mermaid.init();

		// deal with infinite scroll loading
		document.body.addEventListener('post-load', function () {
			setTimeout(function () {
				mermaid.init();
			}, 1000);
		});
	}
})(
	window.mermaid
);

