/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
/* eslint-env browser */
import {
  notifCreator,
  questionContainerCreator,
  imageCreator,
} from '../modules/element-creator.js';

import {
  voteControl,
  imgBtnControl,
  askBtnControl,
  commentBtnControl,
} from '../modules/buttonControllers.js';

import meetCreator from '../modules/element-creator-admin.js';

import dummydata from './modules/dummy-data.js';

const nav = document.querySelector('nav');
const content = document.querySelector('.content-container');
const tabSelector = document.getElementsByClassName('tab-selector');
const tabs = document.getElementsByClassName('main-section');
// const meetExpanded = document.getElementById('meet-expanded');
const meetContainer = document.getElementsByClassName('meet-container');
// const votebtns = document.getElementsByClassName('vote-btn');
// const createBtn = document.querySelector('.meet-create-button');
const loop = Array.prototype.forEach;

const scroll = () => {
  const scr = window.scrollY;
  if (scr >= 130) {
    if (nav.classList.contains('top-fix')) return;
    nav.classList.add('top-fix');
    content.classList.add('nav-fixed');
    loop.call(tabs, (tab) => {
      tab.classList.add('nav-fixed');
    });
  } else {
    if (nav.classList.contains('top-fix')) nav.classList.remove('top-fix');
    content.classList.remove('nav-fixed');
    loop.call(tabs, (tab) => {
      tab.classList.remove('nav-fixed');
    });
  }
};

const swith = (e) => {
  const showing = document.querySelector('.section-showing');
  // if (showing === e) return;
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
      input.value = data[pointer].join(', ');
    } else if (pointer === 'images') {
      imageInputControl(container, input, null, 1, data[pointer]);
    } else input.value = data[pointer];
  });
};

const imageInputControl = (container, input, imagee, action, data = null) => {
  if (!input.url) input.url = [];
  if (action === 1) {
    while (container.hasChildNodes()) container.removeChild(container.firstChild);
    input.url = [];
    if (!data) return;
  }

  const files = data || input.files;
  loop.call(files, (img) => {
    const image = imagee || document.createElement('img');


    const url = typeof img === 'string' ? img : window.URL.createObjectURL(img);
    image.src = url;
    input.url.push(url);
    if (imagee) return;
    container.appendChild(image);
    document.getElementById('profile-picture').src = url;
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
      obj[pointer] = input.value.replace(/ /g, '').split(',');
    } else if (pointer === 'images') {
      obj[pointer] = input.url;
      console.log(input.url);
    } else obj[pointer] = input.value;
  });
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
    .find.call(document.getElementsByClassName('meet-container'), meet => Number(meet.id) === data.id) : null;


  const [main, edit, cancel] = meetCreator(document.querySelector('#meets-section'), data, container);

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

  meetControl(meetData, edit, cancel);
  const [main, ask, voteArray, commentBtns] = questionContainerCreator(
    container, dummydata.questions,
  );

  askBtnControl(ask);

  voteArray.forEach((voteBtns) => {
    voteBtns.forEach(voteControl);
  });

  commentBtns.forEach((commentBtn) => {
    commentBtnControl(commentBtn);
  });
};

const populate = () => {
  dummydata.meetups.forEach((meet) => {
    addMeet(meet);
  });

  dummydata.notifications.forEach((notif) => {
    addNotif(notif);
  });
};

const populateProfile = () => {
  const inputFields = document.getElementsByClassName('profile-input');
  const editBtns = document.getElementsByClassName('profile-edit-button');

  loop.call(inputFields, (elem) => {
    elem.value = dummydata.user[elem.getAttribute('pointer')];
  });

  loop.call(editBtns, (elem) => {
    elem.addEventListener('click', () => {
      const input = document.getElementById(elem.getAttribute('input'));
      input.disabled = elem.classList.contains('active');
      elem.innerHTML = input.disabled ? 'edit' : 'ok';
      elem.classList.toggle('active', !input.disabled);
      if (!input.disabled) input.focus();
    });
  });
};

document.getElementById('profile-picture-input')
  .addEventListener('change', () => {
    const input = document.getElementById('profile-picture-input');
    const img = document.getElementById('profile-picture');
    imageInputControl(null, input, img);
    document.getElementById('profile-icon').src = input.url[0];
  });

populateProfile();

document.querySelector('.profile-button').addEventListener('click', (e) => {
  window.location.href = '../signin';
});

window.addEventListener('load', populate);

window.addEventListener('scroll', scroll);
