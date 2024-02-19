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
	const player = room.createPlayer(1);
	dashboard = new Dashboard(player, {
		playerNum,
		cardNum,
	});
	dashboard.addCollection(standard);
	const profile = await player.fetchProfile();
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
