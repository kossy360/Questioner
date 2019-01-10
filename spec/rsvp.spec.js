/* eslint-env jasmine */
import Request from 'request';

const url = string => `http://localhost:3000/api/v1/${string}`;

const rsvp = {
  user: 1,
  meetup: 1,
  topic: 'building of the 2nd Niger bridge',
  response: 'yes',
};

describe('create a rsvp record', () => {
  let data;
  const options = {
    url: url('meetups/1/rsvps'),
    headers: {
      auth: 'user',
    },
    json: true,
    body: rsvp,
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
  it('an rsvp object', () => {
    expect(data.data[0]).toBeDefined();
  });
});

describe('request rsvp with bad fields', () => {
  let data;
  const options = {    
    url: url('meetups/1/rsvps'),
    headers: {
      auth: 'user',
    },
    json: true,
    body: {
      user: 1,
      meetup: 1,
      topic: 'building of the 2nd Niger bridge',
      response: 'not sure',
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
  it('expects an error message', () => {
    expect(data.error).toBeDefined();
  });
});
