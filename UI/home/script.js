/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
/* eslint-env browser */

import {
  meetCreator,
  notifCreator,
  bookCreator,
  bookQuestionCreator,
  imageCreator,
} from '../modules/element-creator.js';
import {
  imgBtnControl,
  notifContol,
} from '../modules/buttonControllers.js';
import dummydata from '../modules/dummy-data.js';
import { createQuestions } from '../modules/pagecontrol.js';
import { imageInputControl } from '../modules/imageControl.js';
import { populateProfile } from '../modules/profileControl.js';
import fetchData from '../helpers/fetchData.js';
import Slide from '../modules/slide.js';

const profile = dummydata.user;
// if (!profile) window.location.href = '/Quetioner/UI';

const loop = Array.prototype.forEach;

const swith = (id, showClass) => {
  const showing = document.querySelector(`.${showClass}`);
  showing.classList.toggle(showClass);
  document.getElementById(id).classList.add(showClass);
};

const tabControl = (tabClass, showClass) => {
  const elements = document.getElementsByClassName(tabClass);
  loop.call(elements, (elem) => {
    elem.addEventListener('click', () => {
      swith(elem.getAttribute('tab-id'), showClass);
      const active = document.querySelector(`.${tabClass}.tab-active`);
      if (active === elem) return;
      active.classList.remove('tab-active');
      elem.classList.add('tab-active');
    });
  });
};

tabControl('tab-selector', 'section-showing');

tabControl('result-tab', 'result-container-showing');

const rsvpControl = (rsvps, box) => {
  rsvps.forEach((elem) => {
    elem.addEventListener('click', (e) => {
      e.stopPropagation();
      if (elem.classList.contains('active')) return;
      rsvps.forEach(enemy => enemy.classList.remove('active'));
      elem.classList.add('active');

      if (!elem.classList.contains('yes')) {
        if (box) box.parentElement.removeChild(box);
      } else {
        // create rsvp record
        addBook(dummydata.rsvps[0]);
      }
    });
  });
};

const addMeet = (data) => {
  const [main, rsvps, notif] = meetCreator(
    document.querySelector('#meets-section'), data,
  );
  main.data = data;
  main.addEventListener('click', () => {
    expandMeet(data);
    swith('meet-expanded', 'section-showing');
  });
  rsvpControl(rsvps);
  notifContol(notif);
};

const addNotif = (data) => {
  notifCreator(document.querySelector('#notif-section'), data);
};

const addBook = (booked) => {
  const container = document.getElementById('booked-section');
  const [main, qbox, btn, rsvps, notif] = bookCreator(container, booked);

  btn.addEventListener('click', () => {
    if (btn.classList.contains('collapsed')) {
      if (!qbox.classList.contains('populated')) {
        addBookQuestions(main.meetup, qbox);
      }
      btn.classList.replace('collapsed', 'expanded');
      qbox.classList.add('showing');
    } else {
      btn.classList.replace('expanded', 'collapsed');
      qbox.classList.remove('showing');
    }
    btn.textContent = btn.classList.contains('expanded') ? 'collapse' : 'expand';
  });

  notifContol(notif);
  rsvpControl(rsvps, main);
};

const addBookQuestions = (id, box) => {
  // get data with id
  const voteCount = bookQuestionCreator(box, dummydata.questions);
  box.classList.add('populated');
  return voteCount;
};

const expandMeet = (meetData) => {
  const container = document.getElementById('meet-expanded-container');
  while (container.hasChildNodes()) container.removeChild(container.lastChild);
  const [box, rsvps, notif, image] = meetCreator(container, meetData);
  box.classList.add('expanded');
  if (meetData.images.length > 0) {
    const imgArray = imageCreator(meetData.images, image);
    imgBtnControl(imgArray);
  }
  rsvpControl(rsvps);
  notifContol(notif);
  createQuestions(box, dummydata.questions);
};

const populate = () => {
  dummydata.meetups.forEach((meet) => {
    addMeet(meet);
  });

  dummydata.notifications.forEach((notif) => {
    addNotif(notif);
  });

  dummydata.rsvps.forEach((rsvp) => {
    addBook(rsvp);
  });
};

populateProfile(
  document.getElementsByClassName('profile-input'),
  document.getElementsByClassName('profile-edit-button'),
  profile,
);

document.getElementById('profile-picture-input')
  .addEventListener('change', () => {
    const input = document.getElementById('profile-picture-input');
    const img = document.getElementById('profile-picture');
    imageInputControl(null, input, img);
    document.getElementById('profile-icon')
      .src = input.url[0];
  });

document.querySelector('.profile-button').addEventListener('click', (e) => {
  window.location.href = '../signin';
});

window.addEventListener('load', populate);
