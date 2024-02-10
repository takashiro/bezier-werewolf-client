/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	testEnvironment: 'node',
	collectCoverageFrom: [
		'src/**/*.ts',
	],
	globalSetup: './test/setup.js',
	globalTeardown: './test/teardown.js',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				useESM: true,
			},
		],
	},
};
