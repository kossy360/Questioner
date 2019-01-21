import jwt from 'jsonwebtoken';
import createError from '../helpers/createError';

const authenticator = {
  generateToken: body => new Promise((res) => {
    const payload = {
      user: body.id,
      isAdmin: body.isadmin,
      iss: 'questionerAPI',
    };
    const token = jwt.sign(payload, process.env.secretkey, { expiresIn: '5h' });
    res(token);
  }),

  verify: (req, res, next) => {
    jwt.verify(req.get('x-access-token'), process.env.secretkey, (error, decoded) => {
      if (error) {
        const { name, message } = error;
        let msg;
        switch (name) {
          case 'TokenExpiredError':
            msg = 'your access token is expired, login or signup to get a new one';
            break;
          case 'JsonWebTokenError':
            msg = 'an access token is required to access this resource';
            break;
          default:
            msg = message;
        }
        createError(401, res, msg);
        return;
      }
      req.decoded = decoded;
      next();
    });
  },
};

export default authenticator;
