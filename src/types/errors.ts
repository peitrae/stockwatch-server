export interface IError {
	name: string;
	code: number;
	message: string;
	domain?: keyof IErrorDomain;
}

export interface IErrorDomain {
	authentication: IAuthError;
}

export interface IAuthError {
	EMPTY_EMAIL: IError;
	WRONG_EMAIL: IError;
	EMPTY_PASSWORD: IError;
	WEAK_PASSWORD: IError;
}

export interface IDBErrors {
	11000: IError;
}

export interface IErrorParamsObj extends Omit<IError, 'name' | 'code'> {
	name: 'MongooseError' | 'MongoError';
	code: keyof IDBErrors;
}
