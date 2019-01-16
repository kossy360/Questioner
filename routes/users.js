import Router from 'express';
import users from '../controllers/users';

const router = Router();

router.post('/login', users.getUser);

router.post('/signup', users.createNew);

export default router;
