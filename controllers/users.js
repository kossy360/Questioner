import validator from '../helpers/validator';
import error from '../helpers/errorhandler';
import authenticator from '../middleware/authenticator';
import { userQuery } from '../db/querydata';

const success = (status, data) => ({ status, data });

const controller = {
  signUp: async (req, res, next) => {
    try {
      const body = await validator(req.body, 'user');
      const { rows, rowCount } = await userQuery.createNew(body);
      if (rowCount > 0) {
        const token = await authenticator.generate(rows[0]);
        res.status(201).json({
          status: 201,
          data: [{
            token,
            user: rows[0],
          }],
        });
      } else next(500);
    } catch (e) {
      if (e.code === '23505') {
        res.status(200).json({
          status: 200,
          error: 'user is already registered',
        });
      } else if (e.details[0].type === 'string.regex.base') error(400, res, 'password must contain 6 - 12 characters');
      else if (e.details[0]) error(400, res, e.details[0].message.replace(/"/g, ''));
      else error(500, res);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = await validator(req.body, 'login');
      const { rows, rowCount } = await userQuery.getUser(email, password);
      if (rowCount > 0) {
        const token = await authenticator.generate(rows[0]);
        res.status(200).json({
          status: 200,
          data: [{
            token,
            user: rows[0],
          }],
        });
      } else error(404, res, 'email or password incorrect');
    } catch (e) {
      if (e.routine) error(403, res);
      else if (e.details[0].type === 'string.regex.base') error(400, res, 'password must contain 6 - 12 characters');
      else error(400, res, e.details[0].message.replace(/"/g, ''));
    }
  },

  update: async (req, res) => {
    try {
      const body = await validator(req.body, 'updateUser');
      const { rows, rowCount } = await userQuery.update(req.decoded.user, body);
      if (rowCount > 0) res.status(200).json(success(200, rows));
      else error(404, res, 'user does not exist');
    } catch (e) {
      if (e.code === '23505') {
        res.status(200).json({
          status: 200,
          error: 'email already in use',
        });
      } else if (e.details[0]) error(400, res, e.details[0].message.replace(/"/g, ''));
      else error(500, res);
    }
  },
};

export default controller;
