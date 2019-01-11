/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
/* eslint-env browser */
const loop = Array.prototype.forEach;

const imageInputControl = (container, input, imagee, action, data = null) => {
  if (!input.url) input.url = [];
  if (action === 1) {
    while (container.hasChildNodes()) container.removeChild(container.firstChild);
    input.url = [];
    if (!data) return;
  }

  const files = data || input.files;
  loop.call(files, (img) => {
    const image = imagee || document.createElement('img');
    const url = typeof img === 'string' ? img : window.URL.createObjectURL(img);
    image.src = url;
    input.url.push(url);
    if (imagee) return;
    container.appendChild(image);
    document.getElementById('profile-picture').src = url;
  });
};

export {
  imageInputControl,
};
