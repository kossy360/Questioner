import Router from 'express';
import meetups from '../controllers/meetups';
import questions from '../controllers/questions';
import rsvps from '../controllers/rsvps';

const router = Router();

const methods = ['POST', 'GET', 'PATCH', 'DELETE'];

router.use('/', (req, res, next) => {
  if (methods.indexOf(req.method) === -1) next(405);
  else next();
});

router.get('/meetups/upcoming', meetups.getUpcoming);

router.get('/meetups/:meetupId', meetups.getSpecific);

router.get('/meetups', meetups.getAll);

router.get('/questions/:meetupId', questions.getAll);

router.post('/meetups', meetups.createNew);

router.post('/questions', questions.createNew);

router.post('/meetups/:meetupId/rsvps', rsvps.createNew);

router.patch('/meetups/:meetupId', meetups.update);

router.patch('/questions/:questionId/:vote', questions.vote);

router.delete('/meetups/:meetupId', meetups.deleteSpecific);

export default router;
