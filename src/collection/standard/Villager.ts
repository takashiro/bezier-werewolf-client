import { Role } from '@bezier/werewolf-core';
import type CollectionEntry from '../CollectionEntry.js';
import TargetlessSkill from '../TargetlessSkill.js';

export class Villager extends TargetlessSkill {
}

const villager: CollectionEntry = {
	role: Role.Villager,
	skills: [Villager],
};

export default villager;
