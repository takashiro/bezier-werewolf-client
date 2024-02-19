import {
	it,
	expect,
} from '@jest/globals';

import Board from '../../src/game/BasicBoard.js';
import SinglePlayerSkill from '../../src/collection/SinglePlayerSkill.js';

const board = new Board({
	playerNum: 5,
	cardNum: 3,
});

const owner = board.getPlayer(1);

const skill = new SinglePlayerSkill(board, owner);

it('accepts 1 player', () => {
	const player1 = board.getPlayer(1);
	const player2 = board.getPlayer(2);
	expect(skill.filterPlayer(player1)).toBe(true);
	expect(skill.filterPlayer(player2)).toBe(true);
	player2.setSelected(true);
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
