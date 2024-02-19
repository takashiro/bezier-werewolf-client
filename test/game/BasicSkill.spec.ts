import {
	jest,
	expect,
	it,
} from '@jest/globals';
import Board from '../../src/game/BasicBoard.js';
import Player from '../../src/game/Player.js';
import Card from '../../src/game/Card.js';
import BasicSkill from '../../src/game/BasicSkill.js';

jest.mock('../../src/game/BasicBoard');
jest.mock('../../src/game/Player');
jest.mock('../../src/game/Card');

const MockedBoard = jest.mocked(Board);
const MockedPlayer = jest.mocked(Player);
const MockedCard = jest.mocked(Card);

class FakeSkill extends BasicSkill {
	isFeasible(): boolean { // eslint-disable-line class-methods-use-this
		return true;
	}
}

const board = new MockedBoard({ playerNum: 3, cardNum: 3 });
const owner = new MockedPlayer(1);
const skill = new FakeSkill(board, owner);
const card = new MockedCard(1);

it('is marked as used', () => {
	expect(skill.isUsed()).toBe(false);
	skill.setUsed(true);
	expect(skill.isUsed()).toBe(true);
});

it('accepts no targets by default', () => {
	expect(skill.filterCard(card)).toBe(false);
	expect(skill.filterPlayer(owner)).toBe(false);
	expect(skill.isFeasible()).toBe(true);
});
