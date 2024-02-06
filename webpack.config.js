const webpack = require( 'webpack' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	externals: {
		...defaultConfig.externals,
		mermaid: 'mermaid',
	},
};
