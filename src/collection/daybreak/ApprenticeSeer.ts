import { Role } from '@bezier/werewolf-core';

import type CollectionEntry from '../CollectionEntry.js';
import SingleCardSkill from '../SingleCardSkill.js';

export class ApprenticeSeer extends SingleCardSkill {
}

const apprenticeSeer: CollectionEntry = {
	role: Role.ApprenticeSeer,
	skills: [ApprenticeSeer],
};

export default apprenticeSeer;
