import Board from '../game/Board.js';
import Player from '../game/Player.js';
import Skill from '../game/BasicSkill.js';

class MultiPlayerSkill extends Skill {
	constructor(
		board: Board,
		self: Player,
		protected playerNum: number,
	) {
		super(board, self);
	}

	override filterPlayer(target: Player): boolean {
		const selected = this.board.getSelectedPlayers();
		return selected.length < this.playerNum && !target.isSelected();
	}

	isFeasible(): boolean {
		const cards = this.board.getSelectedCards();
		const players = this.board.getSelectedPlayers();
		return cards.length <= 0 && players.length === this.playerNum;
	}
}

export default MultiPlayerSkill;
