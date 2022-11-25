import Board from './Board';
import Card from './Card';
import Player from './Player';

export default abstract class BasicSkill {
	protected board: Board;

	protected owner: Player;

	protected used = false;

	/**
	 * Create a skill.
	 * @param board Game board
	 * @param owner Skill owner
	 */
	constructor(board: Board, owner: Player) {
		this.board = board;
		this.owner = owner;
	}

	/**
	 * @returns Whether the skill has been used.
	 */
	isUsed(): boolean {
		return this.used;
	}

	/**
	 * Sets used state.
	 * @param used whether the skill has been used.
	 */
	setUsed(used: boolean): void {
		this.used = used;
	}

	/**
	 * Filter valid card targets. Invalid targets cannot be selected.
	 * @param target current card
	 * @returns Whether the card is valid
	 */
	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	filterCard(target: Card): boolean {
		return false;
	}

	/**
	 * Filter valid player targets. Invalid targets cannot be selected.
	 * @param target current player
	 * @returns Whether the player is valid
	 */
	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
	filterPlayer(target: Player): boolean {
		return false;
	}

	/**
	 * Whether the skill can be invoked.
	 * It usually depends on selected cards and players.
	 */
	abstract isFeasible(): boolean;
}
