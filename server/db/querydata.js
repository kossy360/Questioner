import querydb from './querydb';
import queryGenerator from './querygenerator';

const userQuery = {
  fields: 'id, firstname, lastname, othername, email, phoneNumber, username, registered, displaypicture, isadmin',

  createNew: (body) => {
    const { key1, key2, values } = queryGenerator.insertFields(body);
    return querydb.query(`INSERT INTO public.user (${key1}) VALUES (${key2}) RETURNING ${userQuery.fields}`, values);
  },

  getUser: value => querydb.query(`SELECT ${userQuery.fields}, password FROM public.user WHERE email = $1 OR username = $1`, [value]),

  update: (userId, body) => {
    const { key1, key2, values } = queryGenerator.updateFields(body);
    return querydb.query(`UPDATE public.user SET ${key1} WHERE id = ${userId} RETURNING ${key2.includes('email') ? '' : 'email,'}${key2.includes('username') ? '' : 'username,'}${key2}`, values);
  },

  lookup: (type, value) => querydb.query(`SELECT ${type} FROM public.user WHERE ${type} = $1`, [value]),
};

const meetupQuery = {
  fields: 'id, topic, location, happening, tags, images',

  getAll: (userId, isadmin) => querydb.query(`SELECT * from all_meets_${isadmin ? 'admin' : 'user'}(${userId})`),

  getUpcoming: (userId, isadmin) => querydb.query(`SELECT * FROM all_meets_${isadmin ? 'admin' : 'user'}(${userId}) WHERE happening > '${new Date().toISOString()}'::timestamptz`),

  getSpecific: (userId, isadmin, meetupId) => querydb.query(`SELECT * FROM all_meets_${isadmin ? 'admin' : 'user'}(${userId}) WHERE id = $1`, [meetupId]),

  createNew: (body) => {
    const { key1, key2, values } = queryGenerator.insertFields(body);
    return querydb.query(`INSERT INTO public.meets (${key1}) VALUES (${key2}) RETURNING ${meetupQuery.fields}`, values);
  },

  delete: meetupId => querydb.query('DELETE FROM public.meets WHERE id = $1 RETURNING *', [meetupId]),

  update: (body, meetupId) => {
    const { key1, key2, values } = queryGenerator.updateFields(body);
    return querydb.query(`UPDATE public.meets SET ${key1} WHERE id = ${meetupId} RETURNING id as meetup, topic, ${key2.replace(/topic,/, '')}, dImages`, values);
  },

  search: (type, value, userId, isadmin) => {
    if (type === 'topic') return querydb.query(`SELECT * from all_meets_${isadmin ? 'admin' : 'user'}(${userId}) WHERE topic ILIKE $1`, [value]);
    return querydb.query(`SELECT * from all_meets_${isadmin ? 'admin' : 'user'}(${userId}) ${queryGenerator.searchTag(value)}`);
  },
};

const questionQuery = {
  fields: 'q.id, q.user_id as user, u.username, u.displaypicture, q.meetup, q.body, q.created, q.votes, v.response',

  getAll: (meetupId, userId) => querydb.query(
    `SELECT ${questionQuery.fields} FROM public.questions q LEFT JOIN public.user u ON q.user_id = u.id 
    LEFT JOIN public.vote v ON v.question = q.id and v.user_id = $2 WHERE q.meetup = $1 ORDER BY (votes, created) DESC`,
    [meetupId, userId],
  ),

  createNew: (userId, body) => {
    const { key1, key2, values } = queryGenerator.insertFields(body);
    return querydb.query(`INSERT INTO public.questions (${key1}, user_id) VALUES (${key2}, ${userId}) RETURNING *`, values);
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

  getAll: userId => querydb.query("SELECT * FROM get_notif_user($1) WHERE res != '[]'::jsonb", [userId]),
};

export {
  userQuery,
  meetupQuery,
  questionQuery,
  commentsQuery,
  rsvpsQuery,
  notificationsQuery,
};
