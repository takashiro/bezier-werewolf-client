import {
	it,
	expect,
} from '@jest/globals';

import {
	DashboardPlayer,
	Lobby,
	Room,
	RoomConfiguration,
	Board,
	BoardObject,
	Card,
	Player,
	Skill,
	TeamProfile,
} from '../src';

it('should have the following exports', () => {
	/* base */
	expect(DashboardPlayer).toBeTruthy();
	expect(Lobby).toBeTruthy();
	expect(Room).toBeTruthy();
	expect(RoomConfiguration).toBeTruthy();

	/* game */
	expect(Board).toBeTruthy();
	expect(BoardObject).toBeTruthy();
	expect(Card).toBeTruthy();
	expect(Player).toBeTruthy();
	expect(Skill).toBeTruthy();
	expect(TeamProfile).toBeTruthy();
});
