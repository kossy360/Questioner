/* eslint-disable newline-per-chained-call */
import joi from 'joi';

const schemas = {
  user: joi.object().keys({
    firstname: joi.string().alphanum().min(1).required(),
    lastname: joi.string().alphanum().min(1).required(),
    othername: joi.string().alphanum().min(1).required(),
    email: joi.string().email().required(),
    phonenumber: joi.string().regex(/^\d+$/).min(6).max(15).required(),
    username: joi.string().alphanum().min(3).max(10).required(),
    password: joi.string().trim().regex(/^[a-zA-Z0-9]{6,12}$/).required(),
  }),

  login: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().trim().regex(/^[a-zA-Z0-9]{6,12}$/).required(),
  }),

  updateUser: joi.object().keys({
    user_id: joi.any(),
    isAdmin: joi.any(),
    firstname: joi.string().alphanum().min(1),
    lastname: joi.string().alphanum().min(1),
    othername: joi.string().alphanum().min(1),
    email: joi.string().email(),
    phonenumber: joi.string().regex(/\d/).min(6).max(15),
    username: joi.string().alphanum().min(3).max(10),
  }),

  meetup: joi.object().keys({
    happening: joi.number().integer().min(Date.now()).required(),
    location: joi.string().replace(/^ *$/g, '').concat(joi.string().trim().required()),
    topic: joi.string().replace(/^ *$/g, '').concat(joi.string().trim().required()),
    images: joi.array().items(joi.string().required()).required(),
    tags: joi.array().items(joi.string().required()).required(),
  }),

  updateMeetup: joi.object().keys({
    happening: joi.number().integer().min(Date.now()),
    location: joi.string().replace(/^ *$/g, '').concat(joi.string().trim()).min(3),
    topic: joi.string().replace(/^ *$/g, '').concat(joi.string().trim()),
    images: joi.array().items(joi.string().required()),
    tags: joi.array().items(joi.string().required()),
  }),

  questions: joi.object().keys({
    user_id: joi.number().integer().min(1).required(),
    meetup: joi.number().integer().min(1).required(),
    body: joi.string().replace(/^ *$/g, '').concat(joi.string().trim().required()),
  }),

  comments: joi.object().keys({
    user_id: joi.number().integer().min(1).required(),
    question: joi.number().integer().min(1).required(),
    comment: joi.string().replace(/^ *$/g, '').concat(joi.string().trim().required()),
  }),

  rsvps: joi.object().keys({
    response: joi.string().trim().equal('yes', 'no', 'maybe').insensitive().required(),
  }),

  reqId: joi.object().keys({
    meetupId: joi.number().integer().min(1),
    questionId: joi.number().integer().min(1),
    userId: joi.number().integer().min(1),
    vote: joi.string().trim().equal('upvote', 'downvote', 'clear').insensitive(),
  }),
};

const validator = (object, schemaName) => joi.validate(
  object,
  schemas[schemaName],
);

export default validator;
