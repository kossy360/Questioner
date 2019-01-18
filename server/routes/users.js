import Router from 'express';
import users from '../controllers/users';

const router = Router();

router.post('/login', users.login);

router.post('/signup', users.signUp);

export default router;
