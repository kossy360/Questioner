/* eslint-disable no-param-reassign */
/* eslint-env browser */
const fetchData = {
  auth: async (action, body, btn) => {
    const old = btn.textContent.slice();
    btn.textContent = '...';
    try {
      const response = await fetch(`https://k-questioner.herokuapp.com/api/v1/auth/${action}`, {
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
};

export default fetchData;
