import {
	jest,
	it,
	expect,
	describe,
	beforeEach,
} from '@jest/globals';
import { Client } from '@karuta/rest-client';

import DashboardPlayer from '../../src/base/DashboardPlayer';

const get = jest.fn<() => Promise<unknown>>();
const client = {
	get,
} as unknown as jest.Mocked<Client>;
const storage = {} as unknown as jest.Mocked<Storage>;

it('clears local storage data', () => {
	const player = new DashboardPlayer(client, storage, 'me');
	const removeItem = jest.spyOn(player, 'removeItem').mockReturnValue();
	player.clearStorage();
	expect(removeItem).toBeCalledTimes(2);
	expect(removeItem).toBeCalledWith('seatKey');
	expect(removeItem).toBeCalledWith('profile');
});

describe('generates seat key', () => {
	const player = new DashboardPlayer(client, storage, 'me');
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
	const player = new DashboardPlayer(client, storage, 'me');
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
	const player = new DashboardPlayer(client, storage, 'me');
	const saveItem = jest.spyOn(player, 'saveItem').mockReturnValue();
	jest.spyOn(player, 'fetchSeatKey').mockReturnValue('123');

	beforeEach(() => {
		get.mockClear();
	});

	it('throws an error when failing to fetch data from server', async () => {
		get.mockResolvedValueOnce({
			status: 404,
			text: () => 'unknown seat',
		});
		await expect(() => player.fetchProfile(2)).rejects.toThrowError('unknown seat');
		expect(get).toBeCalledWith('player/2/seat?seatKey=123');
	});

	it('receives valid data from server', async () => {
		get.mockResolvedValueOnce({
			status: 200,
			json: () => null,
		});
		await expect(() => player.fetchProfile(2)).rejects.toThrowError('No data is returned from the server.');
		expect(get).toBeCalledWith('player/2/seat?seatKey=123');
	});

	it('receives valid data from server', async () => {
		get.mockResolvedValueOnce({
			status: 200,
			json: () => ({ b: 1 }),
		});
		const profile = await player.fetchProfile(2);
		expect(get).toBeCalledWith('player/2/seat?seatKey=123');
		expect(profile).toStrictEqual({ b: 1 });
	});

	it('saves profile', async () => {
		expect(saveItem).toBeCalledWith('profile', { b: 1 });
	});

	it('reads saved profile', async () => {
		const profile = await player.fetchProfile(2);
		expect(profile).toStrictEqual({ b: 1 });
	});
});

describe('fetches profile from local storage', () => {
	const player = new DashboardPlayer(client, storage, 'me');
	const readItem = jest.spyOn(player, 'readItem');

	it('reads data for the 1st time', async () => {
		readItem.mockReturnValueOnce('abc');
		const profile = await player.fetchProfile(2);
		expect(readItem).toBeCalledWith('profile');
		expect(profile).toBe('abc');
	});

	it('reads cached data', async () => {
		const profile = await player.fetchProfile(2);
		expect(profile).toBe('abc');
	});
});
