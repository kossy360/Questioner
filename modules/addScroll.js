class AddScroll {
  constructor(parent, child, identifier, width) {
    this.parent = parent;
    this.child = child;
    this.identifier = identifier;
    this.active = false;
    this.scroll = false;
    this.scrollHeight = 0;
    this.scrollWidth = width;
    this.childPadding;

    this.newParent = document.createElement('div');
    this.newParent.className = 'add-scroll-parent';
    parent.parentElement.insertBefore(this.newParent, parent);
    this.newParent.appendChild(parent);

    child.style.width = '100%';
    child.style.height = 'auto';
    child.style.position = 'initial';
    parent.style['overflow-y'] = 'scroll';
    this.newParent.style.overflow = 'hidden';
    this.newParent.style.width = child.offsetWidth;
    this.newParent.style.position = 'relative';

    this.scrollBar = document.createElement('div');
    this.scrollBar.className = identifier;
    this.newParent.appendChild(this.scrollBar);
    this.scrollBar.style.position = 'absolute';
    this.scrollBar.style.right = '0';
    this.scrollBar.style.width = width;
    this.scrollBar.style.top = '0';

    this.pHeight = this.newParent.offsetHeight;
    this.cHeight = this.newParent.offsetHeight;
    this.scrollHeight = 0;
    this.scrollDistance = 0;
    this.overflow = 0;

    this.ratio1 = 0;
    this.ratio2 = 0;
  }

  calculate() {
    this.newParent.style.width = `${this.parent.clientWidth}px`;
    this.pHeight = this.newParent.offsetHeight;
    this.cHeight = this.child.offsetHeight;
    this.scrollHeight = `${((this.pHeight * this.pHeight)/this.cHeight)}`;
    this.scrollBar.style.height = `${this.scrollHeight}px`;
    this.scrollDistance = this.pHeight - this.scrollHeight;
    this.overflow = this.cHeight - this.pHeight;
  }

  addScroll() {
    this.child.style['padding-right'] = this.scrollWidth;
    this.scrollBar.style.width = this.scrollWidth;
  }

  removeScroll() {
    this.child.style.paddingRight = '0px';
    this.scrollBar.style.width = '0px';
  }

  initialize() {
    if (!this.scroll) {
      this.parent.addEventListener('scroll', e => this.scrollMove());
      window.addEventListener('resize', e => this.calculate());
    }
    if (this.child.offsetHeight < this.parent.offsetHeight) {
      this.calculate();
      this.removeScroll();
    } else {
      console.log('here')
      this.calculate();
      this.addScroll();
    }
  }

  scrollMove() {
    let scroll = this.parent.scrollTop === 0 ? 1 : this.parent.scrollTop;
    this.ratio1 = scroll / this.overflow;
    this.ratio2 = this.ratio1 * this.scrollDistance;
    if (!this.active) window.requestAnimationFrame(time => this.animate(this.ratio1, 0));
  }

  animate(curr, bef) {
    this.active = true;
    this.scrollBar.style.top = `${this.ratio2}px`;
    if (curr !== bef) window.requestAnimationFrame(time => this.animate(this.ratio1, curr))
    else this.active = false;
  }
}