import {
 jest,
 it,
 expect,
 afterEach,
} from '@jest/globals';

import Client, { FetchApi } from '../../src/network/Client';

const fetch = jest.fn();
const client = new Client('http://example.com/api', fetch as unknown as FetchApi);

afterEach(() => {
	fetch.mockClear();
});

it('sends GET request', async () => {
	await client.get('status');
	expect(fetch).toBeCalledWith('http://example.com/api/status', { method: 'GET' });
});

it('sends POST request', async () => {
	const headers = {
		'Accept-Language': 'zh-cn',
	};
	await client.post('room', { headers });
	expect(fetch).toBeCalledWith('http://example.com/api/room', { method: 'POST', headers });
});

it('sends DELETE request', async () => {
	await client.delete('room/1');
	expect(fetch).toBeCalledWith('http://example.com/api/room/1', { method: 'DELETE' });
});
