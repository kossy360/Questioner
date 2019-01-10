import joi from 'joi';

const schemas = {
  meetup: joi.object().keys({
    createdOn: joi.number().min(Date.now()).required(),
    happeningOn: joi.number().min(Date.now()).required(),
    location: joi.string().replace(/^ *$/g, '').concat(joi.string().trim().required()),
    topic: joi.string().replace(/^ *$/g, '').concat(joi.string().trim().required()),
    images: joi.array().items(joi.string().required()).required(),
    tags: joi.array().items(joi.string().required()).required(),
  }),

  questions: joi.object().keys({
    createdOn: joi.number().min(Date.now()).required(),
    createdBy: joi.number().integer().min(0).required(),
    meetup: joi.number().integer().min(0).required(),
    body: joi.string().replace(/^ *$/g, '').concat(joi.string().trim().required()),
    votes: joi.number().integer().required(),
  }),

  rsvps: joi.object().keys({
    user: joi.number().integer().min(0).required(),
    meetup: joi.number().integer().min(0).required(),
    topic: joi.string().replace(/^ *$/g, '').concat(joi.string().trim().required()),
    response: joi.string().trim().equal('yes', 'no', 'maybe'),
  }),
};

const validator = (object, schemaName) => joi.validate(
  object,
  schemas[schemaName],
);

export default validator;
