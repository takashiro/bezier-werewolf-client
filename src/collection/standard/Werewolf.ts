import { Role } from '@bezier/werewolf-core';
import type CollectionEntry from '../CollectionEntry.js';
import TargetlessSkill from '../TargetlessSkill.js';

export class Werewolf extends TargetlessSkill {
}

const werewolf: CollectionEntry = {
	role: Role.Werewolf,
	skills: [Werewolf],
};

export default werewolf;
