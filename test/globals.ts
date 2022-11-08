import { Client } from '@karuta/rest-client';

export const client = new Client('http://localhost:9526/api', fetch);

export default client;
