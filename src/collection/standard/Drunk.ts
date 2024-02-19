import { Role } from '@bezier/werewolf-core';
import type CollectionEntry from '../CollectionEntry.js';
import SingleCardSkill from '../SingleCardSkill.js';

export class Drunk extends SingleCardSkill {
}

const drunk: CollectionEntry = {
	role: Role.Drunk,
	skills: [Drunk],
};

export default drunk;
