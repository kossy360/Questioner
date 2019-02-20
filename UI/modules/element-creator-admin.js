import {
  elementCreator,
} from './element-creator.js';

import { convertTime } from '../helpers/convertTime.js';

const adminMeetCreator = (box, data, replaceBox = null) => {
  const meetData = data;
  const { time, date } = convertTime(data.happening);
  meetData.time = time;
  meetData.date = date;
  const meetSchema = [
    [
      { div: { class: 'meet-container main-container', id: meetData.id } },
      { div: { class: 'meet-control-container' } },
      { button: { class: 'meet-control-btn meet-edit-btn', type: 'button', text: 'edit' } },
      { button: { class: 'meet-control-btn meet-cancel-btn', type: 'button', text: 'delete' } },
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
    [0, 1, 1, 0, 0, 0, 6, 7, 7, 6, 10, 10, 6, 13, 13, 6, 16, 6, 18, 0, 20, 21, 21, 20],
  ];

  const elements = elementCreator(meetSchema);


  const main = rsvpNotifCreator(meetData.rsvp);
  elements[0].data = data;
  elements[0].insertBefore(main, elements[6]);

  const tags = [];

  meetData.tags.forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'meet-tag';
    span.innerHTML = tag;
    span.tag = tag;
    tags.push(span);
    elements[24].appendChild(span);
  });

  if (replaceBox) box.replaceChild(elements[0], replaceBox);
  else box.appendChild(elements[0]);
  return [elements[0], elements[2], elements[3], tags, elements[5]];
};

const rsvpNotifCreator = ({ yes, maybe, no }) => {
  const schema = [
    [
      { div: { class: 'rsvp-container' } },
      { span: { class: 'rsvp-text', text: 'RSVPs:' } },
      { span: { class: 'rsvp-tag yes active admin', action: 'yes', text: 'yes' } },
      { span: { class: 'rsvp-tag-count yes', text: yes } },
      { span: { class: 'rsvp-tag maybe active admin', action: 'maybe', text: 'maybe' } },
      { span: { class: 'rsvp-tag-count maybe', text: maybe } },
      { span: { class: 'rsvp-tag no active admin', action: 'no', text: 'no' } },
      { span: { class: 'rsvp-tag-count no', text: no } },
    ],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  const elements = elementCreator(schema);
  return elements[0];
};

export default adminMeetCreator;
