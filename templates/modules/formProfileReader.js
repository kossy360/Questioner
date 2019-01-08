/* eslint-env browser */
class ReadForm {
  constructor(inputs) {
    this.inputs = inputs;
  }

  storeProfile() {
    const storage = window.sessionStorage;
    Array.prototype.forEach.call(this.inputs, (input) => {
      const pointer = input.getAttribute('pointer');
      storage.setItem(pointer, input.value);
    });
  }
}

export default ReadForm;
