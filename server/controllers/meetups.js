import validator from '../helpers/validator';
import createError from '../helpers/createError';
import { meetupQuery } from '../db/querydata';

const success = (status, data) => ({ status, data });

const control = {
  getAll: async (req, res) => {
    try {
      const { rows, rowCount } = await meetupQuery.getAll(req.decoded.user, req.decoded.isAdmin);
      if (rowCount > 0) res.status(200).send(success(200, rows));
      else {
        res.status(200).send({
          status: 200,
          message: 'there are no meetup records available',
        });
      }
    } catch (error) {
      createError(500, res);
    }
  },

  getUpcoming: async (req, res) => {
    try {
      const { rows, rowCount } = await meetupQuery
        .getUpcoming(req.decoded.user, req.decoded.isAdmin);
      if (rowCount > 0) res.status(200).send(success(200, rows));
      else {
        res.status(200).send({
          status: 200,
          message: 'there are no upcoming meetups',
        });
      }
    } catch (error) {
      createError(500, res);
    }
  },

  getSpecific: async (req, res, next) => {
    try {
      const { meetupId } = await validator(req.params, 'requestId');
      const { rows, rowCount } = await meetupQuery
        .getSpecific(req.decoded.user, req.decoded.isAdmin, meetupId);
      if (rowCount > 0) res.status(200).send(success(200, rows));
      else next(404);
    } catch (error) {
      createError(400, res, error.details[0].message.replace(/"/g, ''));
    }
  },

  createNew: async (req, res, next) => {
    if (req.decoded.isAdmin) {
      try {
        const body = await validator(req.body, 'meetup');
        const { rows, rowCount } = await meetupQuery.createNew(body);
        if (rowCount > 0) res.status(201).json(success(201, rows));
        else next(500);
      } catch (error) {
        if (error.details[0]) createError(422, res, error.details[0].message.replace(/"/g, ''));
        else createError(500, res);
      }
    } else createError(403, res, 'only users with administrative rights can create meetups');
  },

  deleteSpecific: async (req, res) => {
    if (req.decoded.isAdmin) {
      try {
        const { meetupId } = await validator(req.params, 'requestId');
        const { rowCount } = await meetupQuery.delete(meetupId);
        if (rowCount > 0) {
          res.status(200).json({
            status: 200,
            message: 'meetup deleted',
          });
        } else {
          createError(404, res, 'meetup not found, it has either been deleted or it never existed');
        }
      } catch (error) {
        if (error.details[0]) createError(422, res, error.details[0].message.replace(/"/g, ''));
        else createError(500, res);
      }
    } else createError(403, res, 'only users with administrative rights can delete meetups');
  },

  update: async (req, res) => {
    if (req.decoded.isAdmin) {
      try {
        const { meetupId } = await validator(req.params, 'requestId');
        const body = await validator(req.body, 'updateMeetup');
        const { rows, rowCount } = await meetupQuery.update(body, meetupId);
        if (rowCount > 0) res.status(200).json(success(200, rows));
        else createError(404, res, 'meetup does not exist');
      } catch (error) {
        if (error.details[0]) createError(422, res, error.details[0].message.replace(/"/g, ''));
        else createError(500, res);
      }
    } else createError(403, res, 'only users with administrative rights can update meetups');
  },
};

export default control;
