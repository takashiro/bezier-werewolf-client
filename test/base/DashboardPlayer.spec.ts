import {
	jest,
	it,
	expect,
	describe,
	beforeAll,
	afterAll,
} from '@jest/globals';
import { Role } from '@bezier/werewolf-core';

import { client } from '../globals';
import MemoryStorage from '../MemoryStorage';

import Lobby from '../../src/base/Lobby';
import DashboardPlayer from '../../src/base/DashboardPlayer';
import Room from '../../src/base/Room';

it('clears local storage data', () => {
	const player = new DashboardPlayer(client);
	const removeItem = jest.spyOn(player, 'removeItem').mockReturnValue();
	player.clearStorage();
	expect(removeItem).toBeCalledTimes(2);
	expect(removeItem).toBeCalledWith('seatKey');
	expect(removeItem).toBeCalledWith('profile');
});

describe('generates seat key', () => {
	const player = new DashboardPlayer(client);
	const saveItem = jest.spyOn(player, 'saveItem').mockReturnValue();

	it('generates a random seat key', () => {
		const key = player.fetchSeatKey();
		expect(saveItem).toBeCalledWith('seatKey', key);
	});

	it('saves the seat key', () => {
		const key = player.fetchSeatKey();
		expect(key).toBeDefined();
	});
});

describe('reads seat key from local storage', () => {
	const player = new DashboardPlayer(client);
	const readRawItem = jest.spyOn(player, 'readRawItem');

	it('fetches an existing seat key', () => {
		readRawItem.mockReturnValueOnce('abc');
		const key = player.fetchSeatKey();
		expect(key).toBe('abc');
	});

	it('saves the seat key', () => {
		const key = player.fetchSeatKey();
		expect(key).toBe('abc');
	});
});

describe('fetches profile from server', () => {
	const storage = new MemoryStorage();
	const lobby = new Lobby(client, {
		id: 'lobby',
		storage,
	});

	let roomId = 0;
	let room: Room;
	const roles: Role[] = [
		Role.Werewolf,
		Role.Villager,
		Role.Villager,
		Role.Villager,
		Role.Villager,
	];

	beforeAll(async () => {
		const creator = new Lobby(client, {
			id: 'creator',
			storage,
		});
		room = await creator.createRoom({ roles });
		roomId = room.getId();
	});

	afterAll(async () => {
		const ownerKey = room.getOwnerKey();
		if (ownerKey) {
			await lobby.deleteRoom(roomId, ownerKey);
		}
	});

	it('throws an error when failing to fetch data from server', async () => {
		const player = room.getPlayer(12);
		await expect(() => player.fetchProfile()).rejects.toThrowError('The seat does not exist');
	});

	it('receives invalid data from server', async () => {
		const player = room.getPlayer(13);
		const get = jest.spyOn(Reflect.get(player, 'client'), 'get');
		get.mockResolvedValueOnce({
			status: 200,
			json: () => null,
		} as unknown as Response);
		await expect(() => player.fetchProfile()).rejects.toThrowError('No data is returned from the server.');
		get.mockRestore();
	});

	it('receives valid data from server', async () => {
		const player = room.getPlayer(1);
		const profile = await player.fetchProfile();
		expect(roles).toContain(profile.role);
		expect(profile.seat).toStrictEqual(1);
	});

	it('reads saved profile', async () => {
		const player = room.getPlayer(1);
		const get = jest.spyOn(Reflect.get(player, 'client'), 'get');
		const profile = await player.fetchProfile();
		expect(profile.seat).toBe(1);
		expect(get).not.toBeCalled();
		get.mockRestore();
	});
});

describe('fetches profile from local storage', () => {
	const player = new DashboardPlayer(client);
	const readItem = jest.spyOn(player, 'readItem');

	it('reads data for the 1st time', async () => {
		readItem.mockReturnValueOnce('abc');
		const profile = await player.fetchProfile();
		expect(readItem).toBeCalledWith('profile');
		expect(profile).toBe('abc');
	});

	it('reads cached data', async () => {
		const profile = await player.fetchProfile();
		expect(profile).toBe('abc');
	});
});
