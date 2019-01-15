/* eslint-env jasmine */
import jwt from 'jsonwebtoken';
import Request from 'request';
import Server from '../app';
import db from '../db/db';
import text from '../db/db.sql';

require('dotenv').config();

const start = () => Server;
start();

const url = string => `http://localhost:3000/api/v1/${string}`;

const token = jwt.sign({
  user: 1,
  isAdmin: true,
}, process.env.secretkey);

describe('user tests', () => {
  beforeAll((done) => {
    db.query(text.trim()).then(() => done()).catch(e => console.log(e));
  });
  describe('register a new user', () => {
    let data;
    const options = {
      url: url('auth/signup'),
      json: true,
      body: {
        firstname: 'john',
        lastname: 'doe',
        othername: 'johndoe',
        email: 'john@example.com',
        phonenumber: '0000000000',
        username: 'johndoe',
        password: 'johnny',
      },
    };
    beforeAll((done) => {
      Request.post(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 201', () => {
      expect(data.status).toBe(201);
    });
    it('a user object', () => {
      expect(data.data[0]).toBeDefined();
    });
    it('a jwt token', () => {
      expect(data.data[0].token).toBeDefined();
    });
  });

  describe('register a new user with bad data', () => {
    let data;
    const options = {
      url: url('auth/signup'),
      json: true,
      body: {
        firstname: 'john',
        lastname: '',
        othername: 'johndoe',
        email: 'john@example.com',
        phonenumber: '0000000000',
        username: 'johndoe',
        password: 'johnny',
      },
    };
    beforeAll((done) => {
      Request.post(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 400', () => {
      expect(data.status).toBe(400);
    });
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('login a user', () => {
    let data;
    const options = {
      url: url('auth/login'),
      json: true,
      body: {
        email: 'john@example.com',
        password: 'johnny',
      },
    };
    beforeAll((done) => {
      Request.post(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 200', () => {
      expect(data.status).toBe(200);
    });
    it('a user object', () => {
      expect(data.data[0]).toBeDefined();
    });
    it('a jwt token', () => {
      expect(data.data[0].token).toBeDefined();
    });

    describe('update user data', () => {
      let data1;
      const options1 = {
        url: url('users/update'),
        json: true,
        headers: {
          auth: token,
        },
        body: {
          firstname: 'johnny',
        },
      };
      beforeAll((done) => {
        Request.patch(options1, (error, response, body) => {
          data1 = body;
          done();
        });
      });
      it('status 200', () => {
        expect(data1.status).toBe(200);
      });
      it('user object', () => {
        expect(data1.data[0]).toBeDefined();
      });
      it('user info to be modified', () => {
        expect(data1.data[0].firstname).toBe('johnny');
      });
    });

    describe('update user with bad data', () => {
      let data1;
      const options1 = {
        url: url('users/update'),
        json: true,
        headers: {
          auth: token,
        },
        body: {
          firstname: 5,
        },
      };
      beforeAll((done) => {
        Request.patch(options1, (error, response, body) => {
          data1 = body;
          done();
        });
      });
      it('status 400', () => {
        expect(data1.status).toBe(400);
      });
      it('error message', () => {
        expect(data1.error).toBeDefined();
      });
    });
  });

  describe('login with wrong on non existent credentials', () => {
    let data;
    const options = {
      url: url('auth/login'),
      json: true,
      body: {
        email: 'john@example.com',
        password: 'jooonny',
      },
    };
    beforeAll((done) => {
      Request.post(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 404', () => {
      expect(data.status).toBe(404);
    });
    it('error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('login with bad data', () => {
    let data;
    const options = {
      url: url('auth/login'),
      json: true,
      headers: {
        auth: token,
      },
      body: {
        email: 'john@example.com',
        password: 'joy',
      },
    };
    beforeAll((done) => {
      Request.post(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 400', () => {
      expect(data.status).toBe(400);
    });
    it('error message', () => {
      expect(data.error).toBeDefined();
    });
  });
});
