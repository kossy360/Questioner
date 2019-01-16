// import storage from '../storage';
import validator from '../middleware/validator';
import error from '../middleware/errorhandler';
import db from '../db/db';
import generate from '../db/querygenerator';
import authenticator from '../middleware/authenticator';

const success = (status, data) => ({ status, data });
const fields = 'id, firstname, lastname, othername, email, phoneNumber, username, registered, isadmin';


const controller = {
  createNew: async (req, res, next) => {
    try {
      const body = await validator(req.body, 'user');
      const { key1, key2, values } = generate.insertFields(body);
      const { rows, rowCount } = await db.query(`INSERT INTO public.user (${key1}) VALUES (${key2}) RETURNING ${fields}`, values);
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
};

export default controller;
