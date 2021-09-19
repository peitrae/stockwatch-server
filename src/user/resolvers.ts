import { Context } from 'apollo-server-core';
import { AuthenticationError } from 'apollo-server-errors';
import { Ctx, Query } from 'type-graphql';
import UserModel from './model';
import User from './schema';

interface IAuthenticatedContext extends Context {
	localId: string;
}

class UserResolver {
	@Query(() => User)
	async GET_USER(@Ctx() ctx: IAuthenticatedContext) {
		try {
			const user = await UserModel.findById(ctx.localId);

			if (!user) {
				throw new AuthenticationError('USER_NOT_FOUND');
			}

			return {
				localId: user._id,
				name: user.name,
				email: user.email,
			};
		} catch (e) {
			return e;
		}
	}
}

export default UserResolver;
