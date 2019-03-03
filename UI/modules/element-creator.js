/* eslint-disable object-curly-newline */
/* eslint-disable prefer-destructuring */

import Slide from './slide.js';
import {
  convertTime,
  fancyTime,
} from '../helpers/convertTime.js';

/**
 *creates a html component based on an inputed
  element schema containing a tag array and a tree
 * @param {array} schema [tagArray, tree] => component schema
 * @returns {array}an array of all elements contained in the component in the order in
  which they were created
 */
const elementCreator = ([tagArray, tree]) => {
  const elements = [];
  tagArray.forEach((elem) => {
    const tag = Object.keys(elem)[0];

    const element = document.createElement(tag);

    const attribute = Object.keys(elem[tag]);
    attribute.forEach((attr) => {
      if (attr === 'class') element.className = elem[tag][attr];
      else if (attr === 'text') element.innerHTML = elem[tag][attr];
      else element[attr] = elem[tag][attr];
    });
    elements.push(element);
  });

  tree.forEach((pos, index) => {
    elements[pos].appendChild(elements[index + 1]);
  });
  return elements;
};

const meetCreator = (box, data) => {
  const meetData = data;
  const { time, date } = convertTime(data.happening);
  const meetSchema = [
    [
      { div: { class: 'meet-container main-container', id: meetData.id } },
      { p: { class: 'meet-name big', text: meetData.topic } },
      { img: { class: 'meet-image', src: meetData.images[0] || '../assets/meeting1.jpg' } },
      { div: { class: 'meet-stats' } },
      { div: { class: 'meet-stat date' } },
      { span: { class: 'meet-icon meet-date-icon' } },
      { span: { class: 'meet-stat-text meet-date-text', text: date } },
      { div: { class: 'meet-stat time' } },
      { span: { class: 'meet-icon meet-time-icon' } },
      { span: { class: 'meet-stat-text meet-time-text', text: time } },
      { div: { class: 'meet-stat place' } },
      { span: { class: 'meet-icon meet-place-icon' } },
      { span: { class: 'meet-stat-text meet-place-text', text: meetData.location } },
      { div: { class: 'meet-stat questions' } },
      { span: { class: 'question-count', text: `${meetData.questions} Question${meetData.questions === 1 ? '' : 's'}` } },
      { div: { class: 'meet-stat pictures' } },
      { span: { class: 'picture-count', text: `${meetData.images.length} Picture${meetData.images.length === 1 ? '' : 's'}` } },
      { div: { class: 'meet-tags-container' } },
      { div: { class: 'meet-tags-title' } },
      { span: { class: 'meet-tags-title-text', text: 'Tags' } },
      { span: { class: 'tags-icon meet-icon' } },
      { div: { class: `meet-tags ${data.tags.length > 0 ? 'populated' : ''}` } },
    ],
    [0, 0, 0, 3, 4, 4, 3, 7, 7, 3, 10, 10, 3, 13, 3, 15, 0, 17, 18, 18, 17],
  ];

  const elements = elementCreator(meetSchema);

  const [main, rsvps, notif] = rsvpNotifCreator([meetData.rsvp, meetData.notification]);
  elements[0].insertBefore(main, elements[3]);

  const tags = [];

  meetData.tags.forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'meet-tag';
    span.innerHTML = tag;
    span.tag = tag;
    tags.push(span);
    elements[21].appendChild(span);
  });

  box.appendChild(elements[0]);
  return [elements[0], rsvps, notif, tags, elements[2]];
};

const notifContainerCreator = (box, data) => {
  const schema = [
    [
      { div: { class: 'main-notif-container main-container' } },
      { p: { class: 'meet-name small' } },
      { div: { class: 'notif-stat-container' } },
      { span: { class: 'notif-question-count' } },
      { div: { class: 'notif-icon-container' } },
      { span: { class: 'meet-notif meet-icon active yes', action: 'no' } },
      { span: { class: 'question-feed-dir comment-control collapsed' } },
      { span: { class: 'comment-exp', text: 'new questions' } },
      { div: { class: 'sub-notif-container' } },
    ],
    [0, 0, 2, 2, 4, 0, 6, 0],
  ];

  const notifObj = {};

  data.forEach((notif) => {
    if (notifObj[notif.meetup]) {
      const container = notifObj[notif.meetup][5];
      const notifBox = notifCreator(container, notif);
      notifObj[notif.meetup][4].push(notifBox);
    } else {
      const elements = elementCreator(schema);
      elements[0].meetup = notif.meetup;
      elements[1].textContent = notif.topic;
      elements[6].qbox = elements[8];
      const notifBox = notifCreator(elements[8], notif);
      notifObj[notif.meetup] = [
        elements[0], elements[5], elements[6], elements[3], [notifBox], elements[8]];
      box.appendChild(elements[0]);
    }
  });

  return Object.keys(notifObj).map(elem => notifObj[elem]);
};

const notifCreator = (box, data) => {
  const notifSchema = [
    [
      { div: { class: 'sub-notif-container2' } },
      { div: { class: 'notif-question' } },
      { span: { class: 'notif-question-body', text: `${data.body}` } },
      { span: { class: 'notif-question-user', text: `${data.username}` } },
      { span: { class: 'notif-question-votes', text: `${data.votes}` } },
    ],
    [0, 1, 1, 1],
  ];

  const elements = elementCreator(notifSchema);
  elements[0].data = data;
  box.appendChild(elements[0]);
  return elements[0];
};

const bookCreator = (box, data) => {
  const bookData = data;

  const bookSchema = [
    [
      { div: { class: 'book-container main-container', meetup: bookData.id } },
      { p: { class: 'meet-name small', text: bookData.topic } },
      { div: { class: 'question-feed-container' } },
      { span: { class: 'question-feed-dir comment-control collapsed' } },
      { span: { class: 'comment-exp', text: 'top questions' } },
      { div: { class: 'question-feed-container1' } },
    ],
    [0, 0, 2, 3, 2],
  ];

  const elements = elementCreator(bookSchema);

  const [container, rsvps, notif] = rsvpNotifCreator(['yes', data.notification]);
  elements[0].insertBefore(container, elements[2]);

  box.appendChild(elements[0]);
  return [elements[0], elements[5], elements[3], rsvps, notif];
};

const bookQuestionCreator = (box, data) => {
  const voteCount = [];
  data.forEach((ques) => {
    const schema = [
      [
        { div: { class: 'question-feed-container2' } },
        { span: { class: 'question-feed-text', text: ques.body } },
        { span: { class: 'question-feed-votes', text: ques.votes } },
      ],
      [0, 0],
    ];
    const sub = elementCreator(schema);
    voteCount.push(sub[2]);
    box.appendChild(sub[0]);
  });
  return voteCount;
};

const questionContainerCreator = (box, data) => {
  const schema = [
    [
      { div: { class: 'meet-expanded-details' } },
      { div: { class: 'meet-expanded-questions' } },
      { div: { class: 'question-input-container' } },
      { label: { class: 'question-input-label', for: 'question-input', text: 'Ask a question' } },
      { div: { class: 'question-input-box' } },
      { input: { id: 'question-input', type: 'text', placeholder: 'question here...' } },
      { button: { id: 'question-input-button', type: 'button', text: 'Ask!', meetup: data.id } },
    ],
    [0, 0, 2, 2, 4, 4],
  ];

  const elements = elementCreator(schema);
  const [voteArray, commentBtns, profiles] = questionCreator(elements[1], data);

  elements[6].input = elements[5];
  elements[6].box = elements[1];

  box.appendChild(elements[0]);
  return [elements[0], elements[6], voteArray, commentBtns, profiles];
};

const questionCreator = (box, data) => {
  const voteArray = [];
  const commentBtns = [];
  const profiles = [];
  data.forEach((quest) => {
    const schema = [
      [
        { div: { class: 'meet-question-details', id: quest.id } },
        { div: { class: 'meet-question-details-1' } },
        { span: { class: 'meet-question-name span-flex' } },
        { span: { class: 'question-author', user: quest.createdBy, text: quest.username } },
        { div: { class: 'meet-question-details-2' } },
        { img: { class: 'user-dp-small question-dp', src: quest.displaypicture || '../assets/profile.svg', user: quest.createdBy } },
        { div: { class: 'feed-stat-vote' } },
        { span: { class: `upvote vote-btn ${quest.response > 0 ? 'active' : ''}`, qObj: quest, action: 'upvote' } },
        { span: { class: 'vote-count', id: `vote-count-${quest.id}`, text: quest.votes } },
        { span: { class: `dnvote vote-btn ${quest.response < 0 ? 'active' : ''}`, qObj: quest, action: 'downvote' } },
        { span: { class: 'meet-question-stat span-flex', text: fancyTime(quest.created) } },
        { span: { class: 'comment-control span-flex collapsed', action: quest.id } },
        { span: { class: 'comment-exp', text: 'comments' } },
      ],
      [0, 1, 2, 0, 0, 0, 6, 6, 6, 4, 4, 11],
    ];

    const elems = elementCreator(schema);
    elems[3].insertAdjacentHTML('afterend', quest.body);
    elems[11].container = elems[0];
    voteArray.push([elems[7], elems[9]]);
    profiles.push([elems[5], elems[3]]);
    elems[11].box = elems[0];
    commentBtns.push(elems[11]);
    box.appendChild(elems[0]);
  });

  return [voteArray, commentBtns, profiles];
};

const commentBoxCreator = (box, data) => {
  const boxSchema = [
    [
      { div: { class: 'comment-box-container showing' } },
      { div: { class: 'comment-box-container2' } },
      { div: { class: 'add-comment-container' } },
      { input: { type: 'text', id: 'add-comment-input', placeholder: 'Add comment...' } },
      { button: { type: 'button', id: 'add-comment-button', text: 'comment' } },
    ],
    [0, 0, 2, 2],
  ];
  const elements = elementCreator(boxSchema);
  const profiles = [];
  data.forEach(comment => profiles.push(commentCreator(elements[1], comment)));
  elements[4].box = elements[1];
  elements[4].container = box;
  box.commentContainer = elements[0];
  box.appendChild(elements[0]);

  return [elements[4], elements[3], profiles];
};

const commentCreator = (box, data) => {
  const schema = [
    [
      { div: { class: 'comment-box' } },
      { img: { class: 'user-dp-small comment-dp', src: data.displaypicture || '../assets/profile.svg' } },
      { div: { class: 'comment-box-text' } },
      { span: { class: 'comment-text' } },
      { span: { class: 'comment-author', text: data.username } },
      { div: { class: 'comment-options' } },
      { span: { class: 'comment-timestamp', text: fancyTime(data.created) } },
    ],
    [0, 0, 2, 3, 0, 5],
  ];
  const elements = elementCreator(schema);
  elements[4].insertAdjacentText('afterend', data.comment);
  box.appendChild(elements[0]);

  return [elements[1], elements[4]];
};

const rsvpNotifCreator = ([rsvp, notif]) => {
  const schema = [
    [
      { div: { class: 'rsvp-notif-container' } },
      { div: { class: 'rsvp-container' } },
      { span: { class: 'rsvp-text', text: 'RSVP' } },
      { span: { class: `rsvp-tag yes ${rsvp === 'yes' ? 'active' : ''}`, action: 'yes', text: 'yes' } },
      { span: { class: `rsvp-tag maybe ${rsvp === 'maybe' ? 'active' : ''}`, action: 'maybe', text: 'maybe' } },
      { span: { class: `rsvp-tag no ${rsvp === 'no' ? 'active' : ''}`, action: 'no', text: 'no' } },
      { div: { class: 'notif-icon-container' } },
      { span: { class: `meet-notif meet-icon ${notif ? 'yes' : 'no'}`, action: 'no' } },
    ],
    [0, 1, 1, 1, 1, 0, 6],
  ];
  const elements = elementCreator(schema);

  return [elements[0], [elements[3], elements[4], elements[5]], elements[7]];
};

const imageCreator = (images, box) => {
  const schema = [
    [
      { div: { class: 'meet-image-window' } },
      { div: { class: 'meet-image-strip' } },
      { div: { class: 'meet-image-navigator' } },
      { div: { class: 'meet-image-nav left', action: 0 } },
      { div: { class: 'meet-image-nav right', action: 1 } },
      { div: { class: 'meet-image-tabs' } },
    ],
    [0, 0, 2, 2, 0],
  ];

  const elements = elementCreator(schema);
  const navArray = [];

  images.forEach((image, index) => {
    const img = document.createElement('img');
    const nav = document.createElement('span');
    img.className = 'meet-image';
    img.src = image;
    nav.className = 'image-nav';
    nav.tab = index;
    elements[1].appendChild(img);
    elements[5].appendChild(nav);
    navArray.push(nav);
  });

  const callback = (num) => {
    navArray.forEach((elem) => {
      elem.classList.toggle('selected', elem.tab === num);
    });
  };

  const slide = new Slide(elements[0], elements[1], images.length - 1, 300, callback);
  box.parentElement.replaceChild(elements[0], box);
  return [elements[3], elements[4], navArray, slide];
};

const searchCreator = (box, data) => {
  const searchData = data;
  const { time, date } = convertTime(data.happening);
  const searchSchema = [
    [
      { div: { class: 'result-box', id: searchData.id } },
      { p: { class: 'meet-name', text: searchData.topic } },
      { div: { class: 'meet-stats' } },
      { div: { class: 'meet-stat date' } },
      { span: { class: 'meet-icon meet-date-icon' } },
      { span: { class: 'meet-stat-text meet-date-text', text: date } },
      { div: { class: 'meet-stat time' } },
      { span: { class: 'meet-icon meet-time-icon' } },
      { span: { class: 'meet-stat-text meet-time-text', text: time } },
      { div: { class: 'meet-stat place' } },
      { span: { class: 'meet-icon meet-place-icon' } },
      { span: { class: 'meet-stat-text meet-place-text', text: searchData.location } },
      { div: { class: 'meet-tags-container' } },
      { div: { class: `meet-tags ${data.tags.length > 0 ? 'populated' : ''}` } },
    ],
    [0, 0, 2, 3, 3, 2, 6, 6, 2, 9, 9, 0, 12],
  ];

  const elements = elementCreator(searchSchema);
  const tags = [];

  searchData.tags.forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'meet-tag';
    span.innerHTML = tag;
    span.tag = tag;
    tags.push(span);
    elements[13].appendChild(span);
  });

  box.appendChild(elements[0]);
  return [elements[0], elements[1], tags];
};

export {
  elementCreator,
  meetCreator,
  notifContainerCreator,
  notifCreator,
  bookCreator,
  questionCreator,
  questionContainerCreator,
  bookQuestionCreator,
  commentBoxCreator,
  commentCreator,
  imageCreator,
  searchCreator,
};
