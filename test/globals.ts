import Client from '@karuta/rest-client/Client.js';

export const client = new Client('http://localhost:9526/api', fetch);

export default client;
