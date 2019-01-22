/* eslint-disable no-param-reassign */
import cloudinary from 'cloudinary';

const extractId = (imgArray) => {
  const ids = [];
  imgArray.forEach((url) => {
    ids.push(/(\w+).\w+$/.exec(url)[1]);
  });
  return ids;
};

const cloudDelete = images => new Promise(res => cloudinary.v2.api
  .delete_resources(extractId(images),
    (error, result) => {
      if (result) {
        console.log(result);
        res(true);
      } else res(false);
    }));

export default cloudDelete;
