import Router from 'express';
import authenticator from '../middleware/authenticator';
import imageUpload from '../middleware/imageUpload';
import users from '../controllers/users';
import meetups from '../controllers/meetups';
import questions from '../controllers/questions';
import comments from '../controllers/comments';
import rsvps from '../controllers/rsvps';
import notifications from '../controllers/notifications';

const router = Router();
const check = authenticator.verify;
const methods = ['POST', 'GET', 'PATCH', 'DELETE'];

router.use('/', (req, res, next) => {
  if (methods.indexOf(req.method) === -1) next(405);
  else next();
});

router.get('/meetups/upcoming', check, meetups.getUpcoming);

router.get('/meetups/:meetupId', check, meetups.getSpecific);

router.get('/meetups', check, meetups.getAll);

router.get('/questions/:meetupId', check, questions.getAll);

router.get('/comments/:questionId', check, comments.getAll);

router.get('/notifications', check, notifications.getAll);

router.post('/meetups', check, imageUpload, meetups.createNew);

router.post('/questions', check, questions.createNew);

router.post('/comments', check, comments.createNew);

router.post('/meetups/:meetupId/rsvps', check, rsvps.createNew);

router.post('/notifications/:meetupId/register', check, notifications.register);

router.patch('/users/update', check, users.update);

router.patch('/meetups/:meetupId', check, imageUpload, meetups.update);

router.patch('/questions/:questionId/:vote', check, questions.vote);

router.patch('/notifications/:meetupId/reset', check, notifications.reset);

router.delete('/meetups/:meetupId', check, meetups.deleteSpecific);

router.delete('/notifications/:meetupId/clear', check, notifications.clear);

export default router;
