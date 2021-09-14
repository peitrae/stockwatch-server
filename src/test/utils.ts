import { SuperTest, Test } from 'supertest';

export const randomString = Math.random().toString(36).replace('0.', '');

export const randomEmail = `${randomString}@${randomString}.com`;

export const registerAccount = async (agent: SuperTest<Test>) => {
	const accountRegisterData = {
		displayName: randomString,
		email: randomEmail,
		password: randomString,
	};

	await agent.post('/api/v1/user/signup').send(accountRegisterData);

	return accountRegisterData;
};
