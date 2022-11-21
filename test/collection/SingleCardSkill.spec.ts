import {
	it,
	expect,
} from '@jest/globals';

import Board from '../../src/game/Board';
import SingleCardSkill from '../../src/collection/SingleCardSkill';

const board = new Board({
	playerNum: 5,
	cardNum: 3,
});

const owner = board.getPlayer(1);

const skill = new SingleCardSkill(board, owner);

it('accepts 1 card', () => {
	const card1 = board.getCard(0);
	const card2 = board.getCard(1);
	expect(skill.filterCard(card1)).toBe(true);
	expect(skill.filterCard(card2)).toBe(true);
	card1.setSelected(true);
	expect(skill.filterCard(card1)).toBe(false);
	expect(skill.filterCard(card2)).toBe(false);
	expect(skill.isFeasible()).toBe(true);
});

it('accepts no player', () => {
	const player = board.getPlayer(1);
	expect(skill.filterPlayer(player)).toBe(false);
	player.setSelected(true);
	expect(skill.isFeasible()).toBe(false);
});
