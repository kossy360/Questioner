import Router from 'express';
import meetups from '../controllers/meetups';
import questions from '../controllers/questions';

const router = Router();

const methods = ['POST', 'GET', 'PATCH'];

router.use('/', (req, res, next) => {
  if (methods.indexOf(req.method) === -1) next(405);
  else next();
});

router.get('/meetups/upcoming', meetups.getUpcoming);

router.get('/meetups/:meetupId', meetups.getSpecific);

router.get('/meetups', meetups.getAll);

router.get('/questions/:meetupId', questions.getAll);

router.post('/questions', questions.createNew);

router.patch('/questions/:questionId/:vote', questions.vote);

router.patch('/questions/:questionId/:vote', questions.vote);

export default router;
