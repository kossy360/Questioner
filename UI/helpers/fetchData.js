/* eslint-disable no-param-reassign */
/* eslint-env browser */
const host = 'http://localhost:3000/api/v1/';
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

  meetups: async () => {
    try {
      const response = await fetch(`${host}meetups`, {
        method: 'get',
        headers: {
          'content-type': 'application/json',
          auth: window.sessionStorage.getItem('token'),
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
};

export default fetchData;
