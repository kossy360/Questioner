/* eslint-disable prefer-destructuring */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
/* eslint-env browser */

import {
  commentCreator,
  commentBoxCreator,
  questionCreator,
} from './element-creator.js';

import fetchData from '../helpers/fetchData.js';

const voteControl = (voteBtn, index, array) => {
  const { id } = voteBtn.qObj;
  const count = document.getElementById(`vote-count-${id}`);

  voteBtn.addEventListener('click', async () => {
    if (voteBtn.classList.contains('active')) {
      try {
        const [data] = await fetchData.vote(id, 'clear');
        count.textContent = data.votes;
        voteBtn.classList.remove('active');
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const [data] = await fetchData.vote(id, voteBtn.action);
        count.textContent = data.votes;
        voteBtn.classList.add('active');
        const enemy = array[index === 0 ? 1 : 0];
        enemy.classList.remove('active');
      } catch (error) {
        console.log(error);
      }
    }
  });
};

const imgBtnControl = ([bwd, fwd, navArray, slide]) => {
  bwd.addEventListener('click', () => slide.move(0));
  fwd.addEventListener('click', () => slide.move(1));
  navArray.forEach(nav => nav.addEventListener('click', () => slide.jump(nav.tab)));
  slide.initialize();
};

const askBtnControl = (ask) => {
  ask.addEventListener('click', () => {
    const questObj = {
      id: 1,
      createdOn: '11/11/11',
      createdBy: 1,
      username: 'kossy360',
      meetup: 1,
      body: ask.input.value,
      votes: 0,
      comments: false,
    };
    // posts and waits for response
    addQuestion(ask.box, {
      data: [questObj],
    });
    ask.input.value = '';
  });
};

const commentBtnControl = (commentBtn) => {
  commentBtn.addEventListener('click', () => {
    const box = commentBtn.box.comment;
    if (commentBtn.classList.contains('collapsed')) {
      if (!box) {
        addComments(commentBtn.action, commentBtn.box);
      }
      commentBtn.classList.replace('collapsed', 'expanded');
      if (box) box.classList.add('showing');
    } else {
      commentBtn.classList.replace('expanded', 'collapsed');
      box.classList.remove('showing');
    }
  });
};

const replyBtnControl = (btns) => {
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.input.value = `@${btn.username} ${btn.input.value}`;
      btn.input.focus();
    });
  });
};

const notifContol = (notif) => {
  notif.addEventListener('click', (e) => {
    e.stopPropagation();
    notif.classList.toggle('yes', !notif.classList.contains('yes'));
  });
};

const addQuestion = (box, question) => {
  const [voteArray, commentBtns] = questionCreator(box, question.data);

  voteArray.forEach((voteBtns) => {
    voteBtns.forEach(voteControl);
  });

  commentBtns.forEach((commentBtn) => {
    commentBtnControl(commentBtn);
  });
};
const commentControl = (box, input, commentBtns) => {
  commentBtns.forEach((btn, index) => {
    if (index === 0) {
      btn.input = input;
      replyBtnControl([btn]);
    } else {
      const swith = (id1, showClass) => {
        const showing = document.querySelector(`.${showClass}`);
        showing.classList.toggle(showClass);
        document.getElementById(id1).classList.add(showClass);
      };
      btn.addEventListener('click', () => {
        swith('user-profile', 'section-showing');
      });
    }
  });
};

const addComments = (id, box) => {
  // get data with id
  const [addComment, input, replyBtns] = commentBoxCreator(box, []);

  addComment.addEventListener('click', () => {
    if (input.value === '') return;
    const data = {
      id: 0,
      createdOn: new Date().toLocaleDateString(),
      createdBy: 1,
      username: 'tester',
      question: 1,
      body: input.value,
    };
    input.value = '';
    const replyBtn = commentCreator(addComment.box, data);
    commentControl(box, input, replyBtn);
  });

  commentControl(box, input, replyBtns);

  box.classList.add('populated');
};

export {
  voteControl,
  imgBtnControl,
  askBtnControl,
  commentBtnControl,
  notifContol,
};
