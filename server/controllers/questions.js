/* eslint-disable camelcase */
import validator from '../helpers/validator';
import createError from '../helpers/createError';
import { questionQuery } from '../db/querydata';

const success = (status, data) => ({ status, data });

const convertVote = (vote) => {
  const val = vote.toLowerCase();
  if (val === 'upvote') return 1;
  if (val === 'downvote') return -1;
  return 0;
};

const control = {
  getAll: async (req, res) => {
    try {
      const { meetupId } = await validator(req.params, 'requestId');
      const { rows, rowCount } = await questionQuery.getAll(req.decoded.user, meetupId);
      if (rowCount > 0) res.status(200).json(success(200, rows));
      else {
        res.status(200).send({
          status: 200,
          message: `there are no questions for meetup with id: ${meetupId}`,
        });
      }
    } catch (error) {
      createError(500, res);
    }
  },

  createNew: async (req, res) => {
    try {
      const body = await validator(req, 'questions');
      const { rows } = await questionQuery.createNew(req.decoded.user, body);
      res.status(201).json(success(201, rows));
    } catch (error) {
      if (error.code === '23503') createError(404, res, 'either the user or meetup does not exist');
      else if (error.isJoi) createError(422, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    }
  },

  vote: async (req, res) => {
    try {
      const { vote, questionId } = await validator(req.params, 'requestId');
      const { rows } = await questionQuery
        .vote(req.decoded.user, questionId, convertVote(vote));
      res.status(201).json(success(201, rows));
    } catch (error) {
      if (error.code === '23503') {
        createError(404, res, 'either the user or question does not exist');
      } else if (error.details[0]) createError(400, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    }
  },
};

export default control;
