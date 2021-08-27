import mongoose, { Document, LeanDocument, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import authconfig from '../config/authconfig';

export interface IUser {
	localId: string;
	displayName?: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
	isValidPassword: (password: string) => boolean;
}

interface ITokenizedUser
	extends Omit<
		LeanDocument<IUser & Document<any, any, IUser>>,
		'password' | 'createdAt' | 'updatedAt'
	> {
	password?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
	{
		displayName: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true, versionKey: false }
);

UserSchema.pre('save', async function (next) {
	const user = this;

	const hash = await bcrypt.hash(user.password, 8);

	user.password = hash;

	next();
});

UserSchema.methods.generateToken = function () {
	const user = this;

	let userObj: ITokenizedUser = user.toObject();

	userObj.localId = user._id;

	delete userObj._id;
	delete userObj.createdAt;
	delete userObj.updatedAt;
	delete userObj.password;

	const token = jwt.sign({ ...userObj }, authconfig.token_secret, {
		expiresIn: authconfig.token_life,
	});

	const refreshToken = jwt.sign({ ...user }, authconfig.refresh_token_secret, {
		expiresIn: authconfig.refresh_token_life,
	});

	return { token, refreshToken };
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
