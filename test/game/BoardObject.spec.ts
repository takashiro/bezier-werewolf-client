import {
	jest,
	expect,
	it,
} from '@jest/globals';
import { Role } from '@bezier/werewolf-core';

import BoardObject from '../../src/game/BoardObject.js';

const obj = new BoardObject();

it('has a role', () => {
	expect(obj.getRole()).toBe(Role.Unknown);

	const onRoleChanged = jest.fn();
	obj.on('roleChanged', onRoleChanged);
	obj.setRole(Role.Werewolf);

	expect(obj.getRole()).toBe(Role.Werewolf);
	expect(onRoleChanged).toBeCalledWith(Role.Werewolf);
});

it('can be selected', () => {
	expect(obj.isSelected()).toBe(false);

	const onSelectedChanged = jest.fn();
	obj.on('selectedChanged', onSelectedChanged);
	obj.setSelected(true);

	expect(obj.isSelected()).toBe(true);
	expect(onSelectedChanged).toBeCalledWith(true);
});
