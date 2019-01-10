import storage from '../storage';
import validator from '../middleware/validator';
import error from '../middleware/errorhandler';


const success = (status, data) => ({ status, data });

const reduce = (rsvps) => {
  const reducedRsvp = rsvps.map((rsvp) => {
    const result = {
      meetup: rsvp.meetup,
      topic: rsvp.topic,
      response: rsvp.response,
    };
    return result;
  });
  return reducedRsvp;
};

const control = {
  createNew: async (req, res) => {
    const body = await validator(req.body, 'rsvps').catch(() => error(400, res));
    if (!body) return;
    storage.rsvps.push(body);
    res.status(201).json(success(201, reduce([body])));
  },
};

export default control;
