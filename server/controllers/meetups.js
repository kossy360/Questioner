import validator from '../helpers/validator';
import createError from '../helpers/createError';
import { imageUpload, imageDelete } from '../helpers/cloudinary';
import { meetupQuery } from '../db/querydata';

const success = (status, data) => ({ status, data });

const deleteImg = async (images) => {
  try {
    await imageDelete(images);
  } catch (error) {
    if (typeof error !== 'string') throw error;
  }
};

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
        await validator(req, 'meetup');
        await imageUpload(req);
        const { rows, rowCount } = await meetupQuery.createNew(req.body);
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
        const { rows } = await meetupQuery.delete(meetupId);
        if (rows.length > 0) {
          await deleteImg(rows[0].images);
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
        await validator(req, 'updateMeetup');
        await imageUpload(req);
        const { rows } = await meetupQuery.update(req.body, meetupId);
        if (rows.length > 0) {
          await deleteImg(rows[0].dimages);
          delete rows[0].dimages;
          res.status(200).json(success(200, rows));
        } else {
          if (req.body.images) await imageDelete(req.body.images);
          createError(404, res, 'meetup does not exist');
        }
      } catch (error) {
        if (error.details[0]) createError(422, res, error.details[0].message.replace(/"/g, ''));
        else createError(500, res);
      }
    } else createError(403, res, 'only users with administrative rights can update meetups');
  },
};

export default control;
