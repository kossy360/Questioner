/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
/* eslint-env browser */
import {
  notifCreator,
  imageCreator,
} from '../modules/element-creator.js';

import { imgBtnControl } from '../modules/buttonControllers.js';
import meetCreator from '../modules/element-creator-admin.js';
import dummydata from './modules/dummy-data.js';
import ReadForm from '../modules/formProfileReader.js';
import Tag from '../modules/add-tag.js';
import { createQuestions } from '../modules/pagecontrol.js';
import { imageInputControl } from '../modules/imageControl.js';
import { populateProfile } from '../modules/profileControl.js';

const tabSelector = document.getElementsByClassName('tab-selector');
const tabs = document.getElementsByClassName('main-section');
const meetContainer = document.getElementsByClassName('meet-container');
const loop = Array.prototype.forEach;
const tag = new Tag(
  document.querySelector('.tag-edit-container'),
  document.querySelector('#meet-tags-input'),
);
tag.initialize();

const swith = (e) => {
  const showing = document.querySelector('.section-showing');
  showing.classList.toggle('section-showing');
  let pos = Array.prototype.indexOf.call(tabSelector, e);
  if (pos === -1) pos = e;
  tabs[pos].classList.add('section-showing');
};

loop.call(tabSelector, (elem) => {
  elem.addEventListener('click', () => {
    swith(elem);
    const active = document.querySelector('.tab-active');
    if (active === elem) return;
    active.classList.remove('tab-active');
    elem.classList.add('tab-active');
  });
});

loop.call(meetContainer, (e) => {
  e.addEventListener('click', () => {
    swith(4);
    expandMeet();
  });
});

loop.call(document.getElementsByClassName('create-button'), (button) => {
  const id = button.id;
  if (id === 'meet-create-button') {
    button.addEventListener('click', () => {
      createMeet();
    });
  } else if (id === 'meet-create-edit') {
    button.addEventListener('click', () => {
      editMeet();
    });
  } else {
    button.addEventListener('click', () => {
      clearInputs();
      tabSelector[0].click();
      editMeet(false);
    });
  }
});

const toggleOrganizer = (title) => {
  const head = document.querySelector('.organizer-header');
  head.innerHTML = title;
};

const populateEdit = (data) => {
  const container = document.querySelector('.meet-selected-container');
  const inputFields = document.getElementsByClassName('meet-create-input');
  loop.call(inputFields, (input) => {
    const pointer = input.getAttribute('pointer');
    if (pointer === 'tags') {
      tag.clear();
      tag.populate(data[pointer]);
    } else if (pointer === 'images') {
      imageInputControl(container, input, null, 1, data[pointer]);
    } else input.value = data[pointer];
  });
};

document.getElementById('meet-picture-input')
  .addEventListener('change', () => {
    const container = document.querySelector('.meet-selected-container');
    const input = document.getElementById('meet-picture-input');
    imageInputControl(container, input, null);
  });

const getData = (inputClass, data) => {
  const inputFields = document.getElementsByClassName(inputClass);
  const obj = data || {};
  loop.call(inputFields, (input) => {
    const pointer = input.getAttribute('pointer');
    if (pointer === 'tags') {
      obj[pointer] = tag.getTag();
    } else if (pointer === 'images') {
      obj[pointer] = input.url;
      console.log(input.url);
    } else obj[pointer] = input.value;
  });
  tag.clear();
  return obj;
};

const editMeet = (data) => {
  const container = document.querySelector('.meet-create-button-container');
  if (data) {
    container.classList.add('edit');
    toggleOrganizer(data.title);
    container.meet = data;
    populateEdit(data);
    tabSelector[2].click();
  } else {
    // verify inputs
    if (data !== false) {
      const obj = getData('meet-create-input', container.meet);
      addMeet(obj, true);
    }
    // send patch request
    tabSelector[0].click();
    container.classList.remove('edit');
    toggleOrganizer('New Meet');
  }
};

const createMeet = () => {
  const obj = getData('meet-create-input');
  const dummyData = { id: 1, rsvp: { yes: 0, maybe: 0, no: 0 }, questions: 0 };
  // send post request
  obj.id = dummyData.id;
  obj.rsvp = dummyData.rsvp;
  obj.questions = dummyData.questions;
  addMeet(obj);
  tabSelector[0].click();
  clearInputs();
};

const clearInputs = () => {
  loop.call(document.getElementsByClassName('meet-create-input'), (input) => {
    input.value = '';
    const container = document.querySelector('.meet-selected-container');
    while (container.hasChildNodes()) container.removeChild(container.firstChild);
  });
  tag.clear();
};

const meetControl = (container, edit, cancel) => {
  edit.addEventListener('click', (e) => {
    e.stopPropagation();
    editMeet(container.data);
  });

  cancel.addEventListener('click', (e) => {
    e.stopPropagation();
    container.parentElement.removeChild(container);
    tabSelector[0].click();
  });
};

const addMeet = (data, replace = false) => {
  const container = replace ? Array.prototype
    .find.call(
      document.getElementsByClassName('meet-container'),
      meet => Number(meet.id) === data.id,
    ) : null;
  const [main, edit, cancel] = meetCreator(
    document.querySelector('#meets-section'), data, container,
  );
  main.addEventListener('click', () => {
    expandMeet(data);
    swith(4);
  });
  meetControl(main, edit, cancel);
};

const addNotif = (data) => {
  notifCreator(document.querySelector('#notif-section'), data);
};

const expandMeet = (meetData) => {
  const container = document.getElementById('meet-expanded-container');
  while (container.hasChildNodes()) container.removeChild(container.lastChild);
  const [box, edit, cancel] = meetCreator(container, meetData);
  if (meetData.images.length > 0) {
    const imgBtn = imageCreator(meetData.images, container);
    imgBtnControl(imgBtn);
  }
  meetControl(box, edit, cancel);
  createQuestions(container, dummydata.questions);
};

const populate = () => {
  dummydata.meetups.forEach((meet) => {
    addMeet(meet);
  });
  dummydata.notifications.forEach((notif) => {
    addNotif(notif);
  });
};

const profile = new ReadForm().getProfile();


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
    document.getElementById('profile-icon').src = input.url[0];
  });

document.querySelector('.profile-button').addEventListener('click', (e) => {
  window.location.href = '../signin';
});

window.addEventListener('load', populate);
