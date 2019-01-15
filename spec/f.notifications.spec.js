/* eslint-env jasmine */
import jwt from 'jsonwebtoken';
import Request from 'request';
import Server from '../app';

require('dotenv').config();

const start = () => Server;
start();

const url = string => `http://localhost:3000/api/v1/${string}`;

const token = jwt.sign({
  user: 1,
  isAdmin: true,
}, process.env.secretkey);

describe('notification tests', () => {
  describe('register notifications on a meetup', () => {
    let data;
    const options = {
      url: url('notifications/1/register'),
      headers: {
        auth: token,
      },
      json: true,
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
    it('a reply', () => {
      expect(data.message).toBeDefined();
    });
  });

  describe('register notifications on a non-existent meetup', () => {
    let data;
    const options = {
      url: url('notifications/5/register'),
      headers: {
        auth: token,
      },
      json: true,
    };
    beforeAll((done) => {
      Request.post(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 200', () => {
      expect(data.status).toBe(201);
    });
    it('a friendly message', () => {
      expect(data.message).toBeDefined();
    });
  });

  describe('reset notifications on a meetup', () => {
    let data;
    const options = {
      url: url('notifications/1/reset'),
      headers: {
        auth: token,
      },
      json: true,
    };
    beforeAll((done) => {
      Request.patch(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 200', () => {
      expect(data.status).toBe(200);
    });
    it('a message', () => {
      expect(data.message).toBeDefined();
    });
  });

  describe('reset notifications on a non-existent meetup', () => {
    let data;
    const options = {
      url: url('notifications/5/reset'),
      headers: {
        auth: token,
      },
      json: true,
    };
    beforeAll((done) => {
      Request.patch(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 200', () => {
      expect(data.status).toBe(200);
    });
    it('a message', () => {
      expect(data.message).toBeDefined();
    });
  });

  describe('clear notifications on a meetup', () => {
    let data;
    const options = {
      url: url('notifications/1/clear'),
      headers: {
        auth: token,
      },
      json: true,
    };
    beforeAll((done) => {
      Request.delete(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 200', () => {
      expect(data.status).toBe(200);
    });
    it('a message', () => {
      expect(data.message).toBeDefined();
    });
  });

  describe('get all notifications on a meetup', () => {
    let data;
    const options = {
      url: url('notifications/1/get'),
      headers: {
        auth: token,
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
    it('a message', () => {
      expect(data.message).toBeDefined();
    });
  });

  describe('delete a meetup record', () => {
    let data = {};
    const options = {
      url: url('meetups/1'),
      headers: {
        auth: token,
      },
      json: true,
    };
    beforeAll((done) => {
      Request.delete(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 200', () => {
      expect(data.status).toBe(200);
    });
    it('a success message', () => {
      expect(data.message).toBeDefined();
    });
  });
});
