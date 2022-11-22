import {
	it,
	expect,
} from '@jest/globals';

import Board from '@bezier/werewolf-client/game/Board';
import DoublePlayerSkill from '@bezier/werewolf-client/collection/DoublePlayerSkill';

const board = new Board({
	playerNum: 5,
	cardNum: 3,
});

const owner = board.getPlayer(1);

const skill = new DoublePlayerSkill(board, owner);

it('accepts 2 player', () => {
	const player1 = board.getPlayer(1);
	const player2 = board.getPlayer(2);
	expect(skill.filterPlayer(player1)).toBe(true);
	expect(skill.filterPlayer(player2)).toBe(true);
	player2.setSelected(true);
	expect(skill.isFeasible()).toBe(false);
	player1.setSelected(true);
	expect(skill.isFeasible()).toBe(true);
	expect(skill.filterPlayer(player1)).toBe(false);
	expect(skill.filterPlayer(player2)).toBe(false);
});

it('accepts no card', () => {
	const card = board.getCard(0);
	expect(skill.filterCard(card)).toBe(false);
	card.setSelected(true);
	expect(skill.isFeasible()).toBe(false);
});
