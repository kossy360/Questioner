const modal = document.querySelector('.error-modal');
const body = document.querySelector('.error-text');

const convert = (error) => {
  if (error.typeError) return 'you are not connected';
  if (error.status === 401) return 'session expired, please login again';
  if (error.status === 422) return 'check your data and try again';
  return error.message || error.error || 'fatal error';
};

const errorHandler = (error) => {
  const text = typeof error === 'string' ? error : convert(error);
  body.textContent = text;
  modal.style.height = '3em';

  const timeout = window.setTimeout(() => {
    if (timeout !== modal.timeout) return;
    modal.style.height = '0em';
    delete modal.timeout;
  }, 5000);

  modal.timeout = timeout;
};

export default errorHandler;
