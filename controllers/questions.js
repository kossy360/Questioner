import storage from '../storage';

const success = (status, data) => ({ status, data });
const errors = (status, error) => ({ status, error });

/* const reduce = (questions) => {
  const reducedMeet = questions.map((question) => {
    const result = {
      id: question.id,
      createdOn: question.createdOn,
      createdBy: question.createdBy,
      meetup: question.meetup,
      body: question.body,
      votes: question.votes,
    };
    return result;
  });
  return reducedMeet;
}; */

const control = {
  getAll(req, res) {
    const questions = storage.questions
      .filter(question => question.meetup.toString() === req.params.meetupId);
    if (questions) res.status(200).send(success(200, [questions]));
    else res.status(200).send(errors(500, 'critical server error'));
  },

  createNew(req, res) {
    const { body } = req;
    body.id = `${storage.questions.length + 1}`;
    storage.questions.push(body);
    res.status(200).send(success(200, [body]));
  },

  upvote(req, res) {
    const questions = storage.questions
      .find(question => question.id.toString() === req.params.questionId);
    if (questions) {
      questions.votes += 1;
      res.status(200).send(success(200, [questions]));
    } else res.status(404).send(errors(404, 'question not found'));
  },

  downvote(req, res) {
    const questions = storage.questions
      .find(question => question.id.toString() === req.params.questionId);
    if (questions) {
      questions.votes -= 1;
      res.status(200).send(success(200, [questions]));
    } else res.status(404).send(errors(404, 'question not found'));
  },
};

export default control;
