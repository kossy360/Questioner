/* eslint-disable no-unused-vars */
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import generalRouter from './Routes/general';
import usersRouter from './Routes/users';
import adminRouter from './Routes/admin';

const app = express();

const port = process.env.PORT || 3000;
app.listen(port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1', generalRouter);
app.use('/api/v1', (req, res) => {
  const sender = req.get('auth');
  if (sender === 'user') usersRouter(req, res);
  else if (sender === 'admin') adminRouter(req, res);
  else res.status(403).send({ status: 403, error: 'Not Authorized' });
});
app.use('/', (req, res) => {
  res.status(200).send('welcome to the questioner app');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next({
    status: 404,
    message: 'whatever you were lookng for wasn\'t found',
  });
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status).json({
    status: err.status,
    error: err.message,
  });
});

export default app;
