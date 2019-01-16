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

  reset: async (req, res) => {
    try {
      const { meetupId } = await validator(req.params, 'reqId');
      const { rowCount } = await db.query(
        'UPDATE public.notifications SET last_seen = $1 WHERE meet=$2 AND user_id=$3 RETURNING *;',
        [Date.now(), meetupId, req.decoded.user],
      );
      if (rowCount > 0) {
        res.status(200).json({
          status: 200,
          message: `notification reset for meetup ${meetupId}`,
        });
      } else {
        res.status(200).json({
          status: 200,
          message: `you have not registered notifications for meetup ${meetupId}`,
        });
      }
    } catch (e) {
      if (e.details[0]) error(400, res, e.details[0].message.replace(/"/g, ''));
      else error(500, res);
    }
  },

  clear: async (req, res) => {
    try {
      const { meetupId } = await validator(req.params, 'reqId');
      const { rowCount } = await db.query(
        'DELETE FROM public.notifications WHERE user_id = $1 AND meet=$2 RETURNING *',
        [req.decoded.user, meetupId],
      );
      if (rowCount > 0) {
        res.status(200).json({
          status: 200,
          message: `notification stopped for ${meetupId}`,
        });
      } else {
        res.status(200).json({
          status: 200,
          message: `you have not registered notifications for meetup ${meetupId}`,
        });
      }
    } catch (e) {
      if (e.details[0]) error(400, res, e.details[0].message.replace(/"/g, ''));
      else error(500, res);
    }
  },

  getAll: async (req, res) => {
    try {
      const { rows, rowCount } = await db.query("SELECT * FROM get_notif_user($1) WHERE res != '[]'::jsonb", [req.decoded.user]);
      if (rowCount > 0) res.status(200).json(success(200, rows));
      else {
        res.status(200).json({
          status: 200,
          message: 'you have no new notifications',
        });
      }
    } catch (e) {
      if (e.details[0]) error(400, res, e.details[0].message.replace(/"/g, ''));
      else error(500, res);
    }
  },
};

export default control;
