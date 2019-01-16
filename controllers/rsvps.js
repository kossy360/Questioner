import validator from '../helpers/validator';
import createError from '../helpers/createError';
import { rsvpsQuery } from '../db/querydata';

const success = (status, data) => ({ status, data });

const control = {
  createNew: async (req, res, next) => {
    if (!req.decoded.isAdmin) {
      try {
        const { meetupId } = await validator(req.params, 'reqId');
        const { response } = await validator(req.body, 'rsvps');
        const { rows, rowCount } = await rsvpsQuery
          .createNew(req.decoded.user, meetupId, response.toLowerCase());
        if (rowCount > 0) res.status(201).json(success(201, rows));
        else next(500);
      } catch (error) {
        if (error.code === '23503') createError(404, res, 'meetup does not exist');
        else if (error.details[0]) createError(400, res, error.details[0].message.replace(/[[\]"]/g, ''));
        else createError(500, res);
      }
    } else createError(403, res, 'this route is only available to users');
  },
};

export default control;
