/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-env browser */
import ReadForm from './modules/formProfileReader.js';

const tab1 = document.querySelector('.tab-signup');
const tab2 = document.querySelector('.tab-signin');
const container = document.querySelector('.sign-container');
const button = document.getElementById('signup-button');

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

button.addEventListener('click', () => {
  const form = new ReadForm(
    document.getElementsByClassName('form-input'),
  ).storeProfile();
  window.location.href = './home';
});
