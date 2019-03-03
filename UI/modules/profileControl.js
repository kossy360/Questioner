import fetchData from '../helpers/fetchData.js';
import createForm from '../helpers/createForm.js';

let initial = '';

const mergeObj = (newObj, oldObj) => {
  Object.keys(oldObj).forEach((key) => {
    if (!newObj[key]) newObj[key] = oldObj[key];
  });
  return newObj;
};

const updateData = (data) => {
  const old = JSON.parse(window.sessionStorage.getItem('user'));
  mergeObj(data, old);
  window.sessionStorage.setItem(
    'user',
    JSON.stringify(data),
  );
};

const update = async (obj, input) => {
  const body = createForm(obj);
  try {
    const [data] = await fetchData.updateUser(body);
    updateData(data);
  } catch (error) {
    input.value = initial;
    console.log(error);
  }
};

const loop = Array.prototype.forEach;

const populateProfile = (inputFields, editBtns, profile) => {
  loop.call(inputFields, (elem) => {
    const pointer = elem.getAttribute('pointer');
    elem.value = profile[pointer];
  });

  loop.call(editBtns, (elem) => {
    elem.addEventListener('click', () => {
      const input = document.getElementById(elem.getAttribute('input'));
      input.disabled = elem.classList.contains('active');
      elem.innerHTML = input.disabled ? 'edit' : 'ok';
      elem.classList.toggle('active', !input.disabled);
      if (input.disabled) {
        console.log(initial);
        if (!input.value) {
          input.value = initial;
          return;
        }
        if (initial === input.value.trim()) return;
        const obj = {};
        obj[input.getAttribute('pointer')] = input.value.trim();
        update(obj, input);
      } else {
        initial = input.value.trim();
        input.focus();
      }
    });
  });
};

const updateDp = async (displaypicture, imgs) => {
  console.log(displaypicture);
  const body = createForm({ displaypicture });
  try {
    const [data] = await fetchData.updateUser(body);
    updateData(data);
    imgs.forEach((img) => {
      img.src = data.displaypicture;
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  populateProfile,
  updateDp,
};
