import Board from '../game/Board';
import Card from '../game/Card';
import Player from '../game/Player';
import Skill from '../game/BasicSkill';

class MultiCardSkill extends Skill {
	constructor(
		board: Board,
		self: Player,
		protected cardNum: number,
	) {
		super(board, self);
	}

	override filterCard(target: Card): boolean {
		const selected = this.board.getSelectedCards();
		return selected.length < this.cardNum && !target.isSelected();
	}

	isFeasible(): boolean {
		const cards = this.board.getSelectedCards();
		const players = this.board.getSelectedPlayers();
		return cards.length === this.cardNum && players.length <= 0;
	}
}

export default MultiCardSkill;
