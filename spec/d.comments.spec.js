/* eslint-env jasmine */
import jwt from 'jsonwebtoken';
import Request from 'request';
import Server from '../server/app';

require('dotenv').config();

const start = () => Server;
start();

const url = string => `http://localhost:3000/api/v1/${string}`;

const token = jwt.sign({
  user: 1,
  isAdmin: true,
}, process.env.secretkey);

describe('comments tests', () => {
  describe('comment on a specific question', () => {
    let data;
    const options = {
      url: url('comments'),
      headers: {
        'x-access-token': token,
      },
      json: true,
      body: {
        question: 1,
        comment: 'this is a comment',
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
    it('a comment object', () => {
      expect(data.data[0]).toBeDefined();
    });
  });

  describe('post a comment with bad data', () => {
    let data;
    const options = {
      url: url('comments'),
      headers: {
        'x-access-token': token,
      },
      json: true,
      body: {
        question: 1,
        comment: '  ',
      },
    };
    beforeAll((done) => {
      Request.post(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 422', () => {
      expect(data.status).toBe(422);
    });
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('post a comment to a non-existent question', () => {
    let data;
    const options = {
      url: url('comments'),
      headers: {
        'x-access-token': token,
      },
      json: true,
      body: {
        question: 5,
        comment: 'this is a comment',
      },
    };
    beforeAll((done) => {
      Request.post(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 200', () => {
      expect(data.status).toBe(404);
    });
    it('a error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('get all comments for a specific question', () => {
    let data = {};
    const options = {
      url: url('comments/1'),
      headers: {
        'x-access-token': token,
      },
      json: true,
    };
    beforeAll((done) => {
      Request.get(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 200', () => {
      expect(data.status).toBe(200);
    });
    it('a comment object', () => {
      expect(data.data[0]).toBeDefined();
    });
  });

  describe('get all comments for a non-existent question', () => {
    let data;
    const options = {
      url: url('comments/15'),
      headers: {
        'x-access-token': token,
      },
      json: true,
    };
    beforeAll((done) => {
      Request.get(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 200', () => {
      expect(data.status).toBe(200);
    });
    it('a friendly message', () => {
      expect(data.message).toBeDefined();
    });
  });
});
