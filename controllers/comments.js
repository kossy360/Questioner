import validator from '../helpers/validator';
import createError from '../helpers/createError';
import { commentsQuery } from '../db/querydata';

const success = (status, data) => ({ status, data });

const control = {
  getAll: async (req, res) => {
    try {
      const { questionId } = await validator(req.params, 'reqId');
      const { rows, rowCount } = await commentsQuery.getall(questionId);
      if (rowCount > 0) res.status(200).json(success(200, rows));
      else {
        res.status(200).send({
          status: 200,
          message: `there are no comments for the question with id: ${questionId}`,
        });
      }
    } catch (error) {
      createError(500, res);
    }
  },

  createNew: async (req, res, next) => {
    try {
      const body = await validator(req.body, 'comments');
      const { rows, rowCount } = await commentsQuery.createNew(req.decoded.user, body);
      if (rowCount > 0) res.status(201).json(success(201, rows));
      else next(500);
    } catch (error) {
      if (error.code === '23503') {
        res.status(200).json({
          status: 200,
          message: 'either the user or question does not exist',
        });
      } else if (error.details[0]) createError(400, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    }
  },
};

export default control;
