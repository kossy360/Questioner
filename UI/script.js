/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-env browser */
import getFormData from './helpers/getformData.js';
import fetchData from './helpers/fetchData.js';

const tab1 = document.querySelector('.tab-signup');
const tab2 = document.querySelector('.tab-signin');
const container = document.querySelector('.sign-container');
const button1 = document.getElementById('signup-button');
const button2 = document.getElementById('signin-button');
const inputs = document.getElementsByClassName('form-input');


tab1.addEventListener('click', () => {
  if (container.classList.contains('signup')) return;
  container.classList.replace('signin', 'signup');
  tab2.classList.remove('active');
  tab1.classList.add('active');
});

tab2.addEventListener('click', () => {
  if (container.classList.contains('signin')) return;
  container.classList.replace('signup', 'signin');
  tab1.classList.remove('active');
  tab2.classList.add('active');
});

const pattern = {
  firstname: /^[a-zA-Z]{3,15}$/,
  lastname: /^[a-zA-Z]{3,15}$/,
  othername: /^[a-zA-Z]{3,15}$/,
  username: /^[a-zA-Z]{3,15}$/,
  email: /^\w+@\w+\.\w+$/,
  phonenumber: /^\d{6,15}$/,
  password: /^[\w\W]{6,15}$/,
};

Array.prototype.forEach.call(inputs, (input) => {
  const pointer = input.getAttribute('pointer');
  input.inputError = true;
  input.addEventListener('input', () => {
    input.classList.remove('input-error');
  });

  input.addEventListener('blur', () => {
    input.classList.toggle('input-error', !(pattern[pointer].test(input.value)));
    input.inputError = !(pattern[pointer].test(input.value));
  });
});

const saveData = ({
  token,
  user
}) => {
  window.sessionStorage.setItem('token', token);
  window.sessionStorage.setItem('username', user.username);
  window.sessionStorage.setItem('user', JSON.stringify(user));

  if (user.isadmin) window.location.href = 'admin';
  else window.location.href = 'home';
};

button1.addEventListener('click', async () => {
  const input1 = document.getElementById('input-password1');
  const input2 = document.getElementById('input-password2');
  if (input1.value !== input2.value) {
    input1.classList.add('input-error');
    input2.classList.add('input-error');
    return;
  }
  try {
    const body = getFormData('signup-form-input');
    const {
      data
    } = await fetchData.auth('signup', body, button1);
    saveData(data[0]);
  } catch (error) {
    console.log(error);
  }
});

button2.addEventListener('click', async () => {
  try {
    const body = getFormData('signin-form-input');
    const {
      data
    } = await fetchData.auth('login', body, button2);
    saveData(data[0]);
  } catch (error) {
    console.log(error);
  }
});
