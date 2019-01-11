import Router from 'express';
import rsvps from '../controllers/rsvps';

const router = Router();

router.post('/meetups/:meetId/rsvps', rsvps.createNew);

export default router;
