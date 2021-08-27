import { ApolloServer, gql } from 'apollo-server-express';

import './db/mongoose';
import app from './express';

const main = async () => {
	const typeDefs = gql`
		type Query {
			hello: String
		}
	`;

	// Provide resolver functions for your schema fields
	const resolvers = {
		Query: {
			hello: () => 'Hello world!',
		},
	};

	const server = new ApolloServer({ typeDefs, resolvers });

	await server.start();
	server.applyMiddleware({ app });

	app.listen({ port: 4000 }, () =>
		console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
	);
};

main().catch((error) => {
	console.error('Error: ', error);
});
