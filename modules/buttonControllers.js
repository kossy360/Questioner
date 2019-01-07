/* eslint-disable prefer-destructuring */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
/* eslint-env browser */

import {
  commentCreator,
  commentBoxCreator,
  questionCreator,
} from './element-creator.js';

const voteControl = (voteBtn, index, array) => {
  voteBtn.calc = (x) => {
    const num = voteBtn.action;
    voteBtn.qObj.votes += x === 0 ? -num : num;
    voteBtn.parentElement.lastChild.textContent = voteBtn.qObj.votes;
  };

  voteBtn.addEventListener('click', () => {
    if (voteBtn.classList.contains('active')) {
      voteBtn.classList.remove('active');
      voteBtn.calc(0);
    } else {
      voteBtn.classList.add('active');
      voteBtn.calc(1);
      const enemy = array[index === 0 ? 1 : 0];
      if (enemy.classList.contains('active')) {
        enemy.classList.remove('active');
        enemy.calc(0);
      }
    }
  });
};

const imgBtnControl = (imgBtn) => {
  console.log(imgBtn.boxArray);
  const [parent] = imgBtn.boxArray;
  imgBtn.addEventListener('click', () => {
    if (parent.classList.contains('showing')) {
      parent.classList.remove('showing');
      imgBtn.classList.remove('expanded');
    } else {
      parent.classList.add('showing');
      imgBtn.classList.add('expanded');
    }
  });
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
    console.log(box);
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
      btn.input.value = `@${btn.username}${btn.input.value}`;
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

    replyBtn.input = input;
    replyBtnControl([replyBtn]);
  });

  replyBtns.forEach((btn) => {
    btn.input = input;
  });
  replyBtnControl(replyBtns);
  box.classList.add('populated');
};


export {
  voteControl,
  imgBtnControl,
  askBtnControl,
  commentBtnControl,
  notifContol,
};
