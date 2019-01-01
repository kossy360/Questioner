/* eslint-env jasmine */
import Request from 'request';

const url = string => `http://localhost:3000/api/v1/${string}`;

const question = {
  id: 1,
  createdOn: Date.now(),
  createdBy: 1,
  meetup: 1,
  body: 'when is the completion date?',
  votes: 10,
};

describe('create a question for a specific meetup', () => {
  let data;
  const options = {
    url: url('questions'),
    headers: {
      auth: 'admin',
    },
    json: true,
    body: question,
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
  it('a question object', () => {
    expect(data.data[0]).toBeDefined();
  });
});

describe('get all questions for a specific meetup', () => {
  let data = {};
  const options = {
    url: url('questions/1'),
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
  it('a question object', () => {
    expect(data.data[0]).toBeDefined();
  });
});

describe('upvote a question by 1', () => {
  let data = {};
  const options = {
    url: url('questions/1/upvote'),
    headers: {
      sender: 'user',
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
  it('a question object', () => {
    expect(data.data[0]).toBeDefined();
  });
});

describe('downvote a question by 1', () => {
  let data = {};
  const options = {
    url: url('questions/1/downvote'),
    headers: {
      auth: 'user',
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
    expect(data.status).toBe(200);
  });
  it('a question object', () => {
    expect(data.data[0]).toBeDefined();
  });
});
