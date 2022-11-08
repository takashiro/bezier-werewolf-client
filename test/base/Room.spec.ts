import {
	jest,
	describe,
	it,
	expect,
	beforeEach,
} from '@jest/globals';
import { Role } from '@bezier/werewolf-core';
import { Client } from '@karuta/rest-client';

import Room from '../../src/base/Room';

const get = jest.fn<() => Promise<unknown>>();
const client = { get } as unknown as Client;

beforeEach(() => {
	get.mockClear();
});

describe('Get frequently used configurations', () => {
	const room = new Room(client);
	room.setConfig({
		salt: '123',
		ownerKey: '345',
		id: 1,
		roles: [Role.AlphaWolf, Role.Werewolf],
	});

	it('gets id', () => {
		expect(room.getId()).toBe(1);
	});

	it('gets salt', () => {
		expect(room.getSalt()).toBe('123');
	});

	it('gets owner key', () => {
		expect(room.getOwnerKey()).toBe('345');
	});

	it('gets roles', () => {
		expect(room.getRoles()).toStrictEqual([Role.AlphaWolf, Role.Werewolf]);
	});
});

describe('Fetch room configuration', () => {
	const room = new Room(client);
	const saveItem = jest.spyOn(room, 'saveItem').mockReturnValue();

	it('rejects API failure', async () => {
		get.mockRejectedValue(new Error('API failure'));
		await expect(() => room.fetchConfig()).rejects.toThrowError('API failure');
	});

	it('resolves status code', async () => {
		get.mockResolvedValue({
			status: 404,
			text: () => 'not found',
		});
		await expect(() => room.fetchConfig()).rejects.toThrowError('not found');
	});

	it('handles empty data', async () => {
		get.mockResolvedValue({
			status: 200,
			json: () => null,
		});
		await expect(() => room.fetchConfig()).rejects.toThrowError('No configuration returned from server');
	});

	it('saves configuration', async () => {
		const config = { salt: '3456' };
		get.mockResolvedValue({
			status: 200,
			json: () => config,
		});
		const data = await room.fetchConfig();
		expect(data).toStrictEqual(config);
		expect(saveItem).toBeCalledWith('config', config);
	});

	it('returns cached data', async () => {
		const data = await room.fetchConfig();
		expect(data).toStrictEqual({ salt: '3456' });
	});
});

describe('Read / write configuration from local storage', () => {
	const room = new Room(client);
	jest.spyOn(room, 'readItem').mockReturnValueOnce({ salt: '333' });
	const removeItem = jest.spyOn(room, 'removeItem').mockReturnValue();

	it('reads data', async () => {
		const data = await room.fetchConfig();
		expect(data).toStrictEqual({ salt: '333' });
	});

	it('reads data twice', async () => {
		const data = await room.fetchConfig();
		expect(data).toStrictEqual({ salt: '333' });
		expect(data).toBe(room.getConfig());
	});

	it('clears storage', () => {
		room.clearStorage();
		expect(removeItem).toBeCalledTimes(1);
		expect(removeItem).toBeCalledWith('config');
	});
});
