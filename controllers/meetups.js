import validator from '../middleware/validator';
import error from '../middleware/errorhandler';
import db from '../db/db';
import generate from '../db/querygenerator';

const success = (status, data) => ({ status, data });

const fields = 'id, topic, location, happening, tags, images';

const control = {
  getAll: async (req, res) => {
    try {
      const { rows, rowCount } = await db.query(`SELECT * from all_meets_${req.decoded.isAdmin ? 'admin' : 'user'}(${req.decoded.user})`);
      if (rowCount > 0) res.status(200).send(success(200, rows));
      else {
        res.status(200).send({
          status: 200,
          message: 'there are no meetup records available',
        });
      }
    } catch (e) {
      error(500, res);
    }
  },

  getUpcoming: async (req, res) => {
    try {
      const { rows, rowCount } = await db.query(`SELECT * FROM all_meets_${req.decoded.isAdmin ? 'admin' : 'user'}(${req.decoded.user}) WHERE happening > ${Date.now() - 172800000}`);
      if (rowCount > 0) res.status(200).send(success(200, rows));
      else {
        res.status(200).send({
          status: 200,
          message: 'there are no upcoming meetups',
        });
      }
    } catch (e) {
      error(500, res);
    }
  },

  getSpecific: async (req, res, next) => {
    try {
      const { meetupId } = await validator(req.params, 'reqId');
      const { rows, rowCount } = await db.query(`SELECT * FROM all_meets_${req.decoded.isAdmin ? 'admin' : 'user'}(${req.decoded.user}) WHERE id = $1`, [meetupId]);
      if (rowCount > 0) res.status(200).send(success(200, rows));
      else next(404);
    } catch (e) {
      error(400, res, e.details[0].message.replace(/"/g, ''));
    }
  },

  createNew: async (req, res, next) => {
    if (req.decoded.isAdmin) {
      try {
        const body = await validator(req.body, 'meetup');
        const { key1, key2, values } = generate.insertFields(body);
        const { rows, rowCount } = await db.query(`INSERT INTO public.meets (${key1}) VALUES (${key2}) RETURNING ${fields}`, values);
        if (rowCount > 0) res.status(201).json(success(201, rows));
        else next(500);
      } catch (e) {
        if (e.details[0]) error(400, res, e.details[0].message.replace(/"/g, ''));
        else error(500, res);
      }
    } else error(403, res, 'only users with administrative rights can create meetups');
  },
};

export default control;
