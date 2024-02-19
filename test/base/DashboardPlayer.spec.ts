import {
	jest,
	it,
	expect,
	describe,
	beforeAll,
	afterAll,
} from '@jest/globals';
import { Role } from '@bezier/werewolf-core';
import ScopedStorage from '@karuta/rest-client/ScopedStorage.js';

import Lobby from '../../src/base/Lobby.js';
import DashboardPlayer from '../../src/base/DashboardPlayer.js';
import Room from '../../src/base/Room.js';

import { client } from '../globals.js';
import MemoryStorage from '../MemoryStorage.js';

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
	const lobby = new Lobby(client);
	lobby.setStorage(new ScopedStorage('lobby', storage));

	let roomId = 0;
	let room: Room;
	const roles: Role[] = [
		Role.Werewolf,
		Role.Hunter,
		Role.Drunk,
		Role.Seer,
		Role.Villager,
	];

	beforeAll(async () => {
		const creator = new Lobby(client);
		creator.setStorage(new ScopedStorage('creator', storage));
		room = await creator.createRoom({ roles, random: false });
		roomId = room.getId();
	});

	afterAll(async () => {
		const ownerKey = room.getOwnerKey();
		if (ownerKey) {
			await lobby.deleteRoom(roomId, ownerKey);
		}
	});

	it('throws an error when failing to fetch data from server', async () => {
		const player = room.createPlayer(12);
		await expect(() => player.fetchProfile()).rejects.toThrowError('The seat does not exist');
	});

	it('receives invalid data from server', async () => {
		const player = room.createPlayer(13);
		const get = jest.spyOn(Reflect.get(player, 'client'), 'get');
		get.mockResolvedValueOnce({
			status: 200,
			json: () => null,
		} as unknown as Response);
		await expect(() => player.fetchProfile()).rejects.toThrowError('No data is returned from the server.');
		expect(room.getDashboardSeat()).toBeUndefined();
	});

	it('receives valid data from server', async () => {
		const player = room.createPlayer(1);
		const profile = await player.fetchProfile();
		expect(profile.role).toBe(Role.Seer);
		expect(profile.seat).toBe(1);
		expect(room.getDashboardSeat()).toBe(1);
	});

	it('reads saved profile', async () => {
		const player = room.createPlayer(1);
		const get = jest.spyOn(Reflect.get(player, 'client'), 'get');
		const profile = await player.fetchProfile();
		expect(profile.role).toBe(Role.Seer);
		expect(profile.seat).toBe(1);
		expect(get).not.toBeCalled();
	});

	it('sees nothing on the board at first', async () => {
		const seer = room.createPlayer(1);
		const { cards, players } = await seer.fetchBoard();
		expect(cards).toHaveLength(0);
		expect(players).toHaveLength(0);
	});

	it('can handle invalid skill index', async () => {
		const seer = room.createPlayer(1);
		await expect(() => seer.invokeSkill(-1)).rejects.toThrowError('Invalid skill index: -1');
	});

	it('invokes seer skill at night', async () => {
		const seer = room.createPlayer(1);
		const { cards } = await seer.invokeSkill(0, { cards: [0, 1] });
		expect(cards).toHaveLength(2);
		expect(cards?.[0]).toEqual({ pos: 0, role: Role.Werewolf });
		expect(cards?.[1]).toEqual({ pos: 1, role: Role.Hunter });
	});

	it('does nothing at night', async () => {
		const player = room.createPlayer(2);
		await player.fetchProfile();
		const { cards, players } = await player.invokeSkill(0);
		expect(cards).toBeUndefined();
		expect(players).toBeUndefined();
	});

	it('votes to each other', async () => {
		const seer = room.createPlayer(1);
		const villager = room.createPlayer(2);
		await seer.lynchPlayer(2);
		const lynch = await seer.fetchLynchResult();
		expect(lynch.progress.current).toBe(1);
		expect(lynch.progress.limit).toBe(2);
		await villager.lynchPlayer(1);
	});

	it('sees lynch result', async () => {
		const villager = room.createPlayer(2);
		const lynch = await villager.fetchLynchResult();
		expect(lynch.progress.current).toBe(2);
		expect(lynch.progress.limit).toBe(2);
		expect(lynch.votes).toEqual([
			{ source: 1, target: 2 },
			{ source: 2, target: 1 },
		]);

		const board = await villager.fetchBoard();
		expect(board.cards).toEqual([
			{ pos: 0, role: Role.Werewolf },
			{ pos: 1, role: Role.Hunter },
			{ pos: 2, role: Role.Drunk },
		]);
		expect(board.players).toEqual([
			{ seat: 1, role: Role.Seer },
			{ seat: 2, role: Role.Villager },
		]);
	});

	it('can handle network errors', async () => {
		const player = room.createPlayer(1);

		const mockedClient = Reflect.get(player, 'client');
		jest.spyOn(mockedClient, 'get').mockResolvedValue({
			status: 503,
			text: () => 'Service Unavailable',
		});
		jest.spyOn(mockedClient, 'post').mockResolvedValue({
			status: 503,
			text: () => 'Service Unavailable',
		});

		await expect(() => player.fetchBoard()).rejects.toThrowError('Service Unavailable');
		await expect(() => player.invokeSkill(0)).rejects.toThrowError('Service Unavailable');
		await expect(() => player.lynchPlayer(1)).rejects.toThrowError('Service Unavailable');
		await expect(() => player.fetchLynchResult()).rejects.toThrowError('Service Unavailable');
	});

	it('can handle invalid JSON', async () => {
		const player = room.createPlayer(1);

		const mockedClient = Reflect.get(player, 'client');
		jest.spyOn(mockedClient, 'post').mockResolvedValue({
			status: 200,
			headers: {
				get: () => 'application/json',
			},
			json() {
				throw new Error('Service Unavailable');
			},
		});

		expect(await player.invokeSkill(0)).toStrictEqual({});
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
