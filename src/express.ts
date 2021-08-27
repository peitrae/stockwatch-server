import express, { Request, Response } from 'express';

import userRouter from './user/routers';

const app = express();

app.use(express.json());

app.use('/api/v1/user/', userRouter);

app.use((error: Error, _: Request, res: Response) => {
	res.status(500).json({ error });
});

export default app;
