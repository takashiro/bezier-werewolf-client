import {
	jest,
	expect,
	it,
	beforeAll,
	afterAll,
} from '@jest/globals';
import { Role } from '@bezier/werewolf-core';

import { client } from '../../globals.js';
import Lobby from '../../../src/base/Lobby.js';
import type Room from '../../../src/base/Room.js';
import type DashboardPlayer from '../../../src/base/DashboardPlayer.js';
import Dashboard from '../../../src/game/Dashboard.js';
import Card from '../../../src/game/Card.js';
import Player from '../../../src/game/Player.js';
import MemoryStorage from '../../MemoryStorage.js';
import standard from '../../../src/collection/standard/index.js';

const storage = new MemoryStorage();

const lobby = new Lobby(client);
lobby.setStorage(storage);

let room: Room;
let roomId = 0;
let roomKey: string | undefined;

const roles: Role[] = [
	Role.Werewolf,
	Role.Hunter,
	Role.Villager,
	Role.Werewolf,
	Role.Werewolf,
	Role.Villager,
];
const playerNum = 3;
const cardNum = 3;

let dashboard: Dashboard;
let self: DashboardPlayer;
let werewolf: DashboardPlayer;
let villager: DashboardPlayer;

const players: Player[] = [];
const cards: Card[] = [];

beforeAll(async () => {
	room = await lobby.createRoom({
		roles,
		random: false,
	});
	roomId = room.getId();
	roomKey = room.getOwnerKey();
});

afterAll(async () => {
	if (roomKey) {
		await lobby.deleteRoom(roomId, roomKey);
	}
});

it('takes the seat', async () => {
	self = room.createPlayer(1);
	werewolf = room.createPlayer(2);
	villager = room.createPlayer(3);

	dashboard = new Dashboard(self, {
		playerNum,
		cardNum,
	});
	dashboard.addCollection(standard);
	const profile = await self.fetchProfile();
	expect(profile.role).toBe(Role.Werewolf);
	players.push(...dashboard.getPlayers());
	cards.push(...dashboard.getCards());
});

it('should see nothing in the beginning', async () => {
	await dashboard.start();
	expect(players[0].getRole()).toBe(Role.Werewolf);
	expect(players[1].getRole()).toBe(Role.Unknown);
	expect(players[2].getRole()).toBe(Role.Unknown);
	expect(cards[0].getRole()).toBe(Role.Unknown);
	expect(cards[1].getRole()).toBe(Role.Unknown);
	expect(cards[2].getRole()).toBe(Role.Unknown);
});

it('can see other werewolves', async () => {
	const onRoleChanged = jest.fn<(role: Role) => void>();
	players[1].on('roleChanged', onRoleChanged);
	expect(await dashboard.invokeCurrentSkill()).toBe(true);
	expect(onRoleChanged).toHaveBeenCalledTimes(1);
	expect(onRoleChanged).toBeCalledWith(Role.Werewolf);
	expect(players[0].getRole()).toBe(Role.Werewolf);
	expect(players[1].getRole()).toBe(Role.Werewolf);
	expect(players[2].getRole()).toBe(Role.Unknown);
});

it('waits for other players to sit down', async () => {
	await expect(() => dashboard.sync()).rejects.toThrowError('Other players are still taking their seats.');
	await werewolf.fetchProfile();
	await villager.fetchProfile();
});

it('waits for other players to invoke skills', async () => {
	await expect(() => dashboard.sync()).rejects.toThrowError('Other players are still invoking their skills.');
	await werewolf.invokeSkill(0);
	await villager.invokeSkill(0);
});

it('votes to lynch a player', async () => {
	await self.lynchPlayer(3);
	const res = await self.fetchLynchResult();
	expect(res.progress).toEqual({ current: 1, limit: 3 });
	expect(res.votes).toBeUndefined();
});

it('sees lynch results', async () => {
	await werewolf.lynchPlayer(3);
	await villager.lynchPlayer(1);
	const { progress, votes } = await self.fetchLynchResult();
	expect(progress).toEqual({ current: 3, limit: 3 });
	expect(votes).toHaveLength(3);
	expect(votes![0]).toEqual({ source: 1, target: 3 });
	expect(votes![1]).toEqual({ source: 2, target: 3 });
	expect(votes![2]).toEqual({ source: 3, target: 1 });
});
