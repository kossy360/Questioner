import validator from '../middleware/validator';
import error from '../middleware/errorhandler';
import db from '../db/db';

const success = (status, data) => ({ status, data });

const control = {
  register: async (req, res) => {
    try {
      const { meetupId } = await validator(req.params, 'reqId');
      const { rowCount } = await db.query(
        'INSERT INTO public.notifications (user_id, meet) VALUES ($1, $2) ON CONFLICT ON CONSTRAINT notifications_unique DO NOTHING;',
        [req.decoded.user, meetupId],
      );
      if (rowCount > 0) {
        res.status(201).json({
          status: 201,
          message: `notifications registered for meetup ${meetupId}`,
        });
      }
    } catch (e) {
      if (e.code === '23503') {
        res.status(201).json({
          status: 201,
          message: 'you have already set up notifications for this meetup',
        });
      } else if (e.details[0]) error(400, res, e.details[0].message.replace(/"/g, ''));
      else error(500, res);
    }
  },
};

export default control;
