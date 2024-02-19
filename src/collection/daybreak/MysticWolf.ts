import { Role } from '@bezier/werewolf-core';

import type Player from '../../game/Player.js';
import type CollectionEntry from '../CollectionEntry.js';

import SinglePlayerSkill from '../SinglePlayerSkill.js';
import { Werewolf } from '../standard/Werewolf.js';

export class MysticWolf extends SinglePlayerSkill {
	override filterPlayer(target: Player): boolean {
		if (target === this.owner) {
			return false;
		}
		return super.filterPlayer(target);
	}
}

const mysticWolf: CollectionEntry = {
	role: Role.MysticWolf,
	skills: [Werewolf, MysticWolf],
};

export default mysticWolf;
