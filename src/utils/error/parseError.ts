import {
	IError,
	IAuthError,
	IErrorDomain,
	IErrorParamsObj,
} from '../../types/errors';
import authErrors from './_authErrors';
import dbErrors from './_dbErrors';

const errors: IErrorDomain = {
	authentication: authErrors,
};

const parseError = (
	err: IErrorParamsObj | keyof IAuthError,
	domain: keyof IErrorDomain
): IError => {
	let result: any = {};

	if (typeof err === 'object') {
		if (err.name === 'MongoError') {
			result = dbErrors[err.code];
		}
	} else {
		result = errors[domain][err];
	}

	return { ...result, domain };
};

export default parseError;
