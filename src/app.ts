import 'reflect-metadata';
import http from 'http';

import './db/mongoose';
import app from './express';
import apollo from './config/apollo';

const main = async () => {
	const httpServer = http.createServer(app);
	const apolloServer = (await apollo()).server;

	await apolloServer.start();
	apolloServer.applyMiddleware({ app, path: '/api' });

	await new Promise<void>((resolve) =>
		httpServer.listen({ port: 4000 }, resolve)
	);

	console.log(
		`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
	);
};

main().catch((error) => {
	console.error('Error: ', error);
});
