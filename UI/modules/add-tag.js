/* eslint-env browser */
class AddTag {
  constructor(container, input) {
    this.container = container;
    this.input = input;
    this.tagArray = [];
    this.tags = [];
    this.initialize();
  }

  createTag(string) {
    const tagContainer = document.createElement('span');
    tagContainer.className = 'tag-span-container';

    const span = document.createElement('span');
    span.className = 'tag-span';
    span.textContent = string;

    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '✖';
    close.className = 'close-btn';

    tagContainer.appendChild(span);
    tagContainer.appendChild(close);
    this.tagArray.push(string);

    close.addEventListener('click', () => {
      tagContainer.parentElement.removeChild(tagContainer);
      this.tagArray.splice(this.tagArray.indexOf(string), 1);
      this.tags.splice(this.tags.indexOf(tagContainer), 1);
    });

    this.container.insertBefore(tagContainer, this.input);
    this.tags.push(tagContainer);
  }

  initialize() {
    this.input.addEventListener('keypress', (e) => {
      if (this.input.value === '') return;
      if (e.keyCode === 32 || e.keyCode === 13) {
        this.createTag(this.input.value);
        this.input.value = '';
      }
    });

    this.input.addEventListener('input', () => {
      this.input.value = this.input.value.trim();
    });
  }

  populate(tagArray) {
    tagArray.forEach(tag => this.createTag(tag));
  }

  getTag() {
    return this.tagArray.length > 0 ? this.tagArray : false;
  }

  clear() {
    this.tags.forEach((tag) => {
      tag.parentElement.removeChild(tag);
    });
    this.tags = [];
    this.tagArray = [];
  }
}

export default AddTag;
