import {
	it,
	expect,
} from '@jest/globals';

import {
	DashboardPlayer,
	Lobby,
	Room,
	RoomConfiguration,
	BasicBoard,
	BoardObject,
	Card,
	Dashboard,
	Player,
	Skill,
	TeamProfile,
	SingleCardSkill,
	SinglePlayerSkill,
	TargetlessSkill,
	DoubleCardSkill,
	DoublePlayerSkill,
	MultiCardSkill,
	MultiPlayerSkill,
	Collection,
} from '../src';

it('should have the following exports from base package', () => {
	expect(DashboardPlayer).toBeTruthy();
	expect(Lobby).toBeTruthy();
	expect(Room).toBeTruthy();
	expect(RoomConfiguration).toBeTruthy();
});

it('should have the following exports from game package', () => {
	expect(BasicBoard).toBeTruthy();
	expect(BoardObject).toBeTruthy();
	expect(Card).toBeTruthy();
	expect(Dashboard).toBeTruthy();
	expect(Player).toBeTruthy();
	expect(Skill).toBeTruthy();
	expect(TeamProfile).toBeTruthy();
});

it('should have the following exports from collection package', () => {
	expect(Collection).toBeTruthy();
	expect(DoubleCardSkill).toBeTruthy();
	expect(DoublePlayerSkill).toBeTruthy();
	expect(MultiCardSkill).toBeTruthy();
	expect(MultiPlayerSkill).toBeTruthy();
	expect(SingleCardSkill).toBeTruthy();
	expect(SinglePlayerSkill).toBeTruthy();
	expect(TargetlessSkill).toBeTruthy();
});
