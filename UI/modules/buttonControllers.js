import {
  commentCreator,
  commentBoxCreator,
  questionCreator,
} from './element-creator.js';

import fetchData from '../helpers/fetchData.js';
import setHeight from '../helpers/setHeight.js';

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

const askBtnControl = (ask, meetup) => {
  ask.addEventListener('click', async () => {
    const { input } = ask;
    if (!input.value) return;
    const questObj = {
      meetup,
      body: input.value,
    };
    try {
      const data = await fetchData.createQuestion(questObj);
      console.log(data[0]);
      addQuestion(ask.box, data);
      ask.input.value = '';
    } catch (error) {
      console.log(error);
    }
  });
};

const commentBtnControl = (commentBtn) => {
  commentBtn.addEventListener('click', async () => {
    let box = commentBtn.box.commentContainer;
    if (commentBtn.classList.contains('collapsed')) {
      if (!box) {
        await addComments(commentBtn.action, commentBtn.box);
        box = commentBtn.box.commentContainer;
        setHeight(box, true);
      }
      commentBtn.classList.replace('collapsed', 'expanded');
      box.classList.add('showing');
      setHeight(box, false);
    } else {
      commentBtn.classList.replace('expanded', 'collapsed');
      box.classList.remove('showing');
      setHeight(box, true);
    }
  });
};

const notifContol = (notif, id) => {
  notif.id = `notif-${id}`;
  notif.addEventListener('click', async (e) => {
    console.log('notif');
    e.stopPropagation();
    try {
      const msg = await fetchData[notif.classList.contains('yes') ? 'clear' : 'register'](id);
      console.log(msg);
      const brothers = document.querySelectorAll(`#notif-${id}`);
      Array.prototype.forEach.call(brothers, bro => bro.classList.toggle('yes', !bro.classList.contains('yes')));
    } catch (error) {
      console.log(error);
    }
  });
};

const addQuestion = (box, data) => {
  const [voteArray, commentBtns] = questionCreator(box, data);

  voteArray.forEach((voteBtns) => {
    voteBtns.forEach(voteControl);
  });

  commentBtns.forEach((commentBtn) => {
    commentBtnControl(commentBtn);
  });
};

const commentControl = (profiles) => {
  profiles.forEach((btns) => {
    const swith = (id1, showClass) => {
      const showing = document.querySelector(`.${showClass}`);
      showing.classList.toggle(showClass);
      document.getElementById(id1).classList.add(showClass);
    };
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        swith('user-profile', 'section-showing');
      });
    });
  });
};

const addComment = (question, comment, input, box) => {
  comment.addEventListener('click', async () => {
    if (input.value === '') return;
    const obj = {
      question,
      comment: input.value,
    };
    try {
      const [data] = await fetchData.createComment(obj);
      console.log(data);
      const profile = commentCreator(comment.box, data);
      commentControl([profile]);
      setHeight(box, false);
      input.value = '';
    } catch (error) {
      console.log(error);
    }
  });
};

const addComments = async (id, box) => {
  try {
    const data = await fetchData.comments(id);
    const result = typeof data === 'string' ? [] : data;
    const [comment, input, profiles] = commentBoxCreator(box, result);
    addComment(id, comment, input, box.commentContainer);
    commentControl(profiles);
  } catch (error) {
    console.log(error);
  }
  box.classList.add('populated');
};

export {
  voteControl,
  imgBtnControl,
  askBtnControl,
  commentBtnControl,
  notifContol,
};
