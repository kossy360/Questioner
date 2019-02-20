const regEx = /(:*)(\d{0,2})(\d*)(:{0,1})(:*)(\d{0,2})(\d*)(:*)/g;
const hRegEx = /^(\d):/;
const mRegEx = /:(\d)$/;
const cRegEx = /^(\d{2})$/;

const cHours = (string, input) => {
  if (hRegEx.test(string) && /\D/.test(input)) return string.replace(hRegEx, '0$1:');
  return string;
};

const cMin = (string) => {
  if (mRegEx.test(string)) return string.replace(mRegEx, ':0$1');
  return string;
};

const addCol = (string) => {
  if (cRegEx.test(string)) return string.replace(cRegEx, '$1:');
  return string;
};

const check = (string, { iso }) => {
  const arr = string.split(':').filter(i => !!i).map(str => Number(str));
  const date = new Date();
  const dateChk = date.toLocaleDateString() === new Date(iso).toLocaleDateString();
  const chk1 = arr[0] >= (dateChk ? date.getHours() : 0) && arr[0] <= 24;
  const chk2 = arr[1] > (dateChk && arr[0] === date.getHours()
    ? date.getMinutes() : -1) && arr[1] <= 59 && chk1;
  return arr.length === 1 ? chk1 : chk2;
};

const sterilize = (str, input) => {
  let string = str;
  string = string.replace(/[^\d:]/g, '');
  string = string.replace(regEx, '$2$4$6');
  string = addCol(string);
  string = cHours(string, input);
  return string;
};

const control = (input, datePicker) => {
  datePicker.callback = (dateObj) => {
    input.classList.toggle('invalid', !check(input.value, dateObj));
  };

  input.addEventListener('input', (e) => {
    let string = input.value;
    if (e.data) string = sterilize(string, e.data);
    input.value = string;
    input.classList.toggle('invalid', !check(string, datePicker.dateObj));
  });

  input.addEventListener('blur', () => {
    if (!input.value) {
      input.classList.add('invalid');
      return;
    }
    let string = input.value;
    string = string.replace(/^(\d+)$/, '$1:');
    string = sterilize(string);
    string = string.replace(/:$/, ':0');
    string = cMin(string);
    input.value = string;
  });
};

export default control;
