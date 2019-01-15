/* eslint-disable camelcase */
import validator from '../middleware/validator';
import error from '../middleware/errorhandler';
import db from '../db/db';
import generate from '../db/querygenerator';

const success = (status, data) => ({ status, data });
const fields = 'id, user_id, meetup, body, created, votes';

const convertVote = (vote) => {
  const val = vote.toLowerCase();
  if (val === 'upvote') return 1;
  if (val === 'downvote') return -1;
  return 0;
};

const control = {
  getAll: async (req, res) => {
    try {
      const { meetupId } = await validator(req.params, 'reqId');
      const { rows, rowCount } = await db.query(`SELECT ${fields} FROM public.questions WHERE meetup = $1`, [meetupId]);
      if (rowCount > 0) res.status(200).json(success(200, rows));
      else {
        res.status(200).send({
          status: 200,
          message: `there are no questions for meetup with id: ${meetupId}`,
        });
      }
    } catch (e) {
      error(500, res);
    }
  },

  createNew: async (req, res, next) => {
    try {
      const body = await validator(req.body, 'questions');
      const { key1, key2, values } = generate.insertFields(body);
      const { rows, rowCount } = await db.query(`INSERT INTO public.questions (${key1}) VALUES (${key2}) RETURNING user_id, meetup, body`, values);
      if (rowCount > 0) res.status(201).json(success(201, rows));
      else next(500);
    } catch (e) {
      if (e.code === '23503') error(404, res, 'either the user or meetup does not exist');
      else if (e.details[0]) error(400, res, e.details[0].message.replace(/"/g, ''));
      else error(500, res);
    }
  },

  vote: async (req, res, next) => {
    try {
      const { vote, questionId } = await validator(req.params, 'reqId');
      const { rows, rowCount } = await db.query('SELECT * FROM update_votes($1, $2, $3)', [req.decoded.user, questionId, convertVote(vote)]);
      if (rowCount > 0) res.status(201).json(success(201, rows));
      else next(500);
    } catch (e) {
      if (e.code === '23503') {
        error(404, res, 'either the user or question does not exist');
      } else if (e.details[0]) error(400, res, e.details[0].message.replace(/"/g, ''));
      else error(500, res);
    }
  },
};

export default control;
