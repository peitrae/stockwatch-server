import {
	ApolloServer,
	ExpressContext,
	AuthenticationError,
} from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import jwt from 'jsonwebtoken';

import UserResolver from '../user/resolvers';
import authconfig from '../config/authconfig';
import { IUser } from '../types/user';
import parseError from '../utils/error/parseError';

export const authContext = async ({ req, res }: ExpressContext) => {
	const bearerToken = req.headers.authorization?.split(' ')[1] || '';

	try {
		if (!bearerToken) {
			throw { name: 'TOKEN_IS_EMPTY' };
		}

		const decodedJWT = jwt.verify(
			bearerToken,
			authconfig.token_secret
		) as IUser;

		return { req, res, localId: decodedJWT.localId };
	} catch (e) {
		const parsedError = parseError(e.name, 'authentication');

		if (parsedError) {
			throw new AuthenticationError(parsedError.message, {
				name: parsedError.name,
			});
		}

		throw e;
	}
};

const apollo = async () => {
	const schema = await buildSchema({
		resolvers: [UserResolver],
		emitSchemaFile: true,
	});

	const server = new ApolloServer({
		schema,
		context: authContext,
	});

	return { server, schema };
};

export default apollo;
