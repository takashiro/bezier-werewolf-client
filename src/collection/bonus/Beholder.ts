import { Role } from '@bezier/werewolf-core';
import type CollectionEntry from '../CollectionEntry.js';
import TargetlessSkill from '../TargetlessSkill.js';

export class Beholder extends TargetlessSkill {
}

const beholder: CollectionEntry = {
	role: Role.Beholder,
	skills: [Beholder],
};

export default beholder;
