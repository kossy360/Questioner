import {
  meetCreator,
  notifContainerCreator,
  bookCreator,
  bookQuestionCreator,
  imageCreator,
  searchCreator,
} from '../modules/element-creator.js';
import {
  imgBtnControl,
  notifContol,
  profileControl,
} from '../modules/buttonControllers.js';
import {
  populateProfile,
  updateDp,
} from '../modules/profileControl.js';
import fetchData from '../helpers/fetchData.js';
import RsvpControl from '../helpers/rsvpControl.js';
import questions from '../helpers/questions.js';
import notification from '../helpers/notification.js';
import setHeight from '../helpers/setHeight.js';
import updateStats from '../helpers/updateStats.js';
import confirmAct from '../helpers/confirmAct.js';
import errorHandler from '../helpers/errorHandler.js';

const profile = JSON.parse(window.sessionStorage.getItem('user'));
const dps = [document.getElementById('profile-picture'), document.getElementById('profile-icon')];
// if (!profile) window.location.href = '/Quetioner/UI';

const loop = Array.prototype.forEach;

(async () => {
  if (profile.displaypicture) {
    dps.forEach((dp) => {
      dp.src = profile.displaypicture;
    });
  }
})();

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
  const control = new RsvpControl(rsvps[0], rsvps[1], rsvps[2], id, value, addBook, meet, box);
  rsvps[0].parentElement.control = control;
  rsvps[0].parentElement.id = `rsvp-${id}`;
  rsvps.forEach((elem) => {
    elem.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (box) {
        const decision = await confirmAct(
          'Change Response',
          'Are you sure you want to continue',
        );
        if (!decision) return;
      }
      control.newVal(elem.textContent);
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
  });
  rsvpControl(rsvps, null, data.id, data.rsvp, data);
  notifContol(notif, data.id);
  tagControl(tags);
};

const addBook = (booked) => {
  const container = document.getElementById('booked-section');
  const [main, qbox, btn, rsvps, notif] = bookCreator(container, booked);

  setHeight(qbox, true);
  btn.addEventListener('click', async () => {
    if (btn.classList.contains('collapsed')) {
      if (!qbox.classList.contains('populated')) {
        await addBookQuestions(main.meetup, qbox);
      }
      btn.classList.replace('collapsed', 'expanded');
      qbox.classList.add('showing');
      setHeight(qbox, false);
    } else {
      btn.classList.replace('expanded', 'collapsed');
      qbox.classList.remove('showing');
      setHeight(qbox, true);
    }
  });

  notifContol(notif, booked.id);
  rsvpControl(rsvps, main, booked.id, booked.rsvp, booked);
};

const addBookQuestions = async (id, box) => {
  try {
    let data = await fetchData.questions(id);
    if (typeof data === 'string') {
      box.innerHTML = '<span class="book-error">There are no questions for this meetup<span>';
      data = [];
    }
    data = data.sort((m1, m2) => m1.questions - m2.questions).splice(0, 5);
    const voteCount = bookQuestionCreator(box, data);
    box.classList.add('populated');
    return voteCount;
  } catch (error) {
    errorHandler(error);
  }
  return 0;
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
  notifContol(notif, meetData.id);
  tagControl(tags, true);

  try {
    const profiles = await questions.get(meetData.id, box);
    profileControl(profiles, swith);
  } catch (error) {
    errorHandler(error);
  }

  swith('meet-expanded', 'section-showing');
  return true;
};

const populateMeet = async () => {
  try {
    const meets = await fetchData.meetups();
    const upcoming = meets.filter(mt => mt.rsvp === 'yes');
    meets.forEach(meet => addMeet(meet));
    upcoming.forEach(meet => addBook(meet));
  } catch (error) {
    errorHandler(error);
  }
};

const populateNotif = async () => {
  try {
    let data = await fetchData.notifications();
    data = typeof data === 'string' ? [] : data;
    const elements = notifContainerCreator(document.querySelector('#notif-section'), data);
    elements.forEach((elem) => {
      const [container, notifBtn, expBtn, count, quest] = elem;
      count.textContent = `${quest.length} new question${quest.length > 1 ? 's' : ''}`;
      notification(container, quest, expBtn, expandMeet);
      notifContol(notifBtn);
    });
  } catch (error) {
    errorHandler(error);
  }
};

const populate = () => {
  populateMeet();
  populateNotif();
  updateStats();
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
    errorHandler(error);
  }
};

document.getElementById('search-button').addEventListener('click', () => {
  const input = document.getElementById('search-input').value;
  if (!input) return;
  getResults(input);
});

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
