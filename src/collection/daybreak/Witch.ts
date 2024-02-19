import { Role } from '@bezier/werewolf-core';

import type Card from '../../game/Card.js';
import type Player from '../../game/Player.js';
import type CollectionEntry from '../CollectionEntry.js';

import Skill from '../../game/BasicSkill.js';

export class Witch extends Skill {
	protected selectedCard?: Card;

	protected selectedPlayer?: Player;

	override isUsed(): boolean {
		return super.isUsed() && Boolean(this.selectedCard && this.selectedPlayer);
	}

	override filterCard(target: Card): boolean {
		if (this.selectedCard) {
			return false;
		}
		return super.filterCard(target);
	}

	override filterPlayer(target: Player): boolean {
		if (!this.selectedCard || this.selectedPlayer) {
			return false;
		}
		return super.filterPlayer(target);
	}

	override isFeasible(): boolean {
		const cards = this.board.getSelectedCards();
		const players = this.board.getSelectedPlayers();
		if (!this.selectedCard) {
			if (cards.length === 1 && players.length <= 0) {
				return true;
			}
		} else if (!this.selectedPlayer) {
			if (cards.length === 0 && players.length === 1) {
				return true;
			}
		}
		return false;
	}

	override takeEffect(): void {
		const selectedCards = this.board.getSelectedCards();
		const selectedPlayers = this.board.getSelectedPlayers();
		if (!this.selectedCard) {
			[this.selectedCard] = selectedCards;
		} else if (!this.selectedPlayer) {
			[this.selectedPlayer] = selectedPlayers;
		}
	}
}

const witch: CollectionEntry = {
	role: Role.Witch,
	skills: [Witch],
};

export default witch;
