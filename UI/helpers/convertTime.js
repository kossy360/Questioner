/* eslint-disable no-confusing-arrow */
const convertTime = (timestamp) => {
  const dateobj = new Date(timestamp);
  const numC = num => num < 10 ? `0${num}` : num;
  const time = `${numC(dateobj.getHours())}:${numC(dateobj.getMinutes())}`;
  const date = dateobj.toLocaleDateString().replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, '$3/$2/$1');
  return { time, date };
};

export default convertTime;
