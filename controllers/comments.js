import validator from '../middleware/validator';
import error from '../middleware/errorhandler';
import db from '../db/db';
import generate from '../db/querygenerator';

const success = (status, data) => ({ status, data });

const control = {
  getAll: async (req, res) => {
    try {
      const { questionId } = await validator(req.params, 'reqId');
      const { rows, rowCount } = await db.query(
        'SELECT c.id, c.user_id as user, c.question, u.username, c.comment, c.created FROM public.comments c LEFT JOIN public.user u ON c.user_id = u.id WHERE c.question = $1',
        [questionId],
      );
      if (rowCount > 0) res.status(200).json(success(200, rows));
      else {
        res.status(200).send({
          status: 200,
          message: `there are no comments for the question with id: ${questionId}`,
        });
      }
    } catch (e) {
      error(500, res);
    }
  },

  createNew: async (req, res, next) => {
    try {
      const body = await validator(req.body, 'comments');
      const { key2, values } = generate.insertFields(body);
      const { rows, rowCount } = await db.query(`SELECT * FROM post_comments(${key2})`, values);
      if (rowCount > 0) res.status(201).json(success(201, rows));
      else next(500);
    } catch (e) {
      if (e.code === '23503') {
        res.status(200).json({
          status: 200,
          error: 'either the user or question does not exist',
        });
      } else if (e.details[0]) error(400, res, e.details[0].message.replace(/"/g, ''));
      else error(500, res);
    }
  },
};

export default control;
