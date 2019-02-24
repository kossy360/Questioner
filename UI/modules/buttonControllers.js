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
  commentBtn.addEventListener('click', () => {
    const box = commentBtn.box.commentContainer;
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

const notifContol = (notif) => {
  notif.addEventListener('click', (e) => {
    e.stopPropagation();
    notif.classList.toggle('yes', !notif.classList.contains('yes'));
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

const addComment = (question, comment, input) => {
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
    addComment(id, comment, input);
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
