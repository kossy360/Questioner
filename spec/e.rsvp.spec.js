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
  isAdmin: false,
}, process.env.secretkey);

describe('rsvp tests', () => {
  describe('create a rsvp record', () => {
    let data;
    const options = {
      url: url('meetups/1/rsvps'),
      headers: {
        auth: token,
      },
      json: true,
      body: {
        response: 'yes',
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
    it('an rsvp object', () => {
      expect(data.data[0]).toBeDefined();
    });
  });

  describe('request rsvp with bad fields', () => {
    let data;
    const options = {
      url: url('meetups/1/rsvps'),
      headers: {
        auth: token,
      },
      json: true,
      body: {
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

  describe('rsvp for a nonexistent question', () => {
    let data;
    const options = {
      url: url('meetups/8/rsvps'),
      headers: {
        auth: token,
      },
      json: true,
      body: {
        response: 'yes',
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
    it('an error message', () => {
      expect(data.error).toBeDefined();
    });
  });
});
