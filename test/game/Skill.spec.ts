import {
	jest,
	expect,
	it,
} from '@jest/globals';
import Board from '../../src/game/Board';
import Player from '../../src/game/Player';
import Card from '../../src/game/Card';
import Skill from '../../src/game/Skill';

jest.mock('../../src/game/Board');
jest.mock('../../src/game/Player');
jest.mock('../../src/game/Card');

const MockedBoard = jest.mocked(Board);
const MockedPlayer = jest.mocked(Player);
const MockedCard = jest.mocked(Card);

class FakeSkill extends Skill {
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

it('accepts all targets by default', () => {
	expect(skill.filterCard(card)).toBe(true);
	expect(skill.filterPlayer(owner)).toBe(true);
	expect(skill.isFeasible()).toBe(true);
});