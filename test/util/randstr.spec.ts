import { expect, it } from '@jest/globals';
import randstr from '../../src/util/randstr';

it('generates a random string', () => {
	const str = randstr(32);
	expect(str).toMatch(/^\w{32}$/);
});
