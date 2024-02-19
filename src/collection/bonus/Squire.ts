import { Role } from '@bezier/werewolf-core';

import type CollectionEntry from '../CollectionEntry.js';
import TargetlessSkill from '../TargetlessSkill.js';

export class Squire extends TargetlessSkill {
}

const squire: CollectionEntry = {
	role: Role.Squire,
	skills: [Squire],
};

export default squire;
