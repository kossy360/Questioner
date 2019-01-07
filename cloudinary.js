import cloud from 'cloudinary';

cloud.config({
  cloud_name: 'kossy360',
  api_key: '835855561877663',
  api_secret: 'bt4QETeOtoHv4PlBvA_i2IK0XaY',
});

const upImage = (req, res) => {
  const { files } = req;
  let rescount = 0;
  const check = () => {
    if (rescount === files.length) res.send('done');
  };

  files.forEach((file) => {
    cloud.uploader.upload_stream((result) => {
      rescount += 1;
      check();
      console.log(result);
    }).end(file.buffer);
  });
};

export default upImage;
