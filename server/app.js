/* eslint-disable no-unused-vars */
import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import createError from './helpers/createError';
import routes from './routes/indexRouter';

const app = express();

const port = process.env.PORT || 3000;
app.listen(port);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', (req, res, next) => {
  if (req.path === '/' || /^\/api\/v\d+\/*$/.test(req.path)) {
    res.status(200).json({
      status: 200,
      message: 'welcome to questioner, please refer to our API docs for valid requests',
    });
  } else next();
});
app.use('/api/v1', routes.userRoute, routes.generalRoute);
app.use('/:invalid', (req, res) => createError(400, res, 'request path invalid, please refer to API documentation'));

// error handler
app.use((err, req, res, next) => {
  createError(err, res);
});

export default app;
