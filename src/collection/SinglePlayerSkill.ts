import Player from '../game/Player';
import Skill from '../game/Skill';

export default class SinglePlayerSkill extends Skill {
	override filterPlayer(target: Player): boolean {
		const selected = this.board.getSelectedPlayers();
		return selected.length < 1 && !target.isSelected();
	}

	override isFeasible(): boolean {
		const cards = this.board.getSelectedCards();
		const players = this.board.getSelectedPlayers();
		return cards.length <= 0 && players.length === 1;
	}
}
