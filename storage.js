const storage = {
  meetups: [{
    id: 1,
    createdOn: Date.now(),
    location: 'Abuja',
    happeningOn: Date.now(),
    topic: 'building of the 2nd Niger bridge',
    images: ['url1', 'url2'],
    tags: ['transport', 'technology', 'construction'],
  }, {
    id: 2,
    createdOn: Date.now(),
    location: 'Abuja',
    happeningOn: Date.now(),
    topic: 'building of the 2nd Niger bridge',
    images: ['url1', 'url2'],
    tags: ['transport', 'technology', 'construction'],
  }, {
    id: 3,
    createdOn: Date.now(),
    location: 'Abuja',
    happeningOn: Date.now(),
    topic: 'building of the 2nd Niger bridge',
    images: ['url1', 'url2'],
    tags: ['transport', 'technology', 'construction'],
  }],

  questions: [{
    id: 1,
    createdOn: Date.now(),
    createdBy: 1,
    meetup: 1,
    body: 'when is the completion date?',
    votes: 10,
  }],

  rsvps: [{
    id: '1-1',
    user: 1,
    meetup: 1,
    topic: 'building of the 2nd Niger bridge',
    response: 'yes',
  }],
};

export default storage;
