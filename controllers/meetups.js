import storage from '../storage';

const success = (status, data) => ({ status, data });
const errors = (status, error) => ({ status, error });

const reduce = (meets) => {
  const reducedMeet = meets.map((meet) => {
    const result = {
      id: meet.id,
      location: meet.location,
      happeningOn: meet.happeningOn,
      topic: meet.topic,
      images: meet.images,
      tags: meet.tags,
    };
    return result;
  });
  return reducedMeet;
};

const control = {
  getAll(req, res) {
    const meets = storage.meetups;
    if (meets) res.status(200).send(success(200, reduce(meets)));
    else res.staus(404).send(errors(404, 'Not Found'));
  },

  getUpcoming(req, res) {
    const meets = storage.meetups.filter(meet => meet.happeningOn > Date.now());
    if (meets) res.status(200).send(success(200, reduce(meets)));
    else res.status(404).send(errors(404, 'Not Found'));
  },

  getSpecific(req, res) {
    const meetup = storage.meetups.find(meet => meet.id.toString() === req.params.meetupId);
    if (meetup) res.status(200).send(success(200, reduce([meetup])));
    else res.status(404).send(errors(404, 'Not Found'));
  },

  createNew(req, res) {
    const { body } = req;
    body.id = `${storage.meetups.length + 1}`;
    storage.meetups.push(body);
    res.status(200).json(success(200, reduce([body])));
  },
};

export default control;
