import {
	it,
	expect,
} from '@jest/globals';

import Board from '@bezier/werewolf-client/game/Board';
import TargetlessSkill from '@bezier/werewolf-client/collection/TargetlessSkill';

const board = new Board({
	playerNum: 5,
	cardNum: 3,
});

const owner = board.getPlayer(1);

const skill = new TargetlessSkill(board, owner);

it('accepts no card', () => {
	const card = board.getCard(0);
	expect(skill.filterCard(card)).toBe(false);
	card.setSelected(true);
	expect(skill.isFeasible()).toBe(false);
});

it('accepts no player', () => {
	const player = board.getPlayer(4);
	expect(skill.filterPlayer(player)).toBe(false);
	player.setSelected(true);
	expect(skill.isFeasible()).toBe(false);
});

it('is valid when nothing is selected', () => {
	board.unselectAll();
	expect(skill.isFeasible()).toBe(true);
});
