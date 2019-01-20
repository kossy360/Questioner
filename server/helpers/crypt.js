import bcrypt from 'bcryptjs';

const crypt = {
  hash: body => new Promise(async (res) => {
    const body1 = body;
    body1.password = await bcrypt.hash(body1.password, 10);
    res(body1);
  }),

  verify: (body, password) => new Promise(async (res) => {
    if (!body) return res(false);
    const body1 = body;
    const check = await bcrypt.compare(password, body.password);
    if (check) {
      delete body1.password;
      return res(body1);
    }
    return res(false);
  }),
};

export default crypt;
