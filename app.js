/* eslint-disable no-unused-vars */
import http from 'http';
import debug from 'debug';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import generalRouter from './Routes/general';
import usersRouter from './Routes/users';
import adminRouter from './Routes/admin';

debug('Questioner');
const app = express();

const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);

server.listen(port);
server.on('error', (error) => {
  throw error;
});

server.on('listening', () => {
  debug(`Listening on port ${port}`);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
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
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

export default server;
