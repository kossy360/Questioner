import Router from 'express';
import meetups from '../controllers/meetups';

const router = Router();

router.post('/meetups', meetups.createNew);

router.use((req, res, next) => next(405));
export default router;
