import Router from 'express';
import meetups from '../controllers/meetups';
import error from '../middleware/errorhandler';

const router = Router();

router.post('/meetups', meetups.createNew);

router.use((req, res) => error(400, res, 'request path invalid, please refer to API documentation'));

export default router;
