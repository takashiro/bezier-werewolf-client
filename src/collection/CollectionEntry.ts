import { Role } from '@bezier/werewolf-core';

import Board from '../game/BasicBoard';
import Player from '../game/Player';
import Skill from '../game/Skill';

export type SkillConstructor = new(board: Board, owner: Player) => Skill;

interface CollectionEntry {
	role: Role;
	skills?: SkillConstructor[];
}

export default CollectionEntry;
