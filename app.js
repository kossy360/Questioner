/* eslint-disable no-unused-vars */
import express from 'express';
import logger from 'morgan';

import error from './middleware/errorhandler';
import routes from './Routes/indexRouter';

const app = express();

const port = process.env.PORT || 3000;
app.listen(port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1', routes.generalRoute);

app.use('/api/v1', (req, res, next) => {
  const sender = req.get('auth');
  if (sender === 'user') routes.userRoute(req, res);
  else if (sender === 'admin') routes.adminRoute(req, res);
  else error(403, res, 'authorization not understood');
});

app.use('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'welcome to questioner, please refer to our API docs for valid requests',
  });
});

// error handler
app.use((err, req, res, next) => {
  error(err, res);
});

export default app;
