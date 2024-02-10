import Board from '../game/Board.js';
import Player from '../game/Player.js';
import MultiPlayerSkill from './MultiPlayerSkill.js';

export default class SinglePlayerSkill extends MultiPlayerSkill {
	constructor(board: Board, self: Player) {
		super(board, self, 1);
	}
}
