import { expect, it } from '@jest/globals';
import randstr from '@bezier/werewolf-client/util/randstr';

it('generates a random string', () => {
	const str = randstr(32);
	expect(str).toMatch(/^\w{32}$/);
});
