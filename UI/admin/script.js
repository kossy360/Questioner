/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
/* eslint-env browser */
import {
  notifCreator,
  imageCreator,
  searchCreator,
} from '../modules/element-creator.js';

import { imgBtnControl } from '../modules/buttonControllers.js';
import meetCreator from '../modules/element-creator-admin.js';
import dummydata from './modules/dummy-data.js';
import ReadForm from '../modules/formProfileReader.js';
import Tag from '../modules/add-tag.js';
import { createQuestions } from '../modules/pagecontrol.js';
import { imageInputControl } from '../modules/imageControl.js';
import { populateProfile } from '../modules/profileControl.js';
import fetchData from '../helpers/fetchData.js';

const tabSelector = document.getElementsByClassName('tab-selector');

const loop = Array.prototype.forEach;
const tag = new Tag(
  document.querySelector('.tag-edit-container'),
  document.querySelector('#meet-tags-input'),
);
tag.initialize();

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

const tagControl = (tags) => {
  tags.forEach(tag => tag.addEventListener('click', (e) => {
    e.stopPropagation();
    const searchTab = document.getElementById('tab-selector-search');
    if (searchTab.isSameNode(document.querySelector('.tab-active'))) return;
    searchTab.click();
    getResults(tag.tag);
  }));
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
  const [main, edit, cancel, tags] = meetCreator(
    document.querySelector('#meets-section'), data, container,
  );
  main.addEventListener('click', () => {
    expandMeet(data);
    swith('meet-expanded', 'section-showing');
  });

  tagControl(tags);
  meetControl(main, edit, cancel);
};

const addNotif = (data) => {
  notifCreator(document.querySelector('#notif-section'), data);
};

const expandMeet = (meetData) => {
  const container = document.getElementById('meet-expanded-container');
  while (container.hasChildNodes()) container.removeChild(container.lastChild);
  const [box, edit, cancel, tags, image] = meetCreator(container, meetData);
  if (meetData.images.length > 1) {
    const imgArray = imageCreator(meetData.images, image);
    imgBtnControl(imgArray);
  }
  tagControl(tags);
  meetControl(box, edit, cancel);
  const profiles = createQuestions(box, dummydata.questions);

  profiles.forEach(((profilee) => {
    profilee.forEach(elem => elem.addEventListener('click', () => {
      swith('user-profile', 'section-showing');
    }));
  }));
};

const populateMeet = async () => {
  try {
    const meets = await fetchData.meetups();
    console.log(meets);
    meets.forEach(meet => addMeet(meet));
  } catch (error) {
    console.log(error);
  }
};

const populate = () => {
  populateMeet();

  dummydata.notifications.forEach((notif) => {
    addNotif(notif);
  });
};

const populateSearch = ({ tags, topic }) => {
  const populate1 = (obj, container, type) => {
    if (!obj.result) container.textContent = 'No meetups found';
    else {
      while (container.hasChildNodes()) container.removeChild(container.lastChild);
      obj.result.forEach((val) => {
        const [box, tp, tg] = searchCreator(container, val);
        box.addEventListener('click', () => {
          expandMeet(val);
          swith('meet-expanded', 'section-showing');
        });
        tagControl(tg);
        if (type === 'tag') {
          tg.forEach((tag) => {
            if (tags.value.includes(tag.tag)) tag.classList.add('highlighted');
          });
        } else {
          const regex = new RegExp(`(${topic.value})`, 'g');
          console.log(tp.innerHTML);
          tp.innerHTML = tp.innerHTML.replace(regex,
            '<span class="search-result">$1</span>');
        }
      });
    }
  };
  populate1(tags, document.getElementById('result-container-tag'), 'tag');
  populate1(topic, document.getElementById('result-container-topic'), 'topic');
};

const getResults = async (value) => {
  const topic = value.trim().replace(/ +/g, ' ');
  const tags = topic.split(' ');
  document.getElementById('search-input').value = topic;
  try {
    const [result] = await fetchData.search({ topic, tags });
    populateSearch(result);
  } catch (error) {
    console.log(error);
  }
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
