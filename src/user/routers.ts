import { Router } from 'express';

import { signup, login, exhangeRefreshToken } from './controllers';

const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/refresh-token', exhangeRefreshToken);

export default router;
