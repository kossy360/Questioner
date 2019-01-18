/* eslint-env browser */
const getFormData = (classname) => {
  const dataInput = document.getElementsByClassName(classname);
  const object = {};
  Array.prototype.forEach.call(dataInput, (input) => {
    const error = {
      message: 'invalid fields',
    };
    if (input.inputError) throw error;
    object[input.getAttribute('pointer')] = input.value;
  });
  return object;
};

export default getFormData;
