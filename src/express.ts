import express from 'express';
import cors from 'cors';

import userRouter from './user/routers';

const isFromWhitelist = (origin: string | undefined, callback: Function) => {
	const whitelist = [
		process.env.CLIENT_URL,
		'https://studio.apollographql.com',
    undefined
	];

	if (whitelist.indexOf(origin) !== -1) {
		callback(null, true);
	} else {
		callback(new Error('Not Allowed by CORS'));
	}
};

const corsOptions = {
	origin: isFromWhitelist,
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/v1/user/', userRouter);

export default app;
