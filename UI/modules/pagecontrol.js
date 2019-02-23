/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import {
  voteControl,
  commentBtnControl,
  askBtnControl,
} from './buttonControllers.js';

import {
  questionContainerCreator,
} from './element-creator.js';

const createQuestions = (container, questionData, id) => {
  const [main, ask, voteArray, commentBtns, profiles] = questionContainerCreator(
    container, questionData,
  );
  askBtnControl(ask, id);

  voteArray.forEach((voteBtns) => {
    voteBtns.forEach(voteControl);
  });
  commentBtns.forEach((commentBtn) => {
    commentBtnControl(commentBtn);
  });

  return profiles;
};

export {
  createQuestions,
};
