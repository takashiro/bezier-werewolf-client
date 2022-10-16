import { it, expect } from '@jest/globals';
import HttpError from '../../src/network/HttpError';

it('has a status code and a message', () => {
	const message = 'The room is not found.';
	const error = new HttpError(404, message);
	expect(error.status).toBe(404);
	expect(error.message).toBe(message);
});
