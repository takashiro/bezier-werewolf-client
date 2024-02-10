function globalTeardown() {
	const server = Reflect.get(globalThis, '__WEREWOLF_SERVER__');
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
