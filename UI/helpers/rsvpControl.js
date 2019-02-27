import fetchData from './fetchData.js';

class RsvpControl {
  constructor(yes, maybe, no, id, value, bkCntrl, meetup) {
    this.yes = yes;
    this.maybe = maybe;
    this.no = no;
    this.id = id;
    this.value = value || 'clear';
    this.active = false;
    this.bkCntrl = bkCntrl;
    this.meetup = meetup;
  }

  newVal(rsvp) {
    if (this.active) return;
    this.active = true;
    let newrsvp;
    if (this.value === rsvp) newrsvp = 'clear';
    else newrsvp = rsvp;
    if (this.value !== 'clear') this[this.value].classList.add('loading');
    this.setRsvp(newrsvp);
  }

  updateMeetup(response) {
    if (!this.meetup) return;
    this.meetup.rsvp = response;
  }

  updateRsvp(response) {
    if (response === this.value) return;
    if (this.value !== 'clear') {
      this[this.value].classList.remove('loading');
      this[this.value].classList.remove('active');
    }
    this.value = response;
    this.updateMeetup(response);
    if (response !== 'clear') this[response].classList.add('active');
    if (response === 'yes') this.bkCntrl(this.meetup);
    const containers = document.querySelectorAll(`#rsvp-${this.id}`);
    Array.prototype.forEach.call(containers, (elem) => {
      elem.control.updateRsvp(response);
    });
  }

  async setRsvp(response) {
    try {
      await fetchData.rsvp(this.id, { response });
      this.updateRsvp(response);
      this.active = false;
    } catch (error) {
      if (response !== 'clear') this[this.value].classList.remove('loading');
      console.log(error);
    }
  }
}

export default RsvpControl;
