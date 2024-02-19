import {
	it,
	expect,
} from '@jest/globals';

import { Role } from '@bezier/werewolf-core';
import {
	Collection,
	CollectionEntry,
} from '../../src/index.js';

const col = new Collection('test');
const entry1: CollectionEntry = {
	role: Role.Villager,
};

const entry2: CollectionEntry = {
	role: Role.DreamWolf,
};

it('adds roles', () => {
	col.add(entry1);
	col.add(entry2);
});

it('has two roles', () => {
	const roles = [...col.getRoles()];
	expect(roles).toHaveLength(2);
});

it('has two entries', () => {
	const entries = [...col.getEntries()];
	expect(entries).toContain(entry1);
	expect(entries).toContain(entry2);
});
