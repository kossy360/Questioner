import querydb from './querydb';
import queryGenerator from './querygenerator';

const userQuery = {
  fields: 'id, firstname, lastname, othername, email, phoneNumber, username, registered, displaypicture, isadmin',

  createNew: (body) => {
    const { key1, key2, values } = queryGenerator.insertFields(body);
    return querydb.query(`INSERT INTO public.user (${key1}) VALUES (${key2}) RETURNING ${userQuery.fields}`, values);
  },

  getUser: value => querydb.query(`SELECT ${userQuery.fields}, password FROM public.user WHERE email = $1 OR username = $1`, [value]),

  getProfile: userId => querydb.query(`SELECT ${userQuery.fields} FROM public.user WHERE id = $1`, [userId]),

  update: (userId, body) => {
    const { key1, key2, values } = queryGenerator.updateFields(body);
    return querydb.query(`UPDATE public.user SET ${key1} WHERE id = ${userId} RETURNING ${key2.includes('email') ? '' : 'email,'}${key2.includes('username') ? '' : 'username,'}${key2}`, values);
  },

  lookup: (type, value) => querydb.query(`SELECT ${type} FROM public.user WHERE ${type} = $1`, [value]),

  getStat: user => querydb.query('SELECT * FROM public.get_stat($1)', [user]),
};

const meetupQuery = {
  fields: 'id, topic, location, happening, tags, images',

  getAll: (userId, isadmin) => querydb.query(`SELECT * from all_meets_${isadmin ? 'admin' : 'user'}(${userId})`),

  getUpcoming: userId => querydb.query(`SELECT * FROM all_meets_user(${userId}) WHERE rsvp = 'yes'`),

  getSpecific: (userId, isadmin, meetupId) => querydb.query(`SELECT * FROM all_meets_${isadmin ? 'admin' : 'user'}(${userId}) WHERE id = $1`, [meetupId]),

  createNew: (body) => {
    const { key1, key2, values } = queryGenerator.insertFields(body);
    return querydb.query(`INSERT INTO public.meets (${key1}) VALUES (${key2}) RETURNING ${meetupQuery.fields}, rsvp_count(id) as rsvp, 0 as questions`, values);
  },

  delete: meetupId => querydb.query('DELETE FROM public.meets WHERE id = $1 RETURNING *', [meetupId]),

  update: (body, meetupId) => {
    const { key1, key2, values } = queryGenerator.updateFields(body);
    return querydb.query(`UPDATE public.meets SET ${key1} WHERE id = ${meetupId} RETURNING id, topic, ${key2.replace(/topic,/, '')}, dImages`, values);
  },

  search: (type, value, userId, isadmin) => {
    if (type === 'topic') return querydb.query(`SELECT * from all_meets_${isadmin ? 'admin' : 'user'}(${userId}) WHERE topic ILIKE $1`, [value]);
    return querydb.query(`SELECT * from all_meets_${isadmin ? 'admin' : 'user'}(${userId}) ${queryGenerator.searchTag(value)}`);
  },
};

const questionQuery = {
  fields: 'q.id, q.user_id as user, u.username, u.displaypicture, q.meetup, q.body, q.created, q.votes',

  getAll: (userId, meetupId) => querydb.query('SELECT * FROM get_questions($1, $2)', [userId, meetupId]),

  createNew: (userId, qBody) => {
    const { meetup, body } = qBody;
    return querydb.query('SELECT * FROM create_question($1, $2, $3)', [userId, meetup, body]);
  },

  vote: (userId, questionId, vote) => querydb.query('SELECT * FROM update_votes($1, $2, $3)', [userId, questionId, vote]),
};

const commentsQuery = {
  getall: questionId => querydb.query('SELECT c.id, c.user_id as user, c.question, u.username, u.displaypicture, c.comment, c.created FROM public.comments c LEFT JOIN public.user u ON c.user_id = u.id WHERE c.question = $1',
    [questionId]),

  createNew: (userId, body) => {
    const { key2, values } = queryGenerator.insertFields(body);
    return querydb.query(`SELECT * FROM post_comments(${userId},${key2})`, values);
  },
};

const rsvpsQuery = {
  createNew: (userId, meetupId, response) => querydb.query('SELECT * FROM update_rsvps($1, $2, $3)', [userId, meetupId, response]),
};

const notificationsQuery = {
  register: (userId, meetupId) => querydb.query('INSERT INTO public.notifications (user_id, meet) VALUES ($1, $2) ON CONFLICT ON CONSTRAINT notifications_unique DO NOTHING;',
    [userId, meetupId]),

  reset: (userId, meetupId) => querydb.query('UPDATE public.notifications SET last_seen = $1 WHERE meet=$2 AND user_id=$3 RETURNING *;',
    [new Date().toISOString(), meetupId, userId]),

  clear: (userId, meetupId) => querydb.query('DELETE FROM public.notifications WHERE user_id = $1 AND meet=$2 RETURNING *',
    [userId, meetupId]),

  getAll: userId => querydb.query('SELECT * FROM get_notif($1)', [userId]),
};

export {
  userQuery,
  meetupQuery,
  questionQuery,
  commentsQuery,
  rsvpsQuery,
  notificationsQuery,
};
