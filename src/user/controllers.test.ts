import mongoose from 'mongoose';
import request from 'supertest';

import app from '../express';
import setup from '../utils/test/setup';
import UserModel from './model';

setup('sw-test-user');

describe('POST /signup', () => {
	it('should create an account', async () => {
		const res = await request(app)
			.post('/api/v1/user/signup')
			.send({
				displayName: 'Example',
				email: 'example@example.com',
				password: 'password',
			})
			.expect(200);

		const user = await UserModel.findOne({ email: 'example@example.com' });

		expect(user.displayName).toBeTruthy();
		expect(user.password).toBeTruthy();

		expect(res.body).toMatchObject({
			token: expect.any(String),
			refreshToken: expect.any(String),
			expiresIn: 3600,
		});
	});

	it('sould create an account without a displayName', async () => {
		const res = await request(app)
			.post('/api/v1/user/signup')
			.send({
				displayName: null,
				email: 'example@example.com',
				password: 'password',
			})
			.expect(200);

		const user = await UserModel.findOne({ email: 'example@example.com' });

		expect(user.password).toBeTruthy();

		expect(res.body).toMatchObject({
			token: expect.any(String),
			refreshToken: expect.any(String),
			expiresIn: 3600,
		});
	});

	it('should tell the email is empty', async () => {
		await request(app)
			.post('/api/v1/user/signup')
			.send({
				displayName: 'Example',
				password: 'password',
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
			.post('/api/v1/user/signup')
			.send({
				displayName: 'Example',
				email: 'example',
				password: 'password',
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
			.post('/api/v1/user/signup')
			.send({
				displayName: 'Example',
				email: 'example@example.com',
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
			.post('/api/v1/user/signup')
			.send({
				displayName: 'Example',
				email: 'example@example.com',
				password: 'pass',
			})
			.expect(400, {
				name: 'WEAK_PASSWORD',
				code: 400,
				message: 'Password must have at least 6 characters',
				domain: 'authentication',
			});
	});

	it('should tell the account already exists', async () => {
		await request(app)
			.post('/api/v1/user/signup')
			.send({
				displayName: 'Example',
				email: 'example@example.com',
				password: 'password',
			})
			.expect(200);

		await request(app)
			.post('/api/v1/user/signup')
			.send({
				displayName: 'Example',
				email: 'example@example.com',
				password: 'password',
			})
			.expect(400, {
				name: 'EMAIL_EXIST',
				code: 400,
				message: 'The email address is already in use by another account',
				domain: 'authentication',
			});
	});
});
