import Router from 'express';
import meetups from '../controllers/meetups';
import questions from '../controllers/questions';

const router = Router();

router.get('/meetups/upcoming', meetups.getUpcoming);

router.get('/meetups/:meetupId', meetups.getSpecific);

router.get('/meetups', meetups.getAll);

router.get('/questions/:meetupId', questions.getAll);

router.post('/questions', questions.createNew);

router.patch('/questions/:questionId/upvote', questions.upvote);

router.patch('/questions/:questionId/downvote', questions.downvote);

export default router;
