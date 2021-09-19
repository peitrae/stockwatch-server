import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
class User {
	@Field(() => ID)
	localId: string;

	@Field()
	name: string;

	@Field()
	email: string;
}

export default User;
