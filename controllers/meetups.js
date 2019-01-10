import storage from '../storage';
import validator from '../middleware/validator';
import error from '../middleware/errorhandler';

const success = (status, data) => ({ status, data });

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
  getAll: (req, res) => {
    const meets = storage.meetups;
    if (meets) res.status(200).send(success(200, reduce(meets)));
    else {
      res.status(200).send({
        status: 200,
        message: 'there are no meetup records available',
      });
    }
  },

  getUpcoming: (req, res) => {
    const meets = storage.meetups.filter(meet => meet.happeningOn > Date.now());
    if (meets.length > 0) res.status(200).send(success(200, reduce(meets)));
    else {
      res.status(200).send({
        status: 200,
        message: 'there are no upcoming meetups',
      });
    }
  },

  getSpecific: (req, res, next) => {
    const meetup = storage.meetups.find(meet => meet.id.toString() === req.params.meetupId);
    if (meetup) res.status(200).send(success(200, reduce([meetup])));
    else next(404);
  },

  createNew: async (req, res) => {
    const body = await validator(req.body, 'meetup').catch(() => error(400, res));
    if (!body) return;
    body.id = `${storage.meetups.length + 1}`;
    storage.meetups.push(body);
    res.status(201).json(success(201, reduce([body])));
  },
};

export default control;
