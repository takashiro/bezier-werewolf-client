import Collection from '../Collection.js';

import alphaWolf from './AlphaWolf.js';
import apprenticeSeer from './ApprenticeSeer.js';
import bodyBuard from './Bodyguard.js';
import dreamWolf from './DreamWolf.js';
import mysticWolf from './MysticWolf.js';
import paranormalInvestigator from './ParanormalInvestigator.js';
import revealer from './Revealer.js';
import villageIdiot from './VillageIdiot.js';
import witch from './Witch.js';

const col = new Collection('daybreak');
col.add(alphaWolf);
col.add(apprenticeSeer);
col.add(bodyBuard);
col.add(dreamWolf);
col.add(mysticWolf);
col.add(paranormalInvestigator);
col.add(revealer);
col.add(villageIdiot);
col.add(witch);

export default col;
