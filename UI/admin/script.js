import {
  notifContainerCreator,
  imageCreator,
  searchCreator,
} from '../modules/element-creator.js';

import { imgBtnControl, notifContol } from '../modules/buttonControllers.js';
import meetCreator from '../modules/element-creator-admin.js';
import Tag from '../modules/add-tag.js';
import DatePicker from '../modules/DatePicker.js';
import timeControl from '../helpers/timeControl.js';
import { imageInputControl } from '../modules/imageControl.js';
import {
  populateProfile,
  updateDp,
} from '../modules/profileControl.js';
import fetchData from '../helpers/fetchData.js';
import createForm from '../helpers/createForm.js';
import questions from '../helpers/questions.js';
import notification from '../helpers/notification.js';
import updateStats from '../helpers/updateStats.js';

const tabSelector = document.getElementsByClassName('tab-selector');
const profile = JSON.parse(window.sessionStorage.getItem('user'));
const dps = [document.getElementById('profile-picture'), document.getElementById('profile-icon')];
const loop = Array.prototype.forEach;

(async () => {
  if (profile.displaypicture) {
    dps.forEach((dp) => {
      dp.src = profile.displaypicture;
    });
  }
})();

const tag = new Tag(
  document.querySelector('.tag-edit-container'),
  document.querySelector('#meet-tags-input'),
);

const datePicker = new DatePicker(
  document.getElementById('meet-date-input'),
  document.getElementById('meet-date-container'),
);

timeControl(document.getElementById('meet-time-input'), datePicker);

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

const mergeObj = (newObj, oldObj) => {
  Object.keys(oldObj).forEach((key) => {
    if (!newObj[key]) newObj[key] = oldObj[key];
  });
  return newObj;
};

const mergeTime = (obj) => {
  const { time, date } = obj;
  obj.happening = `${date}T${time}+01:00`;
  delete obj.time;
  delete obj.date;
};

loop.call(
  document.getElementsByClassName('meet-create-input'),
  (elem) => {
    if (elem.id !== 'meet-time-input') {
      elem.addEventListener('blur', () => {
        elem.classList.toggle('invalid',
          elem[elem.tagName === 'INPUT' ? 'value' : 'textContent'] === '');
      });

      elem.addEventListener('input', () => {
        elem.classList.remove('invalid');
      });
    }
  },
);

tabControl('tab-selector', 'section-showing');

tabControl('result-tab', 'result-container-showing');

loop.call(document.getElementsByClassName('create-button'), (button) => {
  const { id } = button;
  if (id === 'meet-create-button') {
    button.addEventListener('click', () => {
      createMeet();
    });
  } else if (id === 'meet-create-edit') {
    button.addEventListener('click', () => {
      updateMeet(button.getAttribute('meet-id'));
    });
  } else {
    button.addEventListener('click', () => {
      clearInputs();
      tabSelector[0].click();
      updateMeet();
    });
  }
});

const toggleOrganizer = (title) => {
  const head = document.querySelector('.organizer-header');
  const container = document.querySelector('.meet-create-button-container');
  head.innerHTML = title || 'New Meet';
  container.classList.toggle('edit', !!title);
};

const populateEdit = (data) => {
  const container = document.querySelector('.meet-selected-container');
  const inputFields = document.getElementsByClassName('meet-create-input');
  loop.call(inputFields, (input) => {
    const pointer = input.getAttribute('pointer');
    switch (pointer) {
      case 'tags':
        tag.clear();
        tag.populate(data[pointer]);
        break;
      case 'images':
        imageInputControl(container, input, null, 1, data[pointer]);
        break;
      case 'date':
        datePicker.clear().display(data.happening);
        break;
      case 'topic':
        input.textContent = data[pointer];
        break;
      default:
        input.value = data[pointer];
        break;
    }
  });
};

document.getElementById('meet-picture-input')
  .addEventListener('change', () => {
    const container = document.querySelector('.meet-selected-container');
    const input = document.getElementById('meet-picture-input');
    imageInputControl(container, input, null);
  });

const getData = (inputClass) => {
  const inputFields = document.getElementsByClassName(inputClass);
  const obj = {};
  loop.call(inputFields, (input) => {
    const pointer = input.getAttribute('pointer');
    switch (pointer) {
      case 'tags':
        if (tag.getTag()) obj[pointer] = tag.getTag();
        tag.clear();
        break;
      case 'images':
        if (input.images) obj[pointer] = input.images;
        break;
      case 'date':
        obj[pointer] = datePicker.dateObj.iso;
        break;
      case 'topic':
        obj[pointer] = input.textContent;
        break;
      default:
        obj[pointer] = input.value;
        break;
    }
  });
  return obj;
};

const editMeet = (data) => {
  toggleOrganizer(data.topic);
  populateEdit(data);
  document.getElementById('meet-create-edit').setAttribute('meet-id', data.id);
  tabSelector[2].click();
};

const updateMeet = async (id) => {
  if (id) {
    const obj = getData('meet-create-input');
    mergeTime(obj);
    const body = createForm(obj);
    try {
      const [data] = await fetchData.updateMeet(body, id);
      addMeet(data, true);
    } catch (error) {
      console.log(error);
      return;
    }
  }
  // send patch request
  tabSelector[0].click();
  toggleOrganizer();
};

const tagControl = (tags) => {
  tags.forEach(tg => tg.addEventListener('click', (e) => {
    e.stopPropagation();
    const searchTab = document.getElementById('tab-selector-search');
    if (searchTab.isSameNode(document.querySelector('.tab-active'))) return;
    searchTab.click();
    getResults(tg.tag);
  }));
};


const createMeet = async () => {
  const obj = getData('meet-create-input');
  if (!obj) return;
  mergeTime(obj);
  const body = createForm(obj);
  // send post request
  try {
    const [data] = await fetchData.createMeet(body);
    addMeet(data);
    tabSelector[0].click();
    clearInputs();
  } catch (error) {
    console.log(error);
  }
};

const deleteMeet = async (id) => {
  try {
    await fetchData.deleteMeetup(id);
    loop.call(document.getElementsByClassName('meet-container'), (elem) => {
      if (elem.id === id.toString()) {
        elem.remove();
      }
    });
    tabSelector[0].click();
  } catch (error) {
    console.log(error);
  }
};

const clearInputs = () => {
  loop.call(document.getElementsByClassName('meet-create-input'), (input) => {
    const pointer = input.getAttribute('pointer');
    switch (pointer) {
      case 'tags':
        tag.clear();
        break;
      case 'images':
        input.images = [];
        break;
      case 'date':
        datePicker.display(new Date().toLocaleDateString());
        break;
      case 'topic':
        input.textContent = '';
        break;
      default:
        input.value = '';
        break;
    }
  });
};

const meetControl = (data, edit, cancel) => {
  edit.addEventListener('click', (e) => {
    e.stopPropagation();
    editMeet(data);
  });

  cancel.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteMeet(data.id);
  });
};

const addMeet = (data, replace = false) => {
  const container = replace ? Array.prototype
    .find.call(
      document.getElementsByClassName('meet-container'),
      meet => Number(meet.id) === data.id,
    ) : null;
  if (replace) mergeObj(data, container.data);
  const [main, edit, deleteM, tags] = meetCreator(
    document.querySelector('#meets-section'), data, container,
  );
  main.addEventListener('click', () => {
    expandMeet(data);
    swith('meet-expanded', 'section-showing');
  });

  tagControl(tags);
  meetControl(data, edit, deleteM);
};

const expandMeet = async (meetData) => {
  const container = document.getElementById('meet-expanded-container');
  while (container.hasChildNodes()) container.removeChild(container.lastChild);
  const [box, edit, cancel, tags, image] = meetCreator(container, meetData);
  if (meetData.images.length > 1) {
    const imgArray = imageCreator(meetData.images, image);
    imgBtnControl(imgArray);
  }
  tagControl(tags);
  meetControl(meetData, edit, cancel);

  try {
    const profiles = await questions.get(meetData.id, box);
    profiles.forEach(((profilee) => {
      profilee.forEach(elem => elem.addEventListener('click', () => {
        swith('user-profile', 'section-showing');
      }));
    }));
  } catch (error) {
    console.log(error);
  }
};

const populateMeet = async () => {
  try {
    const meets = await fetchData.meetups();
    meets.forEach(meet => addMeet(meet));
  } catch (error) {
    console.log(error);
  }
};

const populateNotif = async () => {
  try {
    let data = await fetchData.notifications();
    console.log(data);
    data = typeof data === 'string' ? [] : data;
    const elements = notifContainerCreator(document.querySelector('#notif-section'), data);
    elements.forEach((elem) => {
      const [container, notifBtn, expBtn, count, quest] = elem;
      count.textContent = `${quest.length} new question${quest.length > 1 ? 's' : ''}`;
      notification(container, quest, expBtn, expandMeet);
      notifContol(notifBtn);
    });
  } catch (error) {
    console.log(error);
  }
};

const populate = () => {
  populateMeet();
  populateNotif();
  updateStats();
};

const populateSearch = ({ tags, topic }) => {
  const populate1 = (obj, container, type) => {
    if (!obj.result) container.textContent = 'No meetups found';
    else {
      while (container.hasChildNodes()) container.removeChild(container.lastChild);
      obj.result.forEach((val) => {
        const [box, tp, tgs] = searchCreator(container, val);
        box.addEventListener('click', () => {
          expandMeet(val);
          swith('meet-expanded', 'section-showing');
        });
        tagControl(tgs);
        if (type === 'tag') {
          tgs.forEach((tg) => {
            if (tags.value.includes(tg.tag)) tg.classList.add('highlighted');
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

populateProfile(
  document.getElementsByClassName('profile-input'),
  document.getElementsByClassName('profile-edit-button'),
  profile,
);

document.getElementById('profile-picture-input')
  .addEventListener('change', (e) => {
    const input = e.target;
    // imageInputControl(null, input, img);
    // const [url] = input.url;
    updateDp([input.files[0]], dps);
  });

document.querySelector('.profile-button').addEventListener('click', () => {
  window.location.href = '../signin';
});

window.addEventListener('load', populate);
