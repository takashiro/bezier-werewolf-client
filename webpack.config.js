/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

/**
 * Configure webpack.
 * @param {Record<string, string>} env environment variables
 * @param {Record<string, string>} argv command-line arguments
 * @return {import('webpack').Configuration} webpack configuration
 */
module.exports = function config(env, argv) {
	const mode = argv?.mode === 'development' ? 'development' : 'production';
	return {
		mode,
		target: 'web',
		entry: {
			index: './src/index.ts',
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: 'ts-loader',
				},
			],
		},
		resolve: {
			extensions: [
				'.ts',
				'.js',
			],
		},
		output: {
			filename: '[name].js',
			path: path.join(__dirname, 'dist'),
			library: {
				name: '@bezier/werewolf-client',
				type: 'umd',
			},
			devtoolModuleFilenameTemplate: '[absolute-resource-path]',
		},
		externals: [
			'@bezier/werewolf-core',
			'@karura/rest-client',
			'mitt',
		],
		devtool: mode !== 'production' ? 'inline-source-map' : undefined,
	};
};
