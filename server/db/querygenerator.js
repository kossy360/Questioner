const queryGenerator = {
  insertFields: (body) => {
    const keys = Object.keys(body);
    const result = {
      key1: keys.toString(),
      key2: '',
      values: [],
    };
    keys.forEach((key, index) => {
      const comma = index === 0 ? '' : ',';
      result.key2 = `${result.key2}${comma}$${index + 1}`;
      result.values.push(typeof body[key] === 'object' && body[key] !== null ? JSON.stringify(body[key]) : body[key]);
    });
    return result;
  },

  updateFields: (body) => {
    const keys = Object.keys(body);
    const result = {
      key1: '',
      key2: keys.toString(),
      values: [],
    };
    keys.forEach((key, index) => {
      const comma = index === (keys.length - 1) ? '' : ',';
      result.key1 = `${result.key1}${key}=$${index + 1}${comma}`;
      result.values.push(typeof body[key] === 'object' && body[key] !== null ? JSON.stringify(body[key]) : body[key]);
    });
    return result;
  },

  searchTag: (tags) => {
    let string = '';
    tags.forEach((tag, index) => {
      const or = index === 0 ? '' : 'OR';
      string = `${string} ${or} tags ? '${tag}'`;
    });
    return `WHERE ${string}`;
  },
};

export default queryGenerator;
