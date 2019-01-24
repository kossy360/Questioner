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

describe('question tests', () => {
  describe('create a question for a specific meetup', () => {
    let data;
    const options = {
      url: url('questions'),
      headers: {
        'x-access-token': token,
      },
      json: true,
      body: {
        meetup: 1,
        body: 'are we really testing?',
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
    it('a question object', () => {
      expect(data.data[0]).toBeDefined();
    });
  });

  describe('create a question for a specific meetup with invalid fields', () => {
    let data;
    const options = {
      url: url('questions'),
      headers: {
        'x-access-token': token,
      },
      json: true,
      body: {
        meetup: 1,
        body: '  ',
      },
    };
    beforeAll((done) => {
      Request.post(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 400', () => {
      expect(data.status).toBe(422);
    });
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('get all questions for a specific meetup', () => {
    let data = {};
    const options = {
      url: url('questions/1'),
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
    it('a question object', () => {
      expect(data.data[0]).toBeDefined();
    });
  });

  describe('get all questions for a nonexistent meetup', () => {
    let data;
    const options = {
      url: url('questions/15'),
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

  describe('upvote a question by 1', () => {
    let data;
    const options = {
      url: url('questions/1/upvote'),
      headers: {
        'x-access-token': token,
      },
      json: true,
    };
    beforeAll((done) => {
      Request.patch(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 201', () => {
      expect(data.status).toBe(201);
    });
    it('a question object', () => {
      expect(data.data[0]).toBeDefined();
    });
  });

  describe('downvote a question by 1', () => {
    let data;
    const options = {
      url: url('questions/1/downvote'),
      headers: {
        'x-access-token': token,
      },
      json: true,
    };
    beforeAll((done) => {
      Request.patch(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 201', () => {
      expect(data.status).toBe(201);
    });
    it('a question object', () => {
      expect(data.data[0]).toBeDefined();
    });
  });

  describe('clear a vote', () => {
    let data = {};
    const options = {
      url: url('questions/1/clear'),
      headers: {
        'x-access-token': token,
      },
      json: true,
    };
    beforeAll((done) => {
      Request.patch(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 201', () => {
      expect(data.status).toBe(201);
    });
    it('a question object', () => {
      expect(data.data[0]).toBeDefined();
    });
  });

  describe('downvote a non-existent question', () => {
    let data = {};
    const options = {
      url: url('questions/10/downvote'),
      headers: {
        'x-access-token': token,
      },
      json: true,
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

  describe('vote with invalid meetupId', () => {
    let data = {};
    const options = {
      url: url('questions/xx/downvote'),
      headers: {
        'x-access-token': token,
      },
      json: true,
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

  describe('delete a non existent meetup record', () => {
    let data = {};
    const options = {
      url: url('meetups/8'),
      headers: {
        'x-access-token': token,
      },
      json: true,
    };
    beforeAll((done) => {
      Request.delete(options, (error, response, body) => {
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
});
