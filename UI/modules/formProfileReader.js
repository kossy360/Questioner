/* eslint-env browser */
class ReadForm {
  constructor(inputs) {
    this.inputs = inputs;
    this.storage = window.sessionStorage;
  }

  storeProfile() {
    const obj = {};
    Array.prototype.forEach.call(this.inputs, (input) => {
      const pointer = input.getAttribute('pointer');
      obj[pointer] = input.value;
    });
    const objString = JSON.stringify(obj);
    this.storage.setItem('user', objString);
  }

  getProfile() {
    const profileString = this.storage.getItem('user');
    return JSON.parse(profileString);
  }
}

export default ReadForm;
