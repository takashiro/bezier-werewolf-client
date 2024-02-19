import { Role } from '@bezier/werewolf-core';

import type Player from '../../game/Player.js';
import type CollectionEntry from '../CollectionEntry.js';

import SinglePlayerSkill from '../SinglePlayerSkill.js';

export class ParanormalInvestigator extends SinglePlayerSkill {
	protected usedCount = 0;

	override isUsed(): boolean {
		if (this.usedCount <= 0 || !super.isUsed()) {
			return false;
		}

		return this.owner.getRole() === Role.Werewolf || this.usedCount >= 2;
	}

	override filterPlayer(target: Player): boolean {
		if (target === this.owner) {
			return false;
		}
		return super.filterPlayer(target);
	}

	override takeEffect(): void {
		super.takeEffect();
		this.usedCount++;
	}
}

const paranormalInvestigator: CollectionEntry = {
	role: Role.ParanormalInvestigator,
	skills: [ParanormalInvestigator],
};

export default paranormalInvestigator;
