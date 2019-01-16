import jwt from 'jsonwebtoken';
import createError from '../helpers/createError';

const authenticator = {
  generate: body => new Promise((res) => {
    const payload = {
      user: body.id,
      isAdmin: body.isadmin,
      iss: 'questionerAPI',
    };
    const token = jwt.sign(payload, process.env.secretkey, { expiresIn: '5h' });
    res(token);
  }),

  verify: (req, res, next) => {
    jwt.verify(req.get('auth'), process.env.secretkey, (err, decoded) => {
      if (err) {
        createError(403, res, err.message);
        return;
      }
      req.decoded = decoded;
      next();
    });
  },
};

export default authenticator;
