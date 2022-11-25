import type Card from './Card';
import type Player from './Player';

export interface BoardOptions {
	/**
	 * Number of players
	 */
	playerNum: number;

	/**
	 * Number of center cards
	 */
	cardNum: number;
}

export interface Board {
	/**
	 * @returns A list of players
	 */
	getPlayers(): Player[];

	/**
	 * @returns A list of selected players
	 */
	getSelectedPlayers(): Player[];

	/**
	 * Gets a player by seat number.
	 * @param seat seat number
	 * @returns target player
	 */
	getPlayer(seat: number): Player;

	/**
	 * @returns A list of center cards
	 */
	getCards(): Card[];

	/**
	 * @returns A list of selected center cards
	 */
	getSelectedCards(): Card[];

	/**
	 * Get a card by position.
	 * @param pos position
	 * @returns target card
	 */
	getCard(pos: number): Card;

	/**
	 * Calculate the distance between 2 players.
	 * @param a Player A
	 * @param b Player B
	 * @returns distance
	 */
	getDistance(a: Player, b: Player): number;

	/**
	 * Unselect all cards.
	 */
	unselectAllCards(): void;

	/**
	 * Unselect all players.
	 */
	unelectAllPlayers(): void

	/**
	 * Unselect all players and cards.
	 */
	unselectAll(): void
}

export default Board;
