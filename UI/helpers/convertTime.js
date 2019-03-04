/* eslint-disable no-confusing-arrow */
const convertTime = (timestamp) => {
  const dateobj = new Date(timestamp);
  const numC = num => num < 10 ? `0${num}` : num;
  const time = `${numC(dateobj.getHours())}:${numC(dateobj.getMinutes())}`;
  const date = dateobj.toLocaleDateString().replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, '$3/$2/$1');
  return { time, date };
};

const fancyTime = (time) => {
  let diff = Math.floor((Date.now() - new Date(time).getTime()) / 1000);
  const reduce = (val) => {
    diff = Math.floor(diff / val);
  };

  if (diff < 1) return 'less than a second ago';
  if (diff < 60) return `${diff} second${diff > 1 ? 's' : ''} ago`;
  reduce(60);
  if (diff < 60) return `${diff} minute${diff > 1 ? 's' : ''} ago`;
  reduce(60);
  if (diff < 24) return `${diff} hour${diff > 1 ? 's' : ''} ago`;
  reduce(24);
  if (diff < 7) return `${diff} day${diff > 1 ? 's' : ''} ago`;
  return convertTime(time).date;
};

export {
  convertTime,
  fancyTime,
};
