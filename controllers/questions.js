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
    const body = await validator(req.body, 'questions').catch(e => error(400, res, e.details[0].message.replace(/"/g, '')));
    if (!body) return;
    body.id = `${storage.questions.length + 1}`;
    storage.meetups.push(body);
    res.status(201).json(success(201, [body]));
  },

  vote: (req, res) => {
    const questions = storage.questions
      .find(question => question.id.toString() === req.params.questionId);
    let vote = 0;
    if (questions) {
      if (req.params.vote.toLowerCase() === 'upvote') vote = 1;
      else if (req.params.vote.toLowerCase() === 'downvote') vote = -1;
      else {
        error(400, res, 'vote parameter does not match "upvote" or "downvote"');
        return;
      }
      questions.votes += vote;
      res.status(200).json(success(200, [questions]));
    } else error(404, res, 'question not found');
  },
};

export default control;
