import crypt from '../helpers/crypt';
import validator from '../helpers/validator';
import createError from '../helpers/createError';
import authenticator from '../middleware/authenticator';
import { userQuery } from '../db/querydata';

const success = (status, data) => ({ status, data });

const controller = {
  signUp: async (req, res, next) => {
    try {
      let body = await validator(req.body, 'user');
      body = await crypt.hash(body, 10);
      const { rows, rowCount } = await userQuery.createNew(body);
      if (rowCount > 0) {
        const token = await authenticator.generateToken(rows[0]);
        res.status(201).json({
          status: 201,
          data: [{
            token,
            user: rows[0],
          }],
        });
      } else next(500);
    } catch (error) {
      if (error.code === '23505') {
        res.status(200).json({
          status: 200,
          createError: 'user is already registered',
        });
      } else if (error.details[0].type === 'string.regex.base') createError(400, res, 'password must contain 6 - 12 characters');
      else if (error.details[0]) createError(400, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = await validator(req.body, 'login');
      const { rows } = await userQuery.getUser(email);
      const user = await crypt.verify(rows[0], password);
      if (user) {
        const token = await authenticator.generateToken(rows[0]);
        res.status(200).json({
          status: 200,
          data: [{ token, user }],
        });
      } else createError(404, res, 'email or password incorrect');
    } catch (error) {
      if (error.routine) createError(403, res);
      else if (error.details[0].type === 'string.regex.base') createError(400, res, 'password must contain 6 - 12 characters');
      else createError(400, res, error.details[0].message.replace(/"/g, ''));
    }
  },

  update: async (req, res) => {
    try {
      const body = await validator(req.body, 'updateUser');
      const { rows, rowCount } = await userQuery.update(req.decoded.user, body);
      if (rowCount > 0) res.status(200).json(success(200, rows));
      else createError(404, res, 'user does not exist');
    } catch (error) {
      if (error.code === '23505') {
        res.status(200).json({
          status: 200,
          createError: 'email already in use',
        });
      } else if (error.details[0]) createError(400, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    }
  },
};

export default controller;
