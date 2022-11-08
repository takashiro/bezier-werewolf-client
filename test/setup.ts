import http from 'http';
import express from 'express';
import api from '@bezier/werewolf-server';

function globalSetup(): void {
	const app = express();
	app.use('/api', api);

	const server = http.createServer(app);
	server.listen(9526);

  Reflect.set(globalThis, '__WEREWOLF_SERVER__', server);
}

export default globalSetup;
