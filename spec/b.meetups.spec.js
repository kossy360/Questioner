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

describe('meetup tests', () => {
  describe('create a meetup record', () => {
    let data;
    const options = {
      url: url('meetups'),
      headers: {
        auth: token,
      },
      json: true,
      body: {
        happening: Date.now() + 36000,
        location: 'Abuja',
        topic: 'testing',
        images: ['url1', 'url2'],
        tags: ['transport', 'infrastructure'],
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
    it('a meetup record', () => {
      expect(data.data[0]).toBeDefined();
    });
  });

  describe('create a meetup record with invalid fields', () => {
    let data;
    const options = {
      url: url('meetups'),
      headers: {
        auth: token,
      },
      json: true,
      body: {
        happening: Date.now() + 36000,
        location: 'Abuja',
        topic: '  ',
        images: ['url1', 'url2'],
        tags: ['transport', 'infrastructure'],
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

  describe('get all upcoming meetup records', () => {
    let data = {};
    const options = {
      url: url('meetups/upcoming'),
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
    it('status code', () => {
      expect(data.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('get a specific meetup record', () => {
    let data = {};
    const options = {
      url: url('meetups/1'),
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
    it('a meetup object', () => {
      expect(data.data[0]).toBeDefined();
    });
  });

  describe('get a nonexistent meetup record', () => {
    let data = {};
    const options = {
      url: url('meetups/8'),
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
    it('status 404', () => {
      expect(data.status).toBe(404);
    });
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('get all meetup records', () => {
    let data = {};
    const options = {
      url: url('meetups'),
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
    it('a meetup object', () => {
      expect(data.data[0]).toBeDefined();
    });
    it('contain valid meetup fields', () => {
      expect(data.data[0]).toBeDefined();
    });
  });

  describe('update a meetup record', () => {
    let data = {};
    const options = {
      url: url('meetups/1'),
      headers: {
        auth: token,
      },
      json: true,
      body: {
        location: 'ondo',
      },
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
    it('udated information', () => {
      expect(data.data[0].location).toBe('ondo');
    });
  });

  describe('update a non existent meetup record', () => {
    let data = {};
    const options = {
      url: url('meetups/8'),
      headers: {
        auth: token,
      },
      json: true,
      body: {
        location: 'ondo',
      },
    };
    beforeAll((done) => {
      Request.patch(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 404', () => {
      expect(data.status).toBe(404);
    });
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('update a meetup record with bad data', () => {
    let data = {};
    const options = {
      url: url('meetups/1'),
      headers: {
        auth: token,
      },
      json: true,
      body: {
        location: 5,
      },
    };
    beforeAll((done) => {
      Request.patch(options, (error, response, body) => {
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
});
