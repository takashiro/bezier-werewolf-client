import { Role } from '@bezier/werewolf-core';
import type CollectionEntry from '../CollectionEntry.js';
import TargetlessSkill from '../TargetlessSkill.js';

export class Minion extends TargetlessSkill {
	protected buttonLabel = '暗中观察';
}

const minion: CollectionEntry = {
	role: Role.Minion,
	skills: [Minion],
};

export default minion;
