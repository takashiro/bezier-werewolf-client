import { Role } from '@bezier/werewolf-core';
import type Player from '../../game/Player.js';
import type CollectionEntry from '../CollectionEntry.js';
import DoublePlayerSkill from '../DoublePlayerSkill.js';

export class Troublemaker extends DoublePlayerSkill {
	override filterPlayer(target: Player): boolean {
		if (target === this.owner) {
			return false;
		}
		return super.filterPlayer(target);
	}
}

const troublemaker: CollectionEntry = {
	role: Role.Troublemaker,
	skills: [Troublemaker],
};

export default troublemaker;
