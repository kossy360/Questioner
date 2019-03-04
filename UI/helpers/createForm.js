const createForm = (data) => {
  const form = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (typeof value === 'string') form.append(key, value);
    else if (value.length) value.forEach(val => form.append(key, val));
    else form.append(key, '');
  });
  return form;
};

export default createForm;
