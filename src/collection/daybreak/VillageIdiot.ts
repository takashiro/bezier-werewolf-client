import { Role } from '@bezier/werewolf-core';

import type Player from '../../game/Player.js';
import type CollectionEntry from '../CollectionEntry.js';
import SinglePlayerSkill from '../SinglePlayerSkill.js';

export class VillageIdiot extends SinglePlayerSkill {
	override filterPlayer(target: Player): boolean {
		const distance = this.board.getDistance(this.owner, target);
		if (distance > 1) {
			return false;
		}
		return super.filterPlayer(target);
	}
}

const villageIdiot: CollectionEntry = {
	role: Role.VillageIdiot,
	skills: [VillageIdiot],
};

export default villageIdiot;
