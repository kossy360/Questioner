/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/extensions */
/* eslint-env browser */
import {
  elementCreator,
} from './element-creator.js';

const adminMeetCreator = (box, data, replaceBox) => {
  const meetData = data;
  const meetSchema = [
    [
      { div: { class: 'meet-container main-container', id: meetData.id } },
      { div: { class: 'meet-head-container' } },
      { p: { class: 'meet-name', text: meetData.title } },
      { div: { class: 'meet-control-container' } },
      { button: { class: 'meet-control-btn meet-edit-btn', type: 'button', text: 'edit' } },
      { button: { class: 'meet-control-btn meet-cancel-btn', type: 'button', text: 'delete' } },
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
    [0, 1, 1, 3, 3, 0, 6, 7, 7, 6, 10, 10, 6, 13, 13, 6, 16, 6, 18, 0, 20, 21, 21, 20],
  ];

  const elements = elementCreator(meetSchema);


  const main = rsvpNotifCreator(meetData.rsvp);
  elements[0].data = data;
  elements[0].insertBefore(main, elements[6]);

  meetData.tags.forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'meet-tag';
    span.innerHTML = tag;
    elements[24].appendChild(span);
  });

  if (replaceBox) box.replaceChild(elements[0], replaceBox);
  else box.appendChild(elements[0]);
  return [elements[0], elements[4], elements[5]];
};

const rsvpNotifCreator = ({ yes, maybe, no }) => {
  const schema = [
    [
      { div: { class: 'rsvp-container' } },
      { span: { class: 'rsvp-text', text: 'RSVPs:' } },
      { span: { class: 'rsvp-tag yes active', action: 'yes', text: 'yes' } },
      { span: { class: 'rsvp-tag-count yes', text: yes } },
      { span: { class: 'rsvp-tag maybe active', action: 'maybe', text: 'maybe' } },
      { span: { class: 'rsvp-tag-count maybe', text: maybe } },
      { span: { class: 'rsvp-tag no active', action: 'no', text: 'no' } },
      { span: { class: 'rsvp-tag-count no', text: no } },
    ],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  const elements = elementCreator(schema);
  return elements[0];
};

/* const commentBoxCreator = (box, data) => {
  const boxSchema = [
    [
      { div: { class: 'comment-box-container showing' } },
      { div: { class: 'comment-box-container2' } },
      { div: { class: 'comment-box-container3' } },
      { div: { class: 'add-comment-container' } },
      { input: { type: 'text', id: 'add-comment-input' } },
      { button: { type: 'button', id: 'add-comment-button', text: 'comment' } },
    ],
    [0, 1, 0, 3, 3],
  ];

  const elements = elementCreator(boxSchema);


  const replyBtns = [];
  data.forEach(comment => replyBtns.push(commentCreator(elements[2], comment)));
  elements[5].box = elements[2];
  box.classList.add('populated');
  box.comment = elements[0];
  box.appendChild(elements[0]);

  return [elements[5], elements[4], replyBtns];
}; */

export default adminMeetCreator;
