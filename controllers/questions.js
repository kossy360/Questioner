import storage from '../storage';
import validator from '../middleware/validator';
import error from '../middleware/errorhandler';

const success = (status, data) => ({ status, data });

const control = {
  getAll: (req, res) => {
    const questions = storage.questions
      .filter(question => question.meetup.toString() === req.params.meetupId);
    if (questions.length > 0) res.status(200).json(success(200, [questions]));
    else {
      res.status(200).json({
        status: 200,
        message: 'there are no questions found for this meetup',
      });
    }
  },

  createNew: async (req, res) => {
    const body = await validator(req.body, 'questions').catch(() => error(400, res));
    if (!body) return;
    body.id = `${storage.questions.length + 1}`;
    storage.meetups.push(body);
    res.status(201).json(success(201, [body]));
  },

  upvote: (req, res) => {
    const questions = storage.questions
      .find(question => question.id.toString() === req.params.questionId);
    if (questions) {
      questions.votes += 1;
      res.status(200).json(success(200, [questions]));
    } else error(404, res, 'question not found');
  },

  downvote: (req, res) => {
    const questions = storage.questions
      .find(question => question.id.toString() === req.params.questionId);
    if (questions) {
      questions.votes -= 1;
      res.status(200).json(success(200, [questions]));
    } else error(404, res, 'question not found');
  },
};

export default control;
