import { SuperTest, Test } from 'supertest';

import UserModel from '../user/model';
import { IUserObject } from '../types/user';

interface ICreateUserParams {
	createdAt?: boolean;
	updatedAt?: boolean;
	password?: boolean;
}

export const randomString = Math.random().toString(36).replace('0.', '');

export const randomEmail = `${randomString}@${randomString}.com`;

export const registerAccount = async (agent: SuperTest<Test>) => {
	const accountRegisterData = {
		name: randomString,
		email: randomEmail,
		password: randomString,
	};

	await agent.post('/api/v1/user/signup').send(accountRegisterData);

	return accountRegisterData;
};

export const createUser = async (
	params?: ICreateUserParams
): Promise<IUserObject> => {
	let user = await UserModel.create({
		name: randomString,
		email: randomEmail,
		password: randomString,
	});

	let userObj = user.toObject();
	userObj.localId = user._id.toString();
	delete userObj._id;

	if (params === undefined || (params && !params.createdAt)) {
		delete userObj.createdAt;
	}

	if (params === undefined || (params && !params.updatedAt)) {
		delete userObj.updatedAt;
	}

	if (params === undefined || (params && !params.password)) {
		delete userObj.password;
	}

	return userObj;
};
