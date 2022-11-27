import { Role } from '@bezier/werewolf-core';

import CollectionEntry, { SkillConstructor } from './CollectionEntry';

export type CollectionMap = Map<Role, CollectionEntry>;

export default class Collection {
	protected id: string;

	protected map: CollectionMap = new Map();

	constructor(id: string) {
		this.id = id;
	}

	add(entry: CollectionEntry): void {
		this.map.set(entry.role, entry);
	}

	get(role: Role): CollectionEntry | undefined {
		return this.map.get(role);
	}

	getSkills(role: Role): SkillConstructor[] | undefined {
		return this.get(role)?.skills;
	}

	getRoles(): IterableIterator<Role> {
		return this.map.keys();
	}

	getEntries(): IterableIterator<CollectionEntry> {
		return this.map.values();
	}
}
