import Board from '../game/Board.js';
import Player from '../game/Player.js';
import MultiPlayerSkill from './MultiPlayerSkill.js';

class DoublePlayerSkill extends MultiPlayerSkill {
	constructor(board: Board, self: Player) {
		super(board, self, 2);
	}
}

export default DoublePlayerSkill;
