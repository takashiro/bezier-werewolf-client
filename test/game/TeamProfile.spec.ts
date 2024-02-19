import { expect, it } from '@jest/globals';
import { Role, Team } from '@bezier/werewolf-core';

import TeamProfile from '../../src/game/TeamProfile.js';

it('categorizes roles into teams', () => {
	const teams = TeamProfile.fromRoles([
		Role.AlphaWolf,
		Role.Werewolf,
		Role.Villager,
		Role.Seer,
		Role.Tanner,
	]);

	expect(teams).toHaveLength(3);

	const [teamWerewolf, teamVillager, other] = teams;
	expect(teamWerewolf.team).toBe(Team.Werewolf);
	expect(teamWerewolf.roles).toHaveLength(2);
	expect(teamWerewolf.roles).toContain(Role.Werewolf);
	expect(teamWerewolf.roles).toContain(Role.AlphaWolf);

	expect(teamVillager.team).toBe(Team.Villager);
	expect(teamVillager.roles).toHaveLength(2);
	expect(teamVillager.roles).toContain(Role.Villager);
	expect(teamVillager.roles).toContain(Role.Seer);

	expect(other.team).toBe(Team.Other);
	expect(other.roles).toHaveLength(1);
	expect(other.roles).toContain(Role.Tanner);
});

it('ignores unknown roles', () => {
	const teams = TeamProfile.fromRoles([-1 as Role]);
	expect(teams).toHaveLength(0);
});
