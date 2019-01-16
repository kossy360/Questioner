import validator from '../middleware/validator';
import error from '../middleware/errorhandler';
import db from '../db/db';

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
};

export default control;
