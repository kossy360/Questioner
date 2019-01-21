import Router from 'express';
import users from '../controllers/users';

const router = Router();

router.post('/auth/login', users.login);

router.post('/auth/signup', users.signUp);

export default router;
