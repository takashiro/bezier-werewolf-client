import { Role } from '@bezier/werewolf-core';
import type CollectionEntry from '../CollectionEntry.js';
import TargetlessSkill from '../TargetlessSkill.js';

export class Seer extends TargetlessSkill {
}

const seer: CollectionEntry = {
	role: Role.Seer,
	skills: [],
};

export default seer;
