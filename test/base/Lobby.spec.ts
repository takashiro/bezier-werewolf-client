import {
	it,
	expect,
} from '@jest/globals';

import Lobby from '../../src/base/Lobby';
import { client } from '../globals';

const storage = {
} as unknown as Storage;

const lobby = new Lobby(client, {
	id: 'lobby',
	storage,
});

it('has a capacity of 1000 by default', async () => {
	const status = await lobby.getStatus();
	expect(status.capacity).toBe(1000);
});
