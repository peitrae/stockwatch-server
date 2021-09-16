import { RequestHandler } from 'express';

import authconfig from '../config/authconfig';
import UserModel from './model';
import parseError from '../utils/error/parseError';
import isEmail from '../utils/validation/isEmail';

export const signup: RequestHandler = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		if (email === undefined) {
			throw 'EMPTY_EMAIL';
		}

		if (!isEmail(email)) {
			throw 'WRONG_EMAIL';
		}

		if (password === undefined) {
			throw 'EMPTY_PASSWORD';
		}

		if (password.length < 6) {
			throw 'WEAK_PASSWORD';
		}

		const user = await UserModel.create({ name, email, password });

		const { token, refreshToken } = user.generateToken();

		res.json({
			token,
			refreshToken,
			localId: user.localId,
			expiresIn: authconfig.token_life,
		});
	} catch (err) {
		const parsedError = parseError(err, 'authentication');

		res.status(parsedError.code).send(parsedError);
	}
};

export const login: RequestHandler = async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email) {
			throw 'EMPTY_EMAIL';
		}

		if (!isEmail(email)) {
			throw 'WRONG_EMAIL';
		}

		if (!password) {
			throw 'EMPTY_PASSWORD';
		}

		if (password.length < 6) {
			throw 'WEAK_PASSWORD';
		}

		const user = await UserModel.findOne({ email });

		if (!user) {
			throw 'USER_NOT_FOUND';
		}

		const isPasswordValid = await user.isPasswordValid(password);

		if (!isPasswordValid) {
			throw 'WRONG_PASSWORD';
		}

		const { token, refreshToken } = user.generateToken();

		res.status(200).json({
			token,
			refreshToken,
			expiresIn: authconfig.token_life,
		});
	} catch (err) {
		const parsedError = parseError(err, 'authentication');

		res.status(parsedError.code).send(parsedError);
	}
};
