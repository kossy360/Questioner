import {
  meetCreator,
  notifCreator,
  bookCreator,
  bookQuestionCreator,
  imageCreator,
  searchCreator,
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
import RsvpControl from '../helpers/rsvpControl.js';
import questions from '../helpers/questions.js';

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

const rsvpControl = (rsvps, box, id, value, meet) => {
  const control = new RsvpControl(rsvps[0], rsvps[1], rsvps[2], id, value, addBook, meet);
  rsvps[0].parentElement.control = control;
  rsvps[0].parentElement.id = `rsvp-${id}`;
  rsvps.forEach((elem) => {
    elem.addEventListener('click', (e) => {
      e.stopPropagation();
      control.newVal(elem.textContent);
      if (!elem.classList.contains('yes')) {
        if (box) box.remove();
      }
    });
  });
};

const tagControl = (tags, exp) => {
  tags.forEach(tag => tag.addEventListener('click', (e) => {
    e.stopPropagation();
    const searchTab = document.getElementById('tab-selector-search');
    if (searchTab.isSameNode(document.querySelector('.tab-active')) && !exp) return;
    searchTab.click();
    getResults(tag.tag);
  }));
};

const addMeet = (data) => {
  const [main, rsvps, notif, tags] = meetCreator(
    document.querySelector('#meets-section'), data,
  );
  main.data = data;
  main.addEventListener('click', () => {
    expandMeet(data);
    swith('meet-expanded', 'section-showing');
  });
  rsvpControl(rsvps, null, data.id, data.rsvp, data);
  notifContol(notif);
  tagControl(tags);
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
  });

  notifContol(notif);
  rsvpControl(rsvps, main, booked.id, booked.rsvp, booked);
};

const addBookQuestions = async (id, box) => {
  try {
    let data = await fetchData.questions(id);
    console.log(data);
    if (typeof data === 'string') {
      box.textContent = 'There are no questions for this meetup';
      data = [];
    }
    data = data.sort((m1, m2) => m1.questions - m2.questions).splice(0, 5);
    const voteCount = bookQuestionCreator(box, data);
    box.classList.add('populated');
    return voteCount;
  } catch (error) {
    throw error;
  }
};

const expandMeet = async (meetData) => {
  const container = document.getElementById('meet-expanded-container');
  while (container.hasChildNodes()) container.removeChild(container.lastChild);
  const [box, rsvps, notif, tags, image] = meetCreator(container, meetData);
  if (meetData.images.length > 1) {
    const imgArray = imageCreator(meetData.images, image);
    imgBtnControl(imgArray);
  }
  rsvpControl(rsvps, null, meetData.id, meetData.rsvp, meetData);
  notifContol(notif);
  tagControl(tags, true);

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
    console.log(meets);
    const upcoming = meets.filter(mt => mt.rsvp === 'yes');
    meets.forEach(meet => addMeet(meet));
    upcoming.forEach(meet => addBook(meet));
    console.log(upcoming);
  } catch (error) {
    console.log(error);
  }
};

const getBooked = async () => {
  try {
    const meets = await fetchData.upcoming();
    console.log(meets);
    meets.forEach(meet => addBook(meet));
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

populateProfile(
  document.getElementsByClassName('profile-input'),
  document.getElementsByClassName('profile-edit-button'),
  profile,
);

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

document.getElementById('search-button').addEventListener('click', () => {
  const input = document.getElementById('search-input').value;
  if (!input) return;
  getResults(input);
});

document.getElementById('profile-picture-input')
  .addEventListener('change', () => {
    const input = document.getElementById('profile-picture-input');
    const img = document.getElementById('profile-picture');
    imageInputControl(null, input, img);
    const [url] = input.url;
    document.getElementById('profile-icon').src = url;
  });

document.querySelector('.profile-button').addEventListener('click', () => {
  window.location.href = '../signin';
});

window.addEventListener('load', populate);
