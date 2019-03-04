import fetchData from './fetchData.js';
import setHeight from './setHeight.js';

const reset = async (meetup, container) => {
  try {
    await fetchData.reset(meetup);
    container.remove();
  } catch (error) {
    console.log(error);
  }
};

const notification = (container, quests, expand, expandMeet) => {
  container.addEventListener('click', async () => {
    const element = Array.prototype.find.call(
      document.getElementsByClassName('meet-container'), elem => Number(elem.id) === container.meetup,
    );
    element.click();
    await reset(container.meetup, container);
  });

  quests.forEach((ques) => {
    ques.addEventListener('click', async (e) => {
      e.stopPropagation();
      const element = Array.prototype.find.call(
        document.getElementsByClassName('meet-container'), elem => Number(elem.id) === ques.data.meetup,
      );
      await expandMeet(element.data);
      console.log(document.getElementsByClassName('meet-question-details').length);
      const question = Array.prototype.find.call(
        document.getElementsByClassName('meet-question-details'), elem => Number(elem.id) === ques.data.id,
      );
      console.log(document.getElementsByClassName('meet-question-details').length);
      question.scrollIntoView(true);
      await reset(container.meetup, container);
    });
  });

  setHeight(expand.qbox, true);

  expand.addEventListener('click', (e) => {
    e.stopPropagation();
    const { qbox } = expand;
    if (expand.classList.contains('collapsed')) {
      qbox.classList.add('showing');
      setHeight(qbox, false);
      expand.classList.replace('collapsed', 'expanded');
    } else {
      qbox.classList.remove('showing');
      setHeight(qbox, true);
      expand.classList.replace('expanded', 'collapsed');
    }
  });
};

export default notification;
