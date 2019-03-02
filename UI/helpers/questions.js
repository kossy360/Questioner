import fetchData from './fetchData.js';
import { createQuestions } from '../modules/pagecontrol.js';

const questions = {
  get: async (id, container) => {
    try {
      const data = await fetchData.questions(id);
      console.log(data);
      const result = typeof data === 'string' ? [] : data;
      return createQuestions(container, result, id);
    } catch (error) {
      throw error;
    }
  },
};

export default questions;
