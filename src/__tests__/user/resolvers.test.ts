import { ApolloServer, gql } from 'apollo-server-express';

import apollo from '../../config/apollo';
import setup from '../../test/setup';
import { createUser } from '../../test/utils';

setup('sw-test-user');

describe('User Resolvers', () => {
	it('should fetch user profile', async () => {
		const user = await createUser();

		const server = new ApolloServer({
			schema: (await apollo()).schema,
			context: () => ({ localId: user.localId }),
		});

		const query = gql`
			query {
				GET_USER {
					email
					localId
					name
				}
			}
		`;

		const result = await server.executeOperation({
			query,
		});

		expect(result.errors).toBeUndefined();
		expect(result.data?.GET_USER).toMatchObject({
			localId: user.localId,
			name: user.name,
			email: user.email,
		});
	});

	it('should return error "USER_NOT_FOUND"', async () => {
		const server = new ApolloServer({
			schema: (await apollo()).schema,
			context: () => ({ localId: '6145f31ca5c26670b89b8213' }), // Note: Change to use random string
		});

		const query = gql`
			query {
				GET_USER {
					email
					localId
					name
				}
			}
		`;

		const result = await server.executeOperation({
			query,
		});

		expect(result.errors && result.errors[0].message).toEqual('USER_NOT_FOUND');
		expect(result.data).toBeNull();
	});
});
