import { Vision } from '@bezier/werewolf-core';

import Card from './Card';
import Player from './Player';

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

/**
 * This represents the game board.
 * There are players and center cards.
 */
export default class BasicBoard {
	protected players: Player[];

	protected cards: Card[];

	constructor({
		playerNum,
		cardNum,
	}: BoardOptions) {
		this.players = new Array(playerNum);
		for (let i = 0; i < playerNum; i++) {
			this.players[i] = new Player(i + 1);
		}

		this.cards = new Array(cardNum);
		for (let i = 0; i < cardNum; i++) {
			this.cards[i] = new Card(i);
		}
	}

	/**
	 * @returns A list of players
	 */
	getPlayers(): Player[] {
		return this.players;
	}

	/**
	 * @returns A list of selected players
	 */
	getSelectedPlayers(): Player[] {
		return this.players.filter((player) => player.isSelected());
	}

	/**
	 * Gets a player by seat number.
	 * @param seat seat number
	 * @returns target player
	 */
	getPlayer(seat: number): Player {
		return this.players[seat - 1];
	}

	/**
	 * @returns A list of center cards
	 */
	getCards(): Card[] {
		return this.cards;
	}

	/**
	 * @returns A list of selected center cards
	 */
	getSelectedCards(): Card[] {
		return this.cards.filter((card) => card.isSelected());
	}

	/**
	 * Get a card by position.
	 * @param pos position
	 * @returns target card
	 */
	getCard(pos: number): Card {
		return this.cards[pos];
	}

	/**
	 * Calculate the distance between 2 players.
	 * @param a Player A
	 * @param b Player B
	 * @returns distance
	 */
	getDistance(a: Player, b: Player): number {
		const dist1 = Math.abs(a.getSeat() - b.getSeat());
		const dist2 = this.players.length - dist1;
		return Math.min(dist1, dist2);
	}

	/**
	 * Unselect all cards.
	 */
	unselectAllCards(): void {
		for (const card of this.cards) {
			card.setSelected(false);
		}
	}

	/**
	 * Unselect all players.
	 */
	unelectAllPlayers(): void {
		for (const player of this.players) {
			player.setSelected(false);
		}
	}

	/**
	 * Unselect all players and cards.
	 */
	unselectAll(): void {
		this.unselectAllCards();
		this.unelectAllPlayers();
	}

	/**
	 * Update roles of certain players or cards.
	 * @param vision A vision data
	 */
	update(vision: Vision): void {
		const { players, cards } = vision;
		if (players) {
			for (const { seat, role } of players) {
				const player = this.getPlayer(seat);
				if (player && player.getRole() !== role) {
					player.setRole(role);
				}
			}
		}
		if (cards) {
			for (const { pos, role } of cards) {
				const card = this.getCard(pos);
				if (card && card.getRole() !== role) {
					card.setRole(role);
				}
			}
		}
	}
}
