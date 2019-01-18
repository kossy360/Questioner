/* eslint-disable no-param-reassign */
/* eslint-env browser */
const loop = Array.prototype.forEach;
const populateProfile = (inputFields, editBtns, profile) => {
  loop.call(inputFields, (elem) => {
    const pointer = elem.getAttribute('pointer');
    elem.value = profile[pointer];
  })

  loop.call(editBtns, (elem) => {
    elem.addEventListener('click', () => {
      const input = document.getElementById(elem.getAttribute('input'));
      input.disabled = elem.classList.contains('active');
      elem.innerHTML = input.disabled ? 'edit' : 'ok';
      elem.classList.toggle('active', !input.disabled);
      if (!input.disabled) input.focus();
    });
  });
};

export {
  populateProfile,
};
