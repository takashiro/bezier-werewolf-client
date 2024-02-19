import { Role } from '@bezier/werewolf-core';

import type Player from '../../game/Player.js';
import type CollectionEntry from '../CollectionEntry.js';
import SinglePlayerSkill from '../SinglePlayerSkill.js';

export class Thing extends SinglePlayerSkill {
	override filterPlayer(player: Player): boolean {
		const distance = this.board.getDistance(this.owner, player);
		if (distance !== 1) {
			return false;
		}
		return super.filterPlayer(player);
	}
}

const thing: CollectionEntry = {
	role: Role.Thing,
	skills: [Thing],
};

export default thing;
