import Board from '../game/BasicBoard';
import Player from '../game/Player';
import MultiPlayerSkill from './MultiPlayerSkill';

export default class SinglePlayerSkill extends MultiPlayerSkill {
	constructor(board: Board, self: Player) {
		super(board, self, 1);
	}
}
