import Board from '../game/Board.js';
import Player from '../game/Player.js';
import MultiCardSkill from './MultiCardSkill.js';

class DoubleCardSkill extends MultiCardSkill {
	constructor(board: Board, self: Player) {
		super(board, self, 2);
	}
}

export default DoubleCardSkill;
