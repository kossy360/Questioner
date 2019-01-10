/* eslint-env jasmine */
import Request from 'request';
import Server from '../app';

const start = () => Server;
start();

const url = string => `http://localhost:3000/api/v1/${string}`;

const meetup = {
  createdOn: Date.now() + 5000,
  location: 'Abuja',
  happeningOn: Date.now() + 5000,
  topic: 'building of the 2nd Niger bridge',
  images: ['url1', 'url2'],
  tags: ['transport', 'technology', 'construction'],
};

describe('create a meetup record', () => {
  let data;
  const options = {
    url: url('meetups'),
    headers: {
      auth: 'admin',
    },
    json: true,
    body: meetup,
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

describe('create a meetup record with invalid fields', () => {
  let data;
  const options = {
    url: url('meetups'),
    headers: {
      auth: 'admin',
    },
    json: true,
    body: {
      createdOn: Date.now(),
      location: 'Abuja',
      happeningOn: Date.now(),
      topic: 'building of the 2nd Niger bridge',
      images: ['', 'url2'],
      tags: ['transport', 'technology', 'construction'],
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

describe('get all meetup records', () => {
  let data = {};
  const options = {
    url: url('meetups'),
    headers: {
      auth: 'user',
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

describe('get all upcoming meetup records', () => {
  let data = {};
  const options = {
    url: url('meetups/upcoming'),
    headers: {
      sender: 'user',
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
  it('a friendly message or a meetup objects', () => {
    const response = data.data[0] || data.message;
    expect(response).toBeDefined();
  });
});

describe('get a specific meetup record', () => {
  let data = {};
  const options = {
    url: url('meetups/1'),
    headers: {
      sender: 'user',
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
  it('an meetup object', () => {
    expect(data.data[0]).toBeDefined();
  });
});

describe('get a nonexistent meetup record', () => {
  let data = {};
  const options = {
    url: url('meetups/8'),
    headers: {
      auth: 'user',
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
