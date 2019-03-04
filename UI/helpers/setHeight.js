const setHeight = (elem, check) => {
  if (check) elem.style.height = '0px';
  else {
    const { children } = elem;
    let height = 0;
    Array.prototype.forEach.call(children, (child) => {
      height += child.offsetHeight;
    });
    elem.style.height = `${height}px`;
  }
};

export default setHeight;
