import type Card from './Card';
import type Player from './Player';

export interface Skill {
	/**
	 * @returns Whether the skill has been used.
	 */
	isUsed(): boolean;

	/**
	 * Sets used state.
	 * @param used whether the skill has been used.
	 */
	setUsed(used: boolean): void;

	/**
	 * Filter valid card targets. Invalid targets cannot be selected.
	 * @param target current card
	 * @returns Whether the card is valid
	 */
	filterCard(target: Card): boolean;

	/**
	 * Filter valid player targets. Invalid targets cannot be selected.
	 * @param target current player
	 * @returns Whether the player is valid
	 */
	filterPlayer(target: Player): boolean;

	/**
	 * Whether the skill can be invoked.
	 * It usually depends on selected cards and players.
	 */
	isFeasible(): boolean;
}

export default Skill;
