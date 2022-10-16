import { expect, it } from '@jest/globals';

import Player from '../../src/game/Player';

it('has a seat', () => {
	const player = new Player(1);
	expect(player.getSeat()).toBe(1);
});