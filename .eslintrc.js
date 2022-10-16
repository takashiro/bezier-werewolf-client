module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/recommended',
	],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
		'consistent-return': 'off',
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				ts: 'never',
				js: 'never',
			},
		],
    indent: 'off',
    'linebreak-style': 'off',
    'no-tabs': 'off',
  },
	settings: {
		'import/resolver': {
			node: {
				extensions: [
					'.ts',
					'.js',
				],
			},
		},
	},
};
