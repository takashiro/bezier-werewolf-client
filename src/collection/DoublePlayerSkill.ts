import Board from '../game/Board';
import Player from '../game/Player';
import MultiPlayerSkill from './MultiPlayerSkill';

class DoublePlayerSkill extends MultiPlayerSkill {
	constructor(board: Board, self: Player) {
		super(board, self, 2);
	}
}

export default DoublePlayerSkill;
