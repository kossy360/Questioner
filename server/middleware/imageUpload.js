/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import Router from 'express';
import cloud from 'cloudinary';
import multer from 'multer';
import validator from '../helpers/validator';
import createError from '../helpers/createError';

cloud.config({
  cloud_name: 'kossy360',
  api_key: '835855561877663',
  api_secret: 'bt4QETeOtoHv4PlBvA_i2IK0XaY',
});

const router = Router();
const upload = multer();
const updateImage = (req, url) => {
  const { body } = req;
  if (body.images) body.images = JSON.parse(body.images).concat(url);
  else body.images = [url];
  return req;
};

router.use(upload.any());

router.post('/', (req, res, next) => {
  validator(req.body, 'meetup')
    .then(() => next())
    .catch((error) => {
      if (error.details[0]) createError(422, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    });
});

router.patch('/', (req, res, next) => {
  validator(req.params, 'requestId')
    .then(() => validator(req.body, 'updateMeetup'))
    .then(() => next())
    .catch((error) => {
      if (error.details[0]) createError(422, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    });
});

router.use((req, res, next) => {
  const { files } = req;
  if (!files || files.length === 0) {
    next();
    return;
  }
  let rescount = 0;

  const check = () => {
    if (rescount === files.length) next();
  };

  files.forEach((file) => {
    const typeArray = ['image/jpg', 'image/png', 'image/jpeg'];
    if (typeArray.indexOf(file.mimetype) >= 0) {
      cloud.uploader.upload_stream((image) => {
        const { secure_url } = image;
        req = updateImage(req, secure_url);
        rescount += 1;
        check();
      }).end(file.buffer);
    } else {
      rescount += 1;
      check();
    }
  });
});

export default router;
