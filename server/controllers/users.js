import crypt from '../helpers/crypt';
import validator from '../helpers/validator';
import createError from '../helpers/createError';
import authenticator from '../middleware/authenticator';
import { imageUpload } from '../helpers/cloudinary';
import { userQuery } from '../db/querydata';

const success = (status, data) => ({ status, data });

const controller = {
  signUp: async (req, res, next) => {
    try {
      let body = await validator(req, 'user');
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
          message: 'user is already registered',
        });
      } else if (error.details[0].type === 'string.regex.base') createError(422, res, 'password must contain 6 - 12 characters');
      else if (error.details[0]) createError(422, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = await validator(req, 'login');
      const { rows } = await userQuery.getUser(email);
      const user = await crypt.verify(rows[0], password);
      if (user) {
        const token = await authenticator.generateToken(rows[0]);
        res.status(200).json({
          status: 200,
          data: [{ token, user }],
        });
        return;
      }
      res.status(200).json({
        status: 200,
        message: 'email or password incorrect',
      });
    } catch (error) {
      if (error.routine) createError(403, res);
      else if (error.details[0].type === 'string.regex.base') createError(422, res, 'password must contain 6 - 12 characters');
      else createError(422, res, error.details[0].message.replace(/"/g, ''));
    }
  },

  update: async (req, res) => {
    try {
      await validator(req, 'updateUser');
      await imageUpload(req, 'user');
      const { rows } = await userQuery.update(req.decoded.user, req.body);
      res.status(200).json(success(200, rows));
    } catch (error) {
      if (error.code === '23505') {
        res.status(200).json({
          status: 200,
          message: 'email already in use',
        });
      } else if (error.details[0]) createError(422, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    }
  },
};

export default controller;
