import validator from '../helpers/validator';
import createError from '../helpers/createError';
import { notificationsQuery } from '../db/querydata';

const success = (status, data) => ({ status, data });

const control = {
  register: async (req, res) => {
    try {
      const { meetupId } = await validator(req.params, 'requestId');
      const { rowCount } = await notificationsQuery.register(req.decoded.user, meetupId);
      if (rowCount > 0) {
        res.status(201).json({
          status: 201,
          message: `notifications registered for meetup ${meetupId}`,
        });
      }
    } catch (error) {
      if (error.code === '23503') {
        res.status(200).json({
          status: 200,
          message: 'you have already set up notifications for this meetup',
        });
      } else if (error.details[0]) createError(400, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    }
  },

  reset: async (req, res) => {
    try {
      const { meetupId } = await validator(req.params, 'requestId');
      const { rowCount } = await notificationsQuery.reset(req.decoded.user, meetupId);
      if (rowCount > 0) {
        res.status(200).json({
          status: 200,
          message: `notification reset for meetup ${meetupId}`,
        });
      } else createError(404, res, 'meetup not registered for notifications or meetup does not exist');
    } catch (error) {
      if (error.details[0]) createError(400, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    }
  },

  clear: async (req, res) => {
    try {
      const { meetupId } = await validator(req.params, 'requestId');
      const { rowCount } = await notificationsQuery.clear(req.decoded.user, meetupId);
      if (rowCount > 0) {
        res.status(200).json({
          status: 200,
          message: `notification stopped for ${meetupId}`,
        });
      } else createError(404, res, 'meetup not registered for notifications or meetup does not exist');
    } catch (error) {
      if (error.details[0]) createError(400, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    }
  },

  getAll: async (req, res) => {
    try {
      const { rows, rowCount } = await notificationsQuery.getAll(req.decoded.user);
      if (rowCount > 0) res.status(200).json(success(200, rows));
      else {
        res.status(200).json({
          status: 200,
          message: 'you have no new notifications',
        });
      }
    } catch (error) {
      createError(500, res);
    }
  },
};

export default control;
