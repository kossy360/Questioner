const modal = document.querySelector('.modal-container');
const head = document.getElementById('modal-head');
const body = document.getElementById('modal-body-text');
const yes = document.querySelector('.modal-opt.true');
const no = document.querySelector('.modal-opt.false');

let decision = null;

yes.addEventListener('click', () => {
  decision = 'yes';
});

no.addEventListener('click', () => {
  decision = 'no';
});

const confirmAct = (headtext, bodytext) => {
  modal.style.display = 'flex';
  head.textContent = headtext;
  body.textContent = bodytext;
  decision = null;

  return new Promise((res) => {
    const interval = window.setInterval(() => {
      if (decision === 'yes') res(true);
      else if (decision === 'no') res(false);
      if (decision) {
        modal.style.display = 'none';
        window.clearInterval(interval);
      }
    });
  });
};

export default confirmAct;
