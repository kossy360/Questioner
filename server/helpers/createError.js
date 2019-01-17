const errors = {
  400: 'please modify payload to meet specifications',
  401: 'you are not authorized to access this endpoint, Apologies',
  403: 'you are forbidden for accessing this resource, please provide valid authentication',
  404: 'whatever it is you were looking for wasn\'t found',
  405: 'the request method used is not supported, please refer to API docs',
  500: 'something happened on our end, try again. Apologies',
};

const createError = (error, res, message = null) => {
  const errorCode = error.status || error;
  let errorMessage = error.message || message || errors[error];
  if (error.type === 'entity.parse.failed') {
    errorMessage = 'payload is not a valid JSON';
  }
  res.status(errorCode).json({
    status: errorCode,
    error: errorMessage,
  });
};

export default createError;
