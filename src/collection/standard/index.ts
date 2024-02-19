import Collection from '../Collection.js';

import drunk from './Drunk.js';
import hunter from './Hunter.js';
import insomniac from './Insomniac.js';
import minion from './Minion.js';
import robber from './Robber.js';
import seer from './Seer.js';
import tanner from './Tanner.js';
import troublemaker from './Troublemaker.js';
import villager from './Villager.js';
import werewolf from './Werewolf.js';

const col = new Collection('standard');
col.add(drunk);
col.add(hunter);
col.add(insomniac);
col.add(minion);
col.add(robber);
col.add(seer);
col.add(tanner);
col.add(troublemaker);
col.add(villager);
col.add(werewolf);

export default col;
