/* eslint-env jasmine */
import Request from 'request';

const url = string => `http://localhost:3000/api/v1/${string}`;

const question = {
  createdOn: Date.now() + 5000,
  createdBy: 1,
  meetup: 1,
  body: 'when is the completion date?',
  votes: 0,
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
      auth: 'admin',
    },
    json: true,
    body: {
      createdOn: Date.now() + 5000,
      createdBy: 1,
      meetup: 1,
      body: '  ',
      votes: 10,
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

describe('get all questions for a nonexistent meetup', () => {
  let data = {};
  const options = {
    url: url('questions/15'),
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
  it('a friendly message', () => {
    expect(data.message).toBeDefined();
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
  it('status 200', () => {
    expect(data.status).toBe(200);
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
    expect(data.status).toBe(404);
  });
  it('an error message', () => {
    expect(data.error).toBeDefined();
  });
});
