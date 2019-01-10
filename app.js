/* eslint-disable no-unused-vars */
import express from 'express';
import logger from 'morgan';

import error from './middleware/errorhandler';
import generalRouter from './Routes/general';
import usersRouter from './Routes/users';
import adminRouter from './Routes/admin';

const app = express();

const port = process.env.PORT || 3000;
app.listen(port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1', generalRouter);

app.use('/api/v1', (req, res, next) => {
  const sender = req.get('auth');
  if (sender === 'user') usersRouter(req, res);
  else if (sender === 'admin') adminRouter(req, res);
  else next(403);
});

app.use('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'welcome to questioner, please refer to our API docs for valid requests',
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(404);
});

// error handler
app.use((err, req, res, next) => {
  error(err, res);
});

export default app;
