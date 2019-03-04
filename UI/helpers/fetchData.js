/* eslint-disable no-param-reassign */
/* eslint-env browser */
const host = 'https://k-questioner.herokuapp.com/api/v1/';
const token = window.sessionStorage.getItem('token');
const fetchData = {
  auth: async (action, body, btn) => {
    const old = btn.textContent.slice();
    btn.textContent = '...';
    try {
      const response = await fetch(`${host}auth/${action}`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.status >= 400) throw data;
      return data;
    } catch (error) {
      btn.textContent = old;
      throw error;
    }
  },

  updateUser: async (body) => {
    try {
      const response = await fetch(`${host}users`, {
        method: 'PATCH',
        headers: {
          'x-access-token': token,
        },
        body,
      });
      const data = await response.json();
      if (!response.ok || data.message) throw data;
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async (userId) => {
    try {
      const response = await fetch(`${host}users/profile/${userId}`, {
        method: 'get',
        headers: {
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  getStat: async () => {
    try {
      const response = await fetch(`${host}users/stats`, {
        method: 'get',
        headers: {
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (data.status >= 400) throw data;
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  meetups: async () => {
    try {
      const response = await fetch(`${host}meetups`, {
        method: 'get',
        headers: {
          'content-type': 'application/json',
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (data.status >= 400) throw data;
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  upcoming: async () => {
    try {
      const response = await fetch(`${host}meetups/upcoming`, {
        method: 'get',
        headers: {
          'content-type': 'application/json',
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (data.status >= 400) throw data;
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  search: async (body) => {
    try {
      const response = await fetch(`${host}meetups/search`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.status >= 400) throw data;
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  rsvp: async (id, body) => {
    try {
      const response = await fetch(`${host}meetups/${id}/rsvps`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.status >= 400) throw data;
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  createMeet: async (body) => {
    try {
      const response = await fetch(`${host}meetups`, {
        method: 'post',
        headers: {
          'x-access-token': token,
        },
        body,
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  updateMeet: async (body, id) => {
    try {
      const response = await fetch(`${host}meetups/${id}`, {
        method: 'PATCH',
        headers: {
          'x-access-token': token,
        },
        body,
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteMeetup: async (id) => {
    try {
      const response = await fetch(`${host}meetups/${id}`, {
        method: 'delete',
        headers: {
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.message;
    } catch (error) {
      throw error;
    }
  },

  questions: async (meetId) => {
    try {
      const response = await fetch(`${host}questions/${meetId}`, {
        method: 'get',
        headers: {
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.data || data.message;
    } catch (error) {
      throw error;
    }
  },

  vote: async (questionId, vote) => {
    try {
      const response = await fetch(`${host}questions/${questionId}/${vote}`, {
        method: 'PATCH',
        headers: {
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.data || data.message;
    } catch (error) {
      throw error;
    }
  },

  createQuestion: async (body) => {
    try {
      const response = await fetch(`${host}questions`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.data || data.message;
    } catch (error) {
      throw error;
    }
  },

  comments: async (question) => {
    try {
      const response = await fetch(`${host}comments/${question}`, {
        method: 'get',
        headers: {
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.data || data.message;
    } catch (error) {
      throw error;
    }
  },

  createComment: async (body) => {
    try {
      const response = await fetch(`${host}comments`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.data || data.message;
    } catch (error) {
      throw error;
    }
  },

  notifications: async () => {
    try {
      const response = await fetch(`${host}notifications`, {
        method: 'get',
        headers: {
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.data || data.message;
    } catch (error) {
      throw error;
    }
  },

  reset: async (meetup) => {
    try {
      const response = await fetch(`${host}notifications/${meetup}/reset`, {
        method: 'PATCH',
        headers: {
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.message;
    } catch (error) {
      throw error;
    }
  },

  clear: async (meetup) => {
    try {
      const response = await fetch(`${host}notifications/${meetup}/clear`, {
        method: 'delete',
        headers: {
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.message;
    } catch (error) {
      throw error;
    }
  },

  register: async (meetup) => {
    try {
      const response = await fetch(`${host}notifications/${meetup}/register`, {
        method: 'post',
        headers: {
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data.message;
    } catch (error) {
      throw error;
    }
  },
};

export default fetchData;
