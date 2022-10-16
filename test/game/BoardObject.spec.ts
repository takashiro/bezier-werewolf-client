import { expect, it } from '@jest/globals';
import { Role } from '@bezier/werewolf-core';

import BoardObject from '../../src/game/BoardObject';

const obj = new BoardObject();

it('has a role', () => {
	expect(obj.getRole()).toBe(Role.Unknown);
	obj.setRole(Role.Werewolf);
	expect(obj.getRole()).toBe(Role.Werewolf);
});

it('can be selected', () => {
	expect(obj.isSelected()).toBe(false);
	obj.setSelected(true);
	expect(obj.isSelected()).toBe(true);
});
