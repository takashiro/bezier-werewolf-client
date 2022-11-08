import { Server } from 'http';

function globalTeardown(): Promise<void> {
	const server = Reflect.get(globalThis, '__WEREWOLF_SERVER__') as Server;
	return new Promise((resolve, reject) => {
		server.close((err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export default globalTeardown;
