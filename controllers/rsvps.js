import validator from '../helpers/validator';
import error from '../helpers/errorhandler';
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
      } catch (e) {
        if (e.code === '23503') error(404, res, 'meetup does not exist');
        else if (e.details[0]) error(400, res, e.details[0].message.replace(/[[\]"]/g, ''));
        else error(500, res);
      }
    } else error(403, res, 'this route is only available to users');
  },
};

export default control;
