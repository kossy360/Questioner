import Router from 'express';
import rsvps from '../controllers/rsvps';
import error from '../middleware/errorhandler';

const router = Router();

router.post('/meetups/:meetId/rsvps', rsvps.createNew);

router.use((req, res) => error(400, res, 'request path invalid, please refer to API documentation'));
export default router;
