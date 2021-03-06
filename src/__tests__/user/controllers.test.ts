import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../../express';
import {
	createUser,
	randomEmail,
	randomString,
	registerAccount,
} from '../../test/utils';
import setup from '../../test/setup';
import UserModel from '../../user/model';
import authconfig from '../../config/authconfig';

setup('sw-test-user');

const BASE_URL = '/api/v1/user';

describe('POST /signup', () => {
	it('should create an account', async () => {
		const email = randomEmail;

		const res = await request(app)
			.post(`${BASE_URL}/signup`)
			.send({
				name: randomString,
				email,
				password: randomString,
			})
			.expect(200);

		const user = await UserModel.findOne({ email });

		expect(user.name).toBeTruthy();
		expect(user.password).toBeTruthy();

		expect(res.body).toMatchObject({
			token: expect.any(String),
			refreshToken: expect.any(String),
			expiresIn: 3600,
		});
	});

	it('sould create an account without a name', async () => {
		const email = randomEmail;

		const res = await request(app)
			.post(`${BASE_URL}/signup`)
			.send({
				email,
				password: randomString,
			})
			.expect(200);

		const user = await UserModel.findOne({ email });

		expect(user.password).toBeTruthy();

		expect(res.body).toMatchObject({
			token: expect.any(String),
			refreshToken: expect.any(String),
			expiresIn: 3600,
		});
	});

	it('should tell the email is empty', async () => {
		await request(app)
			.post(`${BASE_URL}/signup`)
			.send({
				name: randomString,
				password: randomString,
			})
			.expect(400, {
				name: 'EMPTY_EMAIL',
				code: 400,
				message: 'Email cannot be empty',
				domain: 'authentication',
			});
	});

	it('should tell the email is not valid', async () => {
		await request(app)
			.post(`${BASE_URL}/signup`)
			.send({
				name: randomString,
				email: randomEmail + '1',
				password: randomString,
			})
			.expect(400, {
				name: 'WRONG_EMAIL',
				code: 400,
				message: 'Please fill a valid email address',
				domain: 'authentication',
			});
	});

	it('should tell the password is empty', async () => {
		await request(app)
			.post(`${BASE_URL}/signup`)
			.send({
				name: randomString,
				email: randomEmail,
			})
			.expect(400, {
				name: 'EMPTY_PASSWORD',
				code: 400,
				message: 'Password cannot be empty',
				domain: 'authentication',
			});
	});

	it('should tell the password is less than 6 characters', async () => {
		await request(app)
			.post(`${BASE_URL}/signup`)
			.send({
				name: randomEmail,
				email: randomEmail,
				password: randomString.slice(0, 5),
			})
			.expect(400, {
				name: 'WEAK_PASSWORD',
				code: 400,
				message: 'Password must have at least 6 characters',
				domain: 'authentication',
			});
	});

	it('should tell the account already exists', async () => {
		const { name, email, password } = await registerAccount(request(app));

		await request(app)
			.post(`${BASE_URL}/signup`)
			.send({
				name,
				email,
				password,
			})
			.expect(400, {
				name: 'EMAIL_EXIST',
				code: 400,
				message: 'The email address is already in use by another account',
				domain: 'authentication',
			});
	});
});

describe('POST /login', () => {
	it('should sign the user in', async () => {
		const { email, password } = await registerAccount(request(app));

		const res = await request(app)
			.post(`${BASE_URL}/login`)
			.send({ email, password })
			.expect(200);

		expect(res.body).toMatchObject({
			token: expect.any(String),
			refreshToken: expect.any(String),
			expiresIn: 3600,
		});
	});

	it('should tell user is not found', async () => {
		const { email, password } = await registerAccount(request(app));

		await request(app)
			.post(`${BASE_URL}/login`)
			.send({ email: '1' + email, password })
			.expect(400, {
				name: 'USER_NOT_FOUND',
				code: 400,
				message: 'User not found',
				domain: 'authentication',
			});
	});

	it('should tell the email is empty', async () => {
		const { password } = await registerAccount(request(app));

		await request(app)
			.post(`${BASE_URL}/login`)
			.send({ password })
			.expect(400, {
				name: 'EMPTY_EMAIL',
				code: 400,
				message: 'Email cannot be empty',
				domain: 'authentication',
			});
	});

	it('should tell the email is not valid', async () => {
		const { email, password } = await registerAccount(request(app));

		await request(app)
			.post(`${BASE_URL}/login`)
			.send({
				email: email + '1',
				password,
			})
			.expect(400, {
				name: 'WRONG_EMAIL',
				code: 400,
				message: 'Please fill a valid email address',
				domain: 'authentication',
			});
	});

	it('should tell the password is empty', async () => {
		const { email } = await registerAccount(request(app));

		await request(app).post(`${BASE_URL}/login`).send({ email }).expect(400, {
			name: 'EMPTY_PASSWORD',
			code: 400,
			message: 'Password cannot be empty',
			domain: 'authentication',
		});
	});

	it('should tell the password is less than 6 characters', async () => {
		const { email, password } = await registerAccount(request(app));

		await request(app)
			.post(`${BASE_URL}/login`)
			.send({ email, password: password.slice(0, 5) })
			.expect(400, {
				name: 'WEAK_PASSWORD',
				code: 400,
				message: 'Password must have at least 6 characters',
				domain: 'authentication',
			});
	});
});

describe('POST /refresh-token', () => {
	it('should exchange the refresh token with the new token', async () => {
		const user = await createUser();

		const refreshToken = jwt.sign(user, authconfig.refresh_token_secret, {
			expiresIn: authconfig.refresh_token_life,
		});

		const res = await request(app)
			.post(`${BASE_URL}/refresh-token`)
			.send({ refreshToken })
			.expect(200);

		const decodedResToken = jwt.verify(res.body.token, authconfig.token_secret);
		const decodedResRefreshToken = jwt.verify(
			res.body.refreshToken,
			authconfig.refresh_token_secret
		);

		expect(res.body).toEqual({
			token: expect.any(String),
			refreshToken: expect.any(String),
			expiresIn: 604800,
		});

		expect(decodedResToken).toMatchObject(user);
		expect(decodedResRefreshToken).toMatchObject(user);
	});
});
