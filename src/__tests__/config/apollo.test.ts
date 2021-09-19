import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { createUser, randomString } from '../../test/utils';
import { authContext } from '../../config/apollo';
import authconfig from '../../config/authconfig';
import setup from '../../test/setup';

setup('sw-test-user');

describe('config/apollo: authContext', () => {
	it('should success generate localId from the token', async () => {
		const user = await createUser();

		const token = jwt.sign(user, authconfig.token_secret, {
			expiresIn: authconfig.token_life,
		});

		const mockReq = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		} as Request;

		const mockRes = {} as Response;

		const result = await authContext({ req: mockReq, res: mockRes });

		expect(result).toEqual({
			req: mockReq,
			res: mockRes,
			localId: user.localId,
		});
	});

	it('should return error "TOKEN_IS_EMPTY', async () => {
		const mockReq = {
			headers: {
				authorization: '',
			},
		} as Request;
		const mockRes = {} as Response;

		try {
			await authContext({
				req: mockReq,
				res: mockRes,
			});
		} catch (e) {
			expect(e.name).toBe('AuthenticationError');
			expect(e.message).toBe('Token is empty');
			expect(e.extensions.name).toBe('TOKEN_IS_EMPTY');
		}
	});

	it('should return error "TOKEN_IS_INVALID', async () => {
		const mockReq = {
			headers: {
				authorization: `Bearer ${randomString}`,
			},
		} as Request;
		const mockRes = {} as Response;

		try {
			await authContext({
				req: mockReq,
				res: mockRes,
			});
		} catch (e) {
			expect(e.name).toBe('AuthenticationError');
			expect(e.message).toBe('Token is invalid');
			expect(e.extensions.name).toBe('TOKEN_IS_INVALID');
		}
	});

	it('should return error "TOKEN_IS_EXPIRED', async () => {
		const user = await createUser();

		const token = jwt.sign(user, authconfig.token_secret, {
			expiresIn: -1,
		});

		const mockReq = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		} as Request;
		const mockRes = {} as Response;

		try {
			await authContext({ req: mockReq, res: mockRes });
		} catch (e) {
			expect(e.name).toBe('AuthenticationError');
			expect(e.message).toBe('Token is expired');
			expect(e.extensions.name).toBe('TOKEN_IS_EXPIRED');
		}
	});
});
