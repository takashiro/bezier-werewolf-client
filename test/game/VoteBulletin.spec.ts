import {
	afterAll,
	beforeAll,
	expect,
	it,
} from '@jest/globals';

import { Role } from '@bezier/werewolf-core';
import Lobby from '../../src/base/Lobby.js';
import type {
	Room,
	DashboardPlayer,
} from '../../src/index.js';
import VoteBulletin from '../../src/game/VoteBulletin.js';

import { client } from '../globals.js';
import MemoryStorage from '../MemoryStorage.js';

const storage = new MemoryStorage();
const lobby = new Lobby(client);
lobby.setStorage(storage);
const roles: Role[] = [
	Role.Troublemaker,
	Role.Villager,
	Role.Drunk,
	Role.Seer,
	Role.Villager,
	Role.Werewolf,
];

let room: Room;
let seer: DashboardPlayer;
let villager: DashboardPlayer;
let werewolf: DashboardPlayer;

let bulletin: VoteBulletin;

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
	werewolf = room.createPlayer(3);
	await Promise.all([
		seer.fetchProfile(),
		villager.fetchProfile(),
		werewolf.fetchProfile(),
	]);
});

it('invokes skills', async () => {
	await Promise.all([
		seer.invokeSkill(0, { players: [2, 3] }),
		villager.invokeSkill(0),
		werewolf.invokeSkill(0),
	]);
});

it('creates a vote bulletin', async () => {
	bulletin = new VoteBulletin(seer);
	expect(bulletin.isFinished()).toBe(false);

	await bulletin.sync();
	const progress = bulletin.getProgress();
	expect(progress?.current).toBe(0);
	expect(progress?.limit).toBe(3);
});

it('votes', async () => {
	await villager.lynchPlayer(3);

	await bulletin.sync();
	const progress = bulletin.getProgress();
	expect(progress?.current).toBe(1);
	expect(progress?.limit).toBe(3);
	expect(bulletin.isFinished()).toBe(false);
});

it('checks vote results', async () => {
	await seer.lynchPlayer(3);
	await werewolf.lynchPlayer(1);

	await bulletin.sync();
	const progress = bulletin.getProgress();
	expect(progress?.current).toBe(3);
	expect(progress?.limit).toBe(3);

	expect(bulletin.isFinished());
	expect(bulletin.getVotes()).toEqual([
		{ source: 1, target: 3 },
		{ source: 2, target: 3 },
		{ source: 3, target: 1 },
	]);
});
