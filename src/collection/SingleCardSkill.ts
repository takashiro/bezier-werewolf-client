import Card from '../game/Card';
import Skill from '../game/BasicSkill';

export default class SingleCardSkill extends Skill {
	override filterCard(target: Card): boolean {
		const selected = this.board.getSelectedCards();
		return selected.length < 1 && !target.isSelected();
	}

	override isFeasible(): boolean {
		const cards = this.board.getSelectedCards();
		const players = this.board.getSelectedPlayers();
		return cards.length === 1 && players.length <= 0;
	}
}
