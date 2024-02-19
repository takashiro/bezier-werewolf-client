import { Role } from '@bezier/werewolf-core';
import type CollectionEntry from '../CollectionEntry.js';
import TargetlessSkill from '../TargetlessSkill.js';

export class Insomniac extends TargetlessSkill {
}

const insomniac: CollectionEntry = {
	role: Role.Insomniac,
	skills: [Insomniac],
};

export default insomniac;
