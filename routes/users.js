import Router from 'express';
import users from '../controllers/users';

const router = Router();

router.post('/signup', users.createNew);

export default router;
