/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import cloud from 'cloudinary';

cloud.config();

const updateImage = (req, url) => {
  const { body } = req;
  if (body.images && typeof body.images === 'string') body.images = JSON.parse(body.images).concat(url);
  else if (body.images && typeof body.images === 'object') body.images = body.images.concat(url);
  else body.images = [url];
  return req;
};

const extractId = (imgArray) => {
  const ids = [];
  imgArray.forEach((url) => {
    ids.push(/(\w+).\w+$/.exec(url)[1]);
  });
  return ids;
};

const imageDelete = (images, user) => new Promise((res) => {
  if (!user && images.length === 0) {
    res(true);
    return;
  }
  cloud.v2.api.delete_resources(user ? images : extractId(images),
    (error, result) => {
      if (result) {
        if (user) user.displaypicture = null;
        res(true);
      } else res(false);
    });
});


const imageUpload = (req, user = null) => new Promise((res, rej) => {
  const { files } = req;
  const options = user ? { public_id: `display-pic-${req.decoded.user}` } : {};
  if (!files || files.length === 0) {
    if (req.body.displaypicture === '') {
      imageDelete(`display-pic-${req.decoded.user}`, req.body);
    }
    res(true);
    return;
  }
  let rescount = 0;

  const check = () => {
    if (user) {
      res(true);
      return;
    }
    if (rescount === files.length) {
      res(true);
    }
  };

  files.forEach((file) => {
    const typeArray = ['image/jpg', 'image/png', 'image/jpeg'];
    if (typeArray.indexOf(file.mimetype) >= 0) {
      cloud.uploader.upload_stream((image, error) => {
        if (error) {
          rej(error);
          return;
        }
        const { secure_url } = image;
        if (!secure_url) rej(image);
        if (!user) req = updateImage(req, secure_url);
        else req.body.displaypicture = secure_url;
        rescount += 1;
        check();
      }, options).end(file.buffer);
    } else {
      rescount += 1;
      check();
    }
  });
});

export {
  imageUpload,
  imageDelete,
};
