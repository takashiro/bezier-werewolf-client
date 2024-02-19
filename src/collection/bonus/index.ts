import Collection from '../Collection.js';

import apprenticeTanner from './ApprenticeTanner.js';
import beholder from './Beholder.js';
import cursed from './Cursed.js';
import prince from './Prince.js';
import squire from './Squire.js';
import thing from './Thing.js';

const col = new Collection('bonus');
col.add(apprenticeTanner);
col.add(beholder);
col.add(cursed);
col.add(prince);
col.add(squire);
col.add(thing);

export default col;
