import { Role } from '@bezier/werewolf-core';

import type CollectionEntry from '../CollectionEntry.js';
import TargetlessSkill from '../TargetlessSkill.js';

export class ApprenticeTanner extends TargetlessSkill {
}

const apprenticeTanner: CollectionEntry = {
	role: Role.ApprenticeTanner,
	skills: [ApprenticeTanner],
};

export default apprenticeTanner;
