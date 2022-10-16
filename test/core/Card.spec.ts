import { expect, it } from '@jest/globals';

import Card from '../../src/core/Card';

it('has index', () => {
	const card = new Card(2);
	expect(card.getIndex()).toBe(2);
});
