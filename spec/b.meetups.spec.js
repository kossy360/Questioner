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

const token2 = jwt.sign({
  user: 1,
  isAdmin: false,
}, process.env.secretkey);

describe('meetup tests', () => {
  describe('create a meetup record', () => {
    let data;
    const options = {
      url: url('meetups'),
      headers: {
        'x-access-token': token,
      },
      json: true,
      body: {
        happening: '2019-03-15T15:30',
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
        'x-access-token': token,
      },
      json: true,
      body: {
        happening: '2019-03-15T15:30',
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
    it('status 422', () => {
      expect(data.status).toBe(422);
    });
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('create a meetup record by non-admin user', () => {
    let data;
    const options = {
      url: url('meetups'),
      headers: {
        'x-access-token': token2,
      },
      json: true,
      body: {
        happening: '2019-03-15T15:30',
        location: 'Abuja',
        topic: 'the test meetup',
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
    it('status 403', () => {
      expect(data.status).toBe(403);
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
    it('status code', () => {
      expect(data.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('get a specific meetup record', () => {
    let data = {};
    const options = {
      url: url('meetups/1'),
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
    it('a meetup object', () => {
      expect(data.data[0]).toBeDefined();
    });
  });

  describe('get a nonexistent meetup record', () => {
    let data = {};
    const options = {
      url: url('meetups/8'),
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
        'x-access-token': token,
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
        'x-access-token': token,
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
        'x-access-token': token,
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
      expect(data.status).toBe(422);
    });
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('update a meetup record by non-admin user', () => {
    let data = {};
    const options = {
      url: url('meetups/1'),
      headers: {
        'x-access-token': token2,
      },
      json: true,
      body: {
        location: 'lagos',
      },
    };
    beforeAll((done) => {
      Request.patch(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 403', () => {
      expect(data.status).toBe(403);
    });
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('delete a meetup record by non-admin user', () => {
    let data = {};
    const options = {
      url: url('meetups/1'),
      headers: {
        'x-access-token': token2,
      },
      json: true,
    };
    beforeAll((done) => {
      Request.delete(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 403', () => {
      expect(data.status).toBe(403);
    });
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('delete a meetup with invalid meetupId', () => {
    let data = {};
    const options = {
      url: url('meetups/xx'),
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
    it('status 422', () => {
      expect(data.status).toBe(422);
    });
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('access secure route without token', () => {
    let data = {};
    const options = {
      url: url('meetups/1'),
      json: true,
    };
    beforeAll((done) => {
      Request.delete(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status 401', () => {
      expect(data.status).toBe(401);
    });
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });

  describe('meetup search by tags', () => {
    let data = {};
    const options = {
      url: url('meetups/search'),
      headers: {
        'x-access-token': token2,
      },
      json: true,
      body: {
        tags: ['infrastructure'],
      },
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
      expect(data.data[0].tags.result[0].topic).toBeDefined();
    });
  });

  describe('meetup search by topic', () => {
    let data = {};
    const options = {
      url: url('meetups/search'),
      headers: {
        'x-access-token': token2,
      },
      json: true,
      body: {
        topic: 'test',
      },
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
      expect(data.data[0].topic.result[0].topic).toBeDefined();
    });
  });

  describe('meetup search by tags and topic', () => {
    let data = {};
    const options = {
      url: url('meetups/search'),
      headers: {
        'x-access-token': token2,
      },
      json: true,
      body: {
        tags: ['infrastructure'],
        topic: 'testings',
      },
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
      expect(data.data[0].tags.result[0].topic).toBeDefined();
      expect(data.data[0].topic.message).toBeDefined();
    });
  });

  describe('meetup search with bad data', () => {
    let data = {};
    const options = {
      url: url('meetups/search'),
      headers: {
        'x-access-token': token2,
      },
      json: true,
      body: {
        topic: 3,
      },
    };
    beforeAll((done) => {
      Request.get(options, (error, response, body) => {
        data = body;
        done();
      });
    });
    it('status erro', () => {
      expect(data.status).toBe(422);
    });
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });
});
