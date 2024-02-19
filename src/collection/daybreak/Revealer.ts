import { Role } from '@bezier/werewolf-core';

import type Player from '../../game/Player.js';
import type CollectionEntry from '../CollectionEntry.js';

import SinglePlayerSkill from '../SinglePlayerSkill.js';

export class Revealer extends SinglePlayerSkill {
	override filterPlayer(target: Player): boolean {
		if (target === this.owner) {
			return false;
		}
		return super.filterPlayer(target);
	}
}

const revealer: CollectionEntry = {
	role: Role.Revealer,
	skills: [Revealer],
};

export default revealer;
