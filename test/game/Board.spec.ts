import { Role, Vision } from '@bezier/werewolf-core';
import {
	expect,
	it,
} from '@jest/globals';

import Board from '@bezier/werewolf-client/game/Board';

const board = new Board({
	playerNum: 5,
	cardNum: 3,
});

it('has 5 players & 3 cards', () => {
	expect(board.getPlayers()).toHaveLength(5);
	expect(board.getCards()).toHaveLength(3);
});

it('unselect all', () => {
	const player = board.getPlayer(2);
	player.setSelected(true);

	const selectedPlayers = board.getSelectedPlayers();
	expect(selectedPlayers).toHaveLength(1);
	expect(selectedPlayers).toContain(player);

	const card = board.getCard(0);
	card.setSelected(true);

	const selectedCards = board.getSelectedCards();
	expect(selectedCards).toHaveLength(1);
	expect(selectedCards).toContain(card);

	board.unselectAll();
	expect(player.isSelected()).toBe(false);
	expect(card.isSelected()).toBe(false);
});

it('calculates distance between 2 players', () => {
	expect(board.getDistance(board.getPlayer(1), board.getPlayer(2))).toBe(1);
	expect(board.getDistance(board.getPlayer(1), board.getPlayer(3))).toBe(2);
	expect(board.getDistance(board.getPlayer(1), board.getPlayer(4))).toBe(2);
	expect(board.getDistance(board.getPlayer(1), board.getPlayer(5))).toBe(1);
	expect(board.getDistance(board.getPlayer(5), board.getPlayer(1))).toBe(1);
});

it('updates vision', () => {
	const vision: Vision = {
		cards: [
			{ role: Role.Werewolf, pos: 2 },
		],
		players: [
			{ role: Role.Witch, seat: 4 },
		],
	};
	board.update(vision);
	expect(board.getCard(2).getRole()).toBe(Role.Werewolf);
	expect(board.getPlayer(4).getRole()).toBe(Role.Witch);
});
