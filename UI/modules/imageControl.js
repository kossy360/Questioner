/* eslint-disable import/prefer-default-export */
const loop = Array.prototype.forEach;

const imageInputControl = (container, input, imagee, action, data = null) => {
  if (!input.url) input.url = [];
  if (!input.images) input.images = [];
  if (action === 1) {
    while (container.hasChildNodes()) container.removeChild(container.firstChild);
    input.url = [];
    input.images = [];
    if (!data) return;
  }

  const files = data || input.files;
  console.log(files.length);
  loop.call(files, (img) => {
    input.images.push(img);
    const div = document.createElement('div');
    div.className = 'meet-create-image-container';
    const button = document.createElement('button');
    button.className = 'meet-image-delete';
    button.textContent = '✖';
    button.addEventListener('click', () => {
      div.remove();
      input.images.splice(input.images.indexOf(img), 1);
      console.log(input.images);
    });
    div.appendChild(button);
    const image = imagee || document.createElement('img');
    const url = typeof img === 'string' ? img : window.URL.createObjectURL(img);
    image.src = url;
    input.url.push(url);
    if (imagee) return;
    div.appendChild(image);
    container.appendChild(div);
    document.getElementById('profile-picture').src = url;
    console.log(input.images);
  });
};

export {
  imageInputControl,
};
