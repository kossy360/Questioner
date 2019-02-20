/* eslint-disable prefer-destructuring */
import { elementCreator } from './element-creator.js';

class DatePicker {
  constructor(inputContainer, container, date, minDate, maxDate, callback) {
    this.container = container;
    this.inputContainer = inputContainer;
    this.callback = callback;
    this.yearCheck = false;
    this.monthCheck = false;
    this.date = new Date(date || Date.now());
    this.day = this.date.getDate();
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();
    this.minDate = new Date(minDate || new Date().toLocaleDateString());
    this.maxDate = new Date(maxDate || '2030/12/31');
    this.initial();
    this.start();
  }

  start() {
    this.input = document.createElement('div');
    this.input.className = 'input-box';
    this.input.textContent = this.dateObj.fancy;
    this.input.addEventListener('click', () => {
      if (!this.showing) {
        this.showing = true;
        this.display(this.dateObj.iso || null);
      } else {
        this.clear();
        this.showing = false;
      }
    });
    this.inputContainer.appendChild(this.input);
  }

  initial() {
    const obj = {
      day: this.date.getDay(),
      date: this.day,
      month: this.month,
      year: this.year,
    };
    this.outputDate(obj);
  }

  create() {
    const schema = [
      [
        { div: { class: 'main-container' } },
        { div: { class: 'date-move-container year' } },
        { button: { class: 'date-move year-move bwd' } },
        { span: { class: 'date-text year-text', text: this.year } },
        { button: { class: 'date-move year-move fwd' } },
        { div: { class: 'date-move-container month' } },
        { button: { class: 'date-move month-move bwd' } },
        { span: { class: 'date-text month-text', text: this.monthArr[this.month] } },
        { button: { class: 'date-move month-move fwd' } },
        { div: { class: 'day-container' } },
        { div: { class: 'date-containter' } },
        { div: { class: 'button-container' } },
        { button: { class: 'ok-button', text: 'select' } },
        { button: { class: 'cancel-button', text: 'cancel' } },
      ],
      [0, 1, 1, 1, 0, 5, 5, 5, 0, 0, 0, 11, 11],
    ];

    const elements = elementCreator(schema);

    this.dayArr.forEach((day) => {
      const span = document.createElement('span');
      span.textContent = day.slice(0, 3);
      elements[9].appendChild(span);
    });

    elements[2].addEventListener('click', () => this.moveYear(-1));
    elements[4].addEventListener('click', () => this.moveYear(1));
    elements[6].addEventListener('click', () => this.moveMonth(-1));
    elements[8].addEventListener('click', () => this.moveMonth(1));
    elements[12].addEventListener('click', () => this.clear());
    elements[13].addEventListener('click', () => {
      this.clear();
      this.initial();
    });

    this.mainContainer = elements[0];
    this.yearContainer = elements[3];
    this.monthContainer = elements[7];
    this.dateContainer = elements[10];

    this.container.appendChild(elements[0]);
  }

  clear() {
    if (!this.showing) return this;
    this.showing = false;
    this.outputDate(this.activeDate.dateObj);
    this.container.removeChild(this.mainContainer);
    return this;
  }

  display(date, minDate, maxDate) {
    if (date) {
      this.date = new Date(date || Date.now());
      this.day = this.date.getDate();
      this.month = this.date.getMonth();
      this.year = this.date.getFullYear();
    }
    if (minDate) this.minDate = new Date(minDate || Date.now());
    if (maxDate) this.maxDate = new Date(maxDate || '2030/12/31');
    this.initial();
    if (this.showing) {
      this.create();
      this.init();
    }
  }

  populateMonth(year = this.year) {
    let day = new Date(`${year}`).getDay();
    const array = [];
    const months = [31, year % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    months.forEach((count, month) => {
      const container = document.createElement('div');
      container.className = 'day-box';
      array.push(container);
      for (let i = 0; i < count; i += 1) {
        const span = document.createElement('span');
        span.className = 'day-num';
        span.textContent = i + 1;
        span.dateObj = {
          day, year, month, date: i + 1,
        };
        if (i === 0) span.style.gridColumnStart = day + 1;
        day += 1;
        if (day > 6) day = 0;
        container.appendChild(span);
      }
    });
    return array;
  }

  init(year = null) {
    while (this.dateContainer.hasChildNodes()) {
      this.dateContainer.removeChild(this.dateContainer.firstChild);
    }
    this.activeYear = this.populateMonth(`${year || this.year}`);
    this.activeYear.forEach((month, index) => {
      this.dateContainer.appendChild(month);
      const { children } = month;

      if (index === this.month) {
        month.classList.add('active');
        this.activeMonth = month;
        const child = children[this.day - 1];
        if (this.date.getFullYear() === this.year && this.date.getMonth() === index) {
          child.classList.add('active');
          this.activeDate = child;
        }
      }

      Array.prototype.forEach.call(children, (child) => {
        child.classList.toggle('invalid', !this.checkDate(child.dateObj));
        child.addEventListener('click', () => {
          if (child.classList.contains('invalid')) return;
          this.activeDate.classList.remove('active');
          child.classList.add('active');
          this.activeDate = child;
          this.outputDate(child.dateObj);
        });
      });
    });
    this.outputDate(this.activeDate.dateObj);
  }

  checkDate({ year, date, month }) {
    const time = new Date(`${year}/${month + 1}/${date}`).getTime();
    return time <= this.maxDate.getTime() && time >= this.minDate.getTime();
  }

  check() {
    this.yearCheck = this.year > this.maxDate.getFullYear()
      || this.year < this.minDate.getFullYear();
    const checkMonth1 = this.year === this.maxDate.getFullYear()
      && this.month > this.maxDate.getMonth();
    const checkMonth2 = this.year === this.minDate.getFullYear()
      && this.month < this.minDate.getMonth();
    this.monthCheck = checkMonth1 || checkMonth2;
  }

  moveMonth(num, reset) {
    this.month = reset ? num : this.month + num;
    this.check();
    if (this.monthCheck && !reset) {
      this.month = this.month - num;
      return;
    }
    if (this.month > 11 || this.month < 0) {
      this.month = this.month < 0 ? 11 : 0;
      if (!reset) this.moveYear(num);
    }
    this.monthContainer.textContent = this.monthArr[this.month];
    this.activeMonth.classList.remove('active');
    this.activeYear[this.month].classList.add('active');
    this.activeMonth = this.activeYear[this.month];
  }

  moveYear(num) {
    this.year = this.year + num;
    this.check();
    if (this.monthCheck) {
      this.moveMonth(num > 0 ? this.maxDate.getMonth() : this.minDate.getMonth(), 1);
    }
    if (this.yearCheck) {
      this.year = this.year - num;
      return;
    }
    this.init(this.year);
    this.yearContainer.textContent = this.year;
  }

  outputDate({
    day, date, month, year,
  }) {
    this.dayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.monthArr = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const ext = (num) => {
      const numStr = num.toString();
      const { length } = numStr;
      if (numStr[length - 1] === '1' && numStr[length - 2] !== '1') return 'st';
      if (numStr[length - 1] === '2' && numStr[length - 2] !== '1') return 'nd';
      if (numStr[length - 1] === '3' && numStr[length - 2] !== '1') return 'rd';
      return 'th';
    };

    const numC = num => (num < 10 ? `0${num}` : num);

    this.dateObj = {
      fancy: `${this.dayArr[day]}, ${date}${ext(date)} ${this.monthArr[month]} ${year}`,
      iso: `${year}-${numC(month + 1)}-${numC(date)}`,
    };

    if (this.input) this.input.textContent = this.dateObj.fancy;
    if (this.callback) this.callback(this.dateObj);
  }
}

export default DatePicker;
