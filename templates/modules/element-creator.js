/* eslint-env browser */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

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
  const meetSchema = [
    [
      { div: { class: 'meet-container main-container', id: meetData.id } },
      { p: { class: 'meet-name', text: meetData.title } },
      { div: { class: 'meet-stats' } },
      { div: { class: 'meet-stat date' } },
      { span: { class: 'meet-icon meet-date-icon' } },
      { span: { class: 'meet-stat-text meet-date-text', text: meetData.date } },
      { div: { class: 'meet-stat time' } },
      { span: { class: 'meet-icon meet-time-icon' } },
      { span: { class: 'meet-stat-text meet-time-text', text: meetData.time } },
      { div: { class: 'meet-stat place' } },
      { span: { class: 'meet-icon meet-place-icon' } },
      { span: { class: 'meet-stat-text meet-place-text', text: meetData.location } },
      { div: { class: 'meet-stat questions' } },
      { span: { class: 'question-count', text: `${meetData.questions} Questions` } },
      { div: { class: 'meet-stat pictures' } },
      { span: { class: 'picture-count', text: `${meetData.images.length} Pictures` } },
      { div: { class: 'meet-tags-container' } },
      { div: { class: 'meet-tags-title' } },
      { span: { class: 'meet-tags-title-text', text: 'Tags' } },
      { span: { class: 'tags-icon meet-icon' } },
      { div: { class: 'meet-tags' } },
    ],
    [0, 0, 2, 3, 3, 2, 6, 6, 2, 9, 9, 2, 12, 2, 14, 0, 16, 17, 17, 16],
  ];

  const elements = elementCreator(meetSchema);


  const [main, rsvps, notif] = rsvpNotifCreator([meetData.rsvp, meetData.notif]);
  elements[0].insertBefore(main, elements[2]);

  meetData.tags.forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'meet-tag';
    span.innerHTML = tag;
    elements[20].appendChild(span);
  });

  box.appendChild(elements[0]);
  return [elements[0], rsvps, notif];
};

const notifCreator = (box, data) => {
  const notifData = data;

  const notifSchema = [
    [
      { div: { class: 'main-notif-container main-container' } },
      { p: { class: 'meet-name', text: notifData.title } },
      { div: { class: 'sub-notif-container' } },
      { p: { class: 'notif-message', text: `${notifData.count} new questions` } },
    ],
    [0, 0, 2],
  ];

  const elements = elementCreator(notifSchema);
  box.appendChild(elements[0]);
  return elements[0];
};

const bookCreator = (box, data) => {
  const bookData = data;

  const bookSchema = [
    [
      { div: { class: 'book-container main-container', meetup: bookData.meetup } },
      { p: { class: 'meet-name', text: bookData.title } },
      { div: { class: 'question-feed-container' } },
      { p: { class: 'question-feed-dir collapsed', text: 'expand' } },
      { div: { class: 'question-feed-container1' } },
    ],
    [0, 0, 2, 2],
  ];

  const elements = elementCreator(bookSchema);


  const [container, rsvps, notif] = rsvpNotifCreator(['yes', 'yes']);
  elements[0].insertBefore(container, elements[2]);

  box.appendChild(elements[0]);
  return [elements[0], elements[4], elements[3], rsvps, notif];
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
      { div: { id: 'meet-expanded-questions' } },
      { div: { class: 'question-input-container' } },
      { label: { class: 'question-input-label', for: 'question-input', text: 'Ask a question' } },
      { div: { class: 'question-input-box' } },
      { input: { id: 'question-input', type: 'text' } },
      { button: { id: 'question-input-button', type: 'button', text: 'Ask!' } },
    ],
    [0, 0, 2, 2, 4, 4],
  ];

  const elements = elementCreator(schema);


  const [voteArray, commentBtns] = questionCreator(elements[1], data);

  elements[6].input = elements[5];
  elements[6].box = elements[1];

  box.appendChild(elements[0]);
  return [elements[0], elements[6], voteArray, commentBtns];
};

const questionCreator = (box, data) => {
  const voteArray = [];


  const commentBtns = [];
  data.forEach((quest) => {
    const schema = [
      [
        { div: { class: 'meet-question-details', id: quest.id } },
        { div: { class: 'meet-question-details-1' } },
        { span: { class: 'meet-question-name span-flex', text: quest.body } },
        { span: { class: 'meet-question-author span-flex', text: quest.username } },
        { div: { class: 'meet-question-details-2' } },
        { span: { class: 'question-feed-stat vote-stat flex-left' } },
        { div: { class: 'feed-stat-vote' } },
        { span: { class: 'upvote vote-btn', qObj: quest, action: 1 } },
        { span: { class: 'dnvote vote-btn', qObj: quest, action: -1 } },
        { span: { class: 'vote-count', text: quest.votes } },
        { span: { class: 'meet-question-stat span-flex', text: quest.createdOn } },
        { span: { class: 'comment-control span-flex collapsed', action: quest.id } },
        { span: { class: 'comment-exp', text: 'comments' } },
      ],
      [0, 1, 1, 0, 4, 5, 6, 6, 6, 4, 4, 11],
    ];

    const elems = elementCreator(schema);
    elems[11].container = elems[0];
    voteArray.push([elems[7], elems[8]]);
    elems[11].box = elems[0];
    commentBtns.push(elems[11]);
    box.appendChild(elems[0]);
  });

  return [voteArray, commentBtns];
};

const commentBoxCreator = (box, data) => {
  const boxSchema = [
    [
      { div: { class: 'comment-box-container showing' } },
      { div: { class: 'add-comment-container' } },
      { input: { type: 'text', id: 'add-comment-input' } },
      { button: { type: 'button', id: 'add-comment-button', text: 'comment' } },
    ],
    [0, 1, 1],
  ];

  const elements = elementCreator(boxSchema);


  const replyBtns = [];
  data.forEach(comment => replyBtns.push(commentCreator(elements[0], comment)));
  elements[3].box = elements[0];
  box.classList.add('populated');
  box.comment = elements[0];
  box.appendChild(elements[0]);

  return [elements[3], elements[2], replyBtns];
};

const commentCreator = (box, data) => {
  const schema = [
    [
      { div: { class: 'comment-box' } },
      { div: { class: 'comment-box-details' } },
      { span: { class: 'comment-author', text: data.username } },
      { span: { class: 'comment-timestamp', text: data.createdOn } },
      { div: { class: 'comment-box-text' } },
      { span: { class: 'comment-text', text: data.body } },
      { div: { class: 'comment-options' } },
      {
        button: {
          type: 'button', class: 'comment-reply-button', text: 'reply', author: data.username,
        },
      },
    ],
    [0, 1, 1, 0, 4, 0, 6],
  ];

  const elements = elementCreator(schema);
  box.insertBefore(elements[0], box.lastChild);
  return elements[7];
};

const rsvpNotifCreator = ([rsvp, notif]) => {
  const schema = [
    [
      { div: { class: 'rsvp-notif-container' } },
      { div: { class: 'rsvp-container' } },
      { span: { class: 'rsvp-text', text: 'RSVP' } },
      { span: { class: `rsvp-tag yes${rsvp === 'yes' ? ' active' : ''}`, action: 'yes', text: 'yes' } },
      { span: { class: `rsvp-tag maybe${rsvp === 'maybe' ? ' active' : ''}`, action: 'maybe', text: 'maybe' } },
      { span: { class: `rsvp-tag no${rsvp === 'no' ? ' active' : ''}`, action: 'no', text: 'no' } },
      { div: { class: 'notif-icon-container' } },
      { span: { class: `meet-notif meet-icon${notif === 'yes' ? ' active' : ''}`, action: 'no' } },
    ],
    [0, 1, 1, 1, 1, 0, 6],
  ];
  const elements = elementCreator(schema);
  return [elements[0], [elements[3], elements[4], elements[5]], elements[7]];
};

const imageCreator = (images, box) => {
  const schema = [
    [
      { div: { class: 'meet-image-outer-container' } },
      { span: { class: 'meet-image-control' } },
      { div: { class: 'meet-image-container' } },
      { div: { class: 'meet-image-container2' } },
    ],
    [0, 0, 2],
  ];

  const elements = elementCreator(schema);

  images.forEach((image) => {
    const img = document.createElement('img');
    img.className = 'meet-image';
    img.src = image;
    elements[3].appendChild(img);
  });
  elements[1].boxArray = elements.filter(element => element !== elements[1]);
  box.appendChild(elements[0]);
  return elements[1];
};

export {
  elementCreator,
  meetCreator,
  notifCreator,
  bookCreator,
  questionCreator,
  questionContainerCreator,
  bookQuestionCreator,
  commentBoxCreator,
  commentCreator,
  imageCreator,
};
