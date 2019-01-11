import Router from 'express';
import meetups from '../controllers/meetups';

const router = Router();

router.post('/meetups', meetups.createNew);

export default router;
