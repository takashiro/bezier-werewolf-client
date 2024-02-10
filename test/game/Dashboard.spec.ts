import {
 afterAll,
 beforeAll,
 expect,
 it,
} from '@jest/globals';

import { Role } from '@bezier/werewolf-core';
import Lobby from '../../src/base/Lobby';
import type {
	Room,
	DashboardPlayer,
} from '../../src';
import Dashboard from '../../src/game/Dashboard';
import {
	Collection,
	DoubleCardSkill,
	SinglePlayerSkill,
	TargetlessSkill,
} from '../../src/collection';

import { client } from '../globals';
import MemoryStorage from '../MemoryStorage';

const storage = new MemoryStorage();
const lobby = new Lobby(client);
lobby.setStorage(storage);
const roles: Role[] = [
	Role.Werewolf,
	Role.Villager,
	Role.Drunk,
	Role.Seer,
	Role.Villager,
	Role.Robber,
];
const playerNum = 3;
const cardNum = 3;

let room: Room;
let seer: DashboardPlayer;
let villager: DashboardPlayer;
let seerBoard: Dashboard;
let villagerBoard: Dashboard;
let robber: DashboardPlayer;
let robberBoard: Dashboard;

const col1 = new Collection('fake1');
col1.add({ role: Role.Seer, skills: [DoubleCardSkill] });
const col2 = new Collection('fake2');
col2.add({ role: Role.Villager, skills: [TargetlessSkill] });
col2.add({ role: Role.Robber, skills: [SinglePlayerSkill] });

beforeAll(async () => {
	room = await lobby.createRoom({
		roles,
		random: false,
	});
});

afterAll(async () => {
	await lobby.deleteRoom(room.getId(), room.getOwnerKey() ?? '');
});

it('takes a seat', async () => {
	seer = room.createPlayer(1);
	villager = room.createPlayer(2);
	robber = room.createPlayer(3);
	await Promise.all([
		seer.fetchProfile(),
		villager.fetchProfile(),
		robber.fetchProfile(),
	]);
});

it('creates a dashboard', async () => {
	const dashboards: Dashboard[] = new Array(3);
	const owners = [seer, villager, robber];
	for (let i = 0; i < 3; i++) {
		const dashboard = new Dashboard(owners[i], {
			playerNum,
			cardNum,
		});
		dashboard.addCollection(col1);
		dashboard.addCollection(col2);
		dashboards[i] = dashboard;
	}

	[seerBoard, villagerBoard, robberBoard] = dashboards;
	expect(() => seerBoard.addSkills(Role.Unknown)).toThrowError('Too early to add skills');
});

it('sees one\'s own role', async () => {
	await seerBoard.start();
	expect(seerBoard.getPlayer(1).getRole()).toBe(Role.Seer);

	await villagerBoard.start();
	expect(villagerBoard.getPlayer(2).getRole()).toBe(Role.Villager);

	await expect(() => robberBoard.start()).rejects.toThrowError('Other players are still invoking their skills.');
});

it('can choose two cards', async () => {
	const skill = seerBoard.getCurrentSkill();
	expect(skill).toBeTruthy();

	expect(skill?.filterPlayer(seerBoard.getPlayer(1))).toBe(false);
	expect(skill?.filterPlayer(seerBoard.getPlayer(2))).toBe(false);

	const [card1, card2, card3] = seerBoard.getCards();
	expect(card1.getRole()).toBe(Role.Unknown);
	expect(card2.getRole()).toBe(Role.Unknown);
	expect(card3.getRole()).toBe(Role.Unknown);

	expect(skill?.filterCard(card1)).toBe(true);
	expect(skill?.filterCard(card2)).toBe(true);
	expect(skill?.filterCard(card3)).toBe(true);

	card2.setSelected(true);
	card3.setSelected(true);
	expect(skill?.filterCard(card1)).toBe(false);
	expect(skill?.isFeasible()).toBe(true);
});

it('sees two cards', async () => {
	await seerBoard.invokeCurrentSkill();
	const [card1, card2, card3] = seerBoard.getCards();
	expect(card1.getRole()).toBe(Role.Unknown);
	expect(card2.getRole()).toBe(Role.Villager);
	expect(card3.getRole()).toBe(Role.Drunk);

	const other = seerBoard.getPlayer(2);
	expect(other.getRole()).toBe(Role.Unknown);
});

it('sees nothing', async () => {
	await villagerBoard.invokeCurrentSkill();
	for (const card of villagerBoard.getCards()) {
		expect(card.getRole()).toBe(Role.Unknown);
	}

	const other = villagerBoard.getPlayer(1);
	expect(other.getRole()).toBe(Role.Unknown);
});

it('cannot invoke infinite skills', async () => {
	expect(await villagerBoard.invokeCurrentSkill()).toBe(false);
});

it('adds more skills', async () => {
	await robberBoard.start();
	robberBoard.addSkills(Role.Seer);
	expect(robberBoard.getSkills()).toHaveLength(2);
});

it('robs one\'s role', async () => {
	const self = robberBoard.getPlayer(3);
	expect(self.getRole()).toBe(Role.Robber);

	const target = robberBoard.getPlayer(1);
	target.setSelected(true);
	expect(target.getRole()).toBe(Role.Unknown);

	await robberBoard.invokeCurrentSkill();
	expect(target.getRole()).toBe(Role.Seer);
});
