/* eslint-disable no-unused-vars */
import express from 'express';
import logger from 'morgan';

import createError from './helpers/createError';
import routes from './routes/indexRouter';
import authenticator from './middleware/authenticator';

const app = express();

const port = process.env.PORT || 3000;
app.listen(port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', (req, res, next) => {
  if (req.path === '/') {
    res.status(200).json({
      status: 200,
      message: 'welcome to questioner, please refer to our API docs for valid requests',
    });
  } else next();
});

app.use('/api/v1/auth', routes.userRoute);
app.use('/api/v1', [authenticator.verify, routes.generalRoute]);

app.use('/:invalid', (req, res) => createError(400, res, 'request path invalid, please refer to API documentation'));

app.use('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'welcome to questioner, please refer to our API docs for valid requests',
  });
});

// error handler
app.use((err, req, res, next) => {
  createError(err, res);
});

export default app;
