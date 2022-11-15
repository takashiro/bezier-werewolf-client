import {
	jest,
	it,
	expect,
	describe,
	afterAll,
} from '@jest/globals';
import {
	Client,
	ScopedStorage,
} from '@karuta/rest-client';
import {
	Role,
	Room as RoomConfig,
} from '@bezier/werewolf-core';

import Lobby from '../../src/base/Lobby';
import Room from '../../src/base/Room';
import { client } from '../globals';
import MemoryStorage from '../MemoryStorage';

const storage = new MemoryStorage();

describe('Normal Cases', () => {
	const lobby = new Lobby(client);
	lobby.setStorage(new ScopedStorage('lobby', storage));

	const self: RoomConfig = {
		id: 0,
		salt: '',
		roles: [],
	};

	afterAll(async () => {
		if (self.id > 0) {
			await lobby.deleteRoom(self.id, self.ownerKey ?? '');
		}
	});

	it('has a capacity of 1000 by default', async () => {
		const status = await lobby.getStatus();
		expect(status.capacity).toBe(1000);
	});

	it('creates a room', async () => {
		const roles: Role[] = [
			Role.Werewolf,
			Role.Werewolf,
			Role.Villager,
			Role.Villager,
			Role.Villager,
			Role.Witch,
		];

		const roomChanged = jest.fn();
		lobby.on('roomChanged', roomChanged);

		await lobby.createRoom({
			roles,
		});

		const room = lobby.getRoom();
		expect(roomChanged).toBeCalledTimes(1);
		expect(roomChanged).toBeCalledWith(room);

		const config = room?.getConfig();
		expect(config?.cardNum).toBe(3);
		expect(config?.roles).toHaveLength(6);

		Object.assign(self, config);
	});

	it('enters an existing room', async () => {
		await lobby.enterRoom(self.id);
		const room = lobby.getRoom();
		expect(room?.getId()).toBe(self.id);
		expect(room?.getOwnerKey()).not.toBeUndefined();

		const config = room?.getConfig();
		expect(config?.cardNum).toBe(3);
		expect(config?.roles).toHaveLength(6);
	});

	it('enters a new room', async () => {
		storage.clear();

		await lobby.enterRoom(self.id);
		const room = lobby.getRoom();
		expect(room?.getId()).toBe(self.id);
		expect(room?.getOwnerKey()).toBeUndefined();

		const config = room?.getConfig();
		expect(config?.cardNum).toBe(3);
		expect(config?.roles).toHaveLength(6);
	});

	it('cannot delete a room without owner key', async () => {
		await expect(() => lobby.deleteRoom(self.id, '12356')).rejects.toThrowError('The room does not exist');
	});
});

describe('Clear expired rooms', () => {
	const lobby = new Lobby(client);
	lobby.setStorage(new ScopedStorage('lobby', storage));

	const rooms: Room[] = [];

	afterAll(async () => {
		await Promise.all(rooms.map(async (room) => {
			const ownerKey = room.getOwnerKey();
			if (!ownerKey) {
				return;
			}
			const id = room.getId();
			await lobby.deleteRoom(id, ownerKey);
		}));
	});

	it('creates 2 rooms', async () => {
		const roles: Role[] = [
			Role.Werewolf,
			Role.Werewolf,
			Role.Villager,
			Role.Villager,
			Role.Villager,
			Role.Seer,
		];
		const a = await lobby.createRoom({ roles });
		const b = await lobby.createRoom({ roles });
		rooms.push(a);
		rooms.push(b);

		expect(lobby.hasRoom(a.getId())).toBe(true);
		expect(lobby.hasRoom(b.getId())).toBe(true);

		const expiryMap = JSON.parse(storage.getItem('lobby-expiry-map') ?? '');
		expiryMap[a.getId()] = 78;
		expiryMap.invalid = {};
		storage.setItem('lobby-expiry-map', JSON.stringify(expiryMap));

		expect(lobby.hasRoom(a.getId())).toBe(false);
		expect(lobby.hasRoom(b.getId())).toBe(true);

		const newExpiryMap = JSON.parse(storage.getItem('lobby-expiry-map') ?? '');
		expect(Object.keys(newExpiryMap)).toStrictEqual([String(b.getId())]);
	});

	it('cannot save a non-existing room', async () => {
		const [a] = rooms;
		const getId = jest.spyOn(a, 'getId').mockReturnValue(-1);
		expect(() => lobby.saveRoom(a)).toThrowError();
		getId.mockRestore();
	});
});

describe('Network Error', () => {
	it('cannot reach the server', async () => {
		const lobby = new Lobby(new Client('http://127.0.0.1:6530', fetch));
		await expect(() => lobby.getStatus()).rejects.toThrowError('fetch failed');
	});

	it('receives unexpected code', async () => {
		const lobby = new Lobby(new Client('http://127.0.0.1:9526/wrong', fetch));
		await expect(() => lobby.getStatus()).rejects.toThrowError(/Cannot GET \/wrong\/status/);
	});

	it('failed to create a room', async () => {
		const lobby = new Lobby(new Client('http://127.0.0.1:9526/wrong', fetch));
		await expect(() => lobby.createRoom({ roles: [] })).rejects.toThrowError(/Cannot POST \/wrong\/room/);
	});
});
