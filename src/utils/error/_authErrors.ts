const authErrors = {
	EMPTY_EMAIL: {
		name: 'EMPTY_EMAIL',
		code: 400,
		message: 'Email cannot be empty',
	},
	WRONG_EMAIL: {
		name: 'WRONG_EMAIL',
		code: 400,
		message: 'Please fill a valid email address',
	},
	EMPTY_PASSWORD: {
		name: 'EMPTY_PASSWORD',
		code: 400,
		message: 'Password cannot be empty',
	},
	WEAK_PASSWORD: {
		name: 'WEAK_PASSWORD',
		code: 400,
		message: 'Password must have at least 6 characters',
	},
	USER_NOT_FOUND: {
		name: 'USER_NOT_FOUND',
		code: 400,
		message: 'User not found',
	},
};

export default authErrors;
