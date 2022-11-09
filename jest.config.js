/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverageFrom: [
		'src/**/*.ts',
	],
	globalSetup: './test/setup.ts',
	globalTeardown: './test/teardown.ts',
};
