import fetchData from './fetchData.js';

const populate = (obj) => {
  const counts = document.getElementsByClassName('stat-num');
  Array.prototype.forEach.call(counts, (count) => {
    const pointer = count.getAttribute('pointer');
    if (obj) count.textContent = obj[pointer];
    else count.textContent = 0;
  });
};

const updateStats = async () => {
  try {
    const [data] = await fetchData.getStat();
    populate(data);
  } catch (error) {
    populate(false);
    console.log(error);
  }
};

export default updateStats;
