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
} from '@bezier/werewolf-client';

it('should have the following exports', () => {
	/* base */
	expect(DashboardPlayer).toBeTruthy();
	expect(Lobby).toBeTruthy();
	expect(Room).toBeTruthy();
	expect(RoomConfiguration).toBeTruthy();

	/* game */
	expect(BasicBoard).toBeTruthy();
	expect(BoardObject).toBeTruthy();
	expect(Card).toBeTruthy();
	expect(Player).toBeTruthy();
	expect(Skill).toBeTruthy();
	expect(TeamProfile).toBeTruthy();

	/* collection */
	expect(Collection).toBeTruthy();
	expect(DoubleCardSkill).toBeTruthy();
	expect(DoublePlayerSkill).toBeTruthy();
	expect(MultiCardSkill).toBeTruthy();
	expect(MultiPlayerSkill).toBeTruthy();
	expect(SingleCardSkill).toBeTruthy();
	expect(SinglePlayerSkill).toBeTruthy();
	expect(TargetlessSkill).toBeTruthy();
});
