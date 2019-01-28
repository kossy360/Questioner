/* eslint-disable no-param-reassign */
import validator from '../helpers/validator';
import createError from '../helpers/createError';
import { meetupQuery } from '../db/querydata';

const convertTags = (value) => {
  if (value instanceof Array) return value;
  return value.replace(/ +/g, '').split(',');
};

const control = {
  searchTags: async (value, body, req) => {
    if (!value) return;
    const tags = convertTags(value);
    const { rows, rowCount } = await meetupQuery
      .search('tags', tags, req.decoded.user, req.decoded.isAdmin);
    const obj = { value: tags };
    if (rowCount > 0) obj.result = rows;
    else obj.message = 'there are no meetup records matching your search parameters';
    body.tags = obj;
  },

  searchTopic: async (value, body, req) => {
    if (!value) return;
    const { rows, rowCount } = await meetupQuery
      .search('topic', `%${value}%`, req.decoded.user, req.decoded.isAdmin);
    const obj = { value };
    if (rowCount > 0) obj.result = rows;
    else obj.message = 'there are no meetup records matching your search parameters';
    body.topic = obj;
  },

  search: async (req, res) => {
    try {
      const result = {};
      const { tags, topic } = await validator(req.body, 'meetSearch');
      await control.searchTags(tags, result, req);
      await control.searchTopic(topic, result, req);
      res.status(200).json({ status: 200, data: [result] });
    } catch (error) {
      if (error.isJoi) createError(422, res, error.details[0].message.replace(/"/g, ''));
      else createError(500, res);
    }
  },
};

export default control;
