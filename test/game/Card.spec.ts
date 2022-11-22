import { expect, it } from '@jest/globals';

import Card from '@bezier/werewolf-client/game/Card';

it('has index', () => {
	const card = new Card(2);
	expect(card.getIndex()).toBe(2);
});
