// eslint-disable-next-line import/no-unresolved
import mermaid from 'mermaid';

window.mermaid = mermaid;

const MERMAID_CONFIG = {
	startOnLoad: true,
	flowchart: {
		useMaxWidth: true,
	},
};

mermaid.initialize( MERMAID_CONFIG );
