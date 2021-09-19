import { Document, LeanDocument } from 'mongoose';

export interface IUser {
	name?: string;
	email: string;
	localId: string;
}

export interface IUserSchema extends IUser {
	password: string;
	createdAt: Date;
	updatedAt: Date;
	isValidPassword: (password: string) => boolean;
}

export interface IUserObject
	extends Omit<
		LeanDocument<IUserSchema & Document<any, any, IUserSchema>>,
		'password' | 'createdAt' | 'updatedAt'
	> {
	password?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
