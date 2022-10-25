import {
	jest,
	it,
	expect,
	describe,
	afterEach,
} from '@jest/globals';
import { Role } from '@bezier/werewolf-core';

import RoomConfiguration from '../../src/base/RoomConfiguration';

const getItem = jest.fn();
const setItem = jest.fn();
const storage = {
	getItem,
	setItem,
} as unknown as Storage;

const config = new RoomConfiguration(storage);

describe('Update Configuration', () => {
	it('can handle numbers of roles', () => {
		config.setRoleNum(Role.Werewolf, 2);
		config.setRoleNum(Role.Villager, 3);
		expect(config.getRoleNum(Role.Villager)).toBe(3);
		expect(config.getRoleNum(Role.Witch)).toBe(0);
	});

	it('ignores unknown and 0', () => {
		config.setRoleNum(Role.Unknown, 100);
		config.setRoleNum(Role.AlphaWolf, 0);
		const roles = config.getRoles();
		expect(roles).toStrictEqual([
			Role.Werewolf,
			Role.Werewolf,
			Role.Villager,
			Role.Villager,
			Role.Villager,
		]);
	});

	it('resets to default', () => {
		config.reset();

		expect(config.getRoleNum(Role.Werewolf)).toBe(2);
		expect(config.getRoleNum(Role.Minion)).toBe(1);
		expect(config.getRoleNum(Role.Villager)).toBe(2);
		expect(config.getRoleNum(Role.Seer)).toBe(1);
		expect(config.getRoleNum(Role.Troublemaker)).toBe(1);
		expect(config.getRoleNum(Role.Robber)).toBe(1);
		expect(config.getRoleNum(Role.Drunk)).toBe(1);
		expect(config.getRoleNum(Role.Tanner)).toBe(1);
	});
});

describe('Read / Write Configuration', () => {
	const origin = {
		roles: [
			{ role: Role.Werewolf, num: 2 },
			{ role: Role.Villager, num: 3 },
		],
	};

	afterEach(() => {
		getItem.mockClear();
	});

	it('saves data to local storage', () => {
		config.parse(origin);
		const raw = JSON.stringify(origin);
		config.save();
		expect(setItem).toBeCalledWith('roomConfig', raw);
		setItem.mockClear();
	});

	it('restores valid empty data', () => {
		getItem.mockReturnValueOnce('{}');
		expect(config.read()).toBe(true);
		expect(config.toJSON()).toStrictEqual(origin);
	});

	it('restores no data', () => {
		getItem.mockReturnValue(null);
		expect(config.read()).toBe(false);
	});

	it('restores invalid data', () => {
		getItem.mockReturnValue('{]');
		expect(config.read()).toBe(false);
	});

	it('restores valid data', () => {
		getItem.mockReturnValue(JSON.stringify({
			roles: [
				{ role: Role.Witch, num: 3 },
			],
		}));
		expect(config.read()).toBe(true);
		expect(config.getRoleNum(Role.Witch)).toBe(3);
		expect(config.getRoleNum(Role.Villager)).toBe(0);
	});
});
