import { Role } from '@bezier/werewolf-core';

import type Player from '../../game/Player.js';
import type CollectionEntry from '../CollectionEntry.js';

import { Werewolf } from '../standard/Werewolf.js';
import SinglePlayerSkill from '../SinglePlayerSkill.js';

export class AlphaWolf extends SinglePlayerSkill {
	override filterPlayer(target: Player): boolean {
		if (target === this.owner) {
			return false;
		}
		return super.filterPlayer(target);
	}
}

const alphaWolf: CollectionEntry = {
	role: Role.AlphaWolf,
	skills: [Werewolf, AlphaWolf],
};

export default alphaWolf;
