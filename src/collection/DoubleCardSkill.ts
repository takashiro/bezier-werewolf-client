import Board from '../game/Board';
import Player from '../game/Player';
import MultiCardSkill from './MultiCardSkill';

class DoubleCardSkill extends MultiCardSkill {
	constructor(board: Board, self: Player) {
		super(board, self, 2);
	}
}

export default DoubleCardSkill;
