export interface IError {
	error: IErrorObj;
}

export interface IErrorObj {
	name: string;
	code: number;
	message: string;
	domain?: keyof IErrorDomain;
}

export interface IErrorDomain {
	authentication: IAuthError;
}

export interface IAuthError {
	EMPTY_EMAIL: IErrorObj;
	WRONG_EMAIL: IErrorObj;
	EMPTY_PASSWORD: IErrorObj;
	WEAK_PASSWORD: IErrorObj;
	USER_NOT_FOUND: IErrorObj;
}

export interface IDBErrors {
	11000: IErrorObj;
}

export interface IErrorParamsObj extends Omit<IErrorObj, 'name' | 'code'> {
	name: 'MongooseError' | 'MongoError';
	code: keyof IDBErrors;
}
