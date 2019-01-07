import storage from '../storage';

const success = (status, data) => ({ status, data });
// const errors = (status, error) => ({ status, error });

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
  createNew(req, res) {
    const { body } = req;
    storage.rsvps.push(body);
    res.status(200).json(success(200, reduce([body])));
  },
};

export default control;
