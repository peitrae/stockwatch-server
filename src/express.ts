import express, { Request, Response } from 'express';
import cors from 'cors';

import userRouter from './user/routers';

const corsOptions = {
	origin: process.env.CLIENT_URL,
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/v1/user/', userRouter);

app.use((error: Error, _: Request, res: Response) => {
	res.status(500).json({ error });
});

export default app;
