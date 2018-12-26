/* import {
  meetCreator,
  notifCreator,
  bookCreator,
  questionCreator,
  commentBoxCreator,
  commentCreator
} from './modules/element-creator.js';

import {
  data
} from './modules/dummy-data.js'; */

const nav = document.querySelector('nav');
const content = document.querySelector('.content-container');
const tabSelector = document.getElementsByClassName('tab-selector');
const tabs = document.getElementsByClassName('main-section');
const meetExpanded = document.getElementById('meet-expanded');
const meetContainer = document.getElementsByClassName('meet-container');
const votebtns = document.getElementsByClassName('vote-btn');
const loop = Array.prototype.forEach;

const scroll = () => {
  let scr = window.scrollY;
  if (scr >= 130) {
    if (nav.classList.contains('top-fix')) return;
    nav.classList.add('top-fix');
    content.classList.add('nav-fixed');
    loop.call(tabs, tab => {
      tab.classList.add('nav-fixed');
    })
  } else {
    if (nav.classList.contains('top-fix')) nav.classList.remove('top-fix');
    content.classList.remove('nav-fixed');
    loop.call(tabs, tab => {
      tab.classList.remove('nav-fixed');
    })
  }
}

const swith = e => {
  let showing = document.querySelector('.section-showing');
  //if (showing === e) return;
  showing.classList.toggle('section-showing');

  let pos = Array.prototype.indexOf.call(tabSelector, e);
  if (pos === -1) pos = e;
  tabs[pos].classList.add('section-showing');
}

loop.call(tabSelector, elem => {
  elem.addEventListener('click', e => {
    swith(elem);
    let active = document.querySelector('.tab-active');
    if (active === elem) return;
    active.classList.remove('tab-active');
    elem.classList.add('tab-active');
  });
})

loop.call(meetContainer, e => {
  e.addEventListener('click', e => {
    swith(4)
    expandMeet();
  });
})

const notifContol = notif => {
  notif.addEventListener('click', e => {
    e.stopPropagation();
    notif.classList.toggle('yes', !notif.classList.contains('yes'))
  })
}

const voteControl = (voteBtn, index, array) => {
  voteBtn.calc = x => {
    let num = voteBtn.action;
    voteBtn.qObj.votes += x === 0 ? -num : num;
    voteBtn.parentElement.lastChild.textContent = voteBtn.qObj.votes;
  }

  voteBtn.addEventListener('click', e => {
    if (voteBtn.classList.contains('active')) {
      voteBtn.classList.remove('active');
      voteBtn.calc(0);
    } else {
      voteBtn.classList.add('active');
      voteBtn.calc(1);
      let enemy = array[index === 0 ? 1 : 0];
      if (enemy.classList.contains('active')) {
        enemy.classList.remove('active');
        enemy.calc(0);
      }
    }
  })
}

const rsvpControl = (rsvps, box) => {
  rsvps.forEach(elem => {
    elem.addEventListener('click', e => {
      e.stopPropagation();
      if (elem.classList.contains('active')) return;
      rsvps.forEach(enemy => enemy.classList.remove('active'))
      elem.classList.add('active');

      if (!elem.classList.contains('yes')) {
        if (box) box.parentElement.removeChild(box)
      } else addBook(data.rsvps[0]);
    })
  })
}

const commentBtnControl = commentBtns => {
  commentBtns.forEach(commentBtn => {
    commentBtn.addEventListener('click', e => {
      let box = commentBtn.box.comment;
      console.log(box);
      if (commentBtn.classList.contains('collapsed')) {
        if (!box) {
          addComments(commentBtn.action, commentBtn.box)
        }
        commentBtn.classList.replace('collapsed', 'expanded');
        if (box) box.classList.add('showing');
      } else {
        commentBtn.classList.replace('expanded', 'collapsed');
        box.classList.remove('showing');
      }
    })
  })
}

const askBtnControl = ask => {
  ask.addEventListener('click', e => {
    const questObj = {
      id: 1,
      createdOn: '11/11/11',
      createdBy: 1,
      username: 'kossy360',
      meetup: 1,
      body: ask.input.value,
      votes: 0,
      comments: false
    }
    //posts and waits for response
    addQuestion(ask.box, {
      data: [questObj]
    });
    ask.input.value = '';
  })
}

const replyBtnControl = btns => {
  btns.forEach(btn => {
    btn.addEventListener('click', e => {
      btn.input.value = `@${btn.author}${btn.input.value}`;
      btn.input.focus();
    })
  })
}

const imageInputControl = (container, input, imagee, action, data = null) => {
  if (!input.url) input.url = [];
  if (action === 1) {
    while (container.hasChildNodes()) container.removeChild(container.firstChild);
    input.url = [];
    if (!data) return;
  }

  let files = data ? data : input.files;
  loop.call(files, img => {
    let image = imagee || document.createElement('img'),
      url = typeof img === 'string' ? img : window.URL.createObjectURL(img);
    image.src = url;
    input.url.push(url);
    if (imagee) return;
    container.appendChild(image);
    document.getElementById('profile-picture').src = url;
  })
}

const addMeet = data => {
  const [main, rsvps, notif] = meetCreator(document.querySelector('#meets-section'), data)
  
  main.data = data;
  main.addEventListener('click', e => {
    expandMeet(data)
    swith(4)
  });

  rsvpControl(rsvps);
  notifContol(notif);
}

const addNotif = data => {
  notifCreator(document.querySelector('#notif-section'), data);
}

const addBook = booked => {
  const container = document.getElementById('booked-section'),
    [main, qbox, btn, rsvps, notif] = bookCreator(container, booked);

  btn.addEventListener('click', e => {
    if (btn.classList.contains('collapsed')) {
      if(!qbox.classList.contains('populated')) {
        addBookQuestions(main.meetup, qbox)
      }
      btn.classList.replace('collapsed', 'expanded');
      qbox.classList.add('showing');
    } else {
      btn.classList.replace('expanded', 'collapsed');
      qbox.classList.remove('showing');
    }
    btn.textContent = btn.classList.contains('expanded') ? 'collapse' : 'expand';
  })

  notifContol(notif);
  rsvpControl (rsvps, main)
}

const addBookQuestions = (id, box) => {
  //get data with id
  const voteCount = bookQuestionCreator(box, data.questions);
  box.classList.add('populated');
  return voteCount;
}

const expandMeet = (meetData) => {
  const container = document.getElementById('meet-expanded-container');
  
  while (container.hasChildNodes()) container.removeChild(container.lastChild);

  const [box, rsvps, notif] = meetCreator(container, meetData);

  if (meetData.images.length > 0) {
    const imgBtn = imageCreator(meetData.images, container);
    imgBtnControl(imgBtn);
  }

  const [main, ask, voteArray, commentBtns] = questionContainerCreator(container, data.questions);

  rsvpControl(rsvps);
  notifContol(notif);
  askBtnControl(ask);

  voteArray.forEach(voteBtns => {
    voteBtns.forEach(voteControl);
  });

  commentBtnControl(commentBtns);
}

const addQuestion = (box, question) => {
  
  const [voteArray, commentBtns] = questionCreator(box, question.data);
  
  voteArray.forEach(voteBtns => {
    voteBtns.forEach(voteControl);
  });

  commentBtnControl(commentBtns);
}

const addComments = (id, box) => {
  //get data with id
  const [addComment, input, replyBtns] = commentBoxCreator(box, data.comments);

  addComment.addEventListener('click', e => {
    if(input.value === '') return;
    let data = {
      id: 0,
      createdOn: new Date().toLocaleDateString(),
      createdBy: 1,
      username: 'tester',
      question: 1,
      body: input.value,
    }
    input.value = '';
    let replyBtn = commentCreator(addComment.box, data);

    replyBtn.forEach(btn => btn.input = input);
    replyBtnControl(replyBtn);
  })

  replyBtns.forEach(btn => btn.input = input);
  replyBtnControl(replyBtns);

  box.classList.add('populated');
}

const populate = () => {
  data.meetups.forEach(meet => {
    addMeet(meet);
  })

  data.notifications.forEach(notif => {
    addNotif(notif);
  })

  data.rsvps.forEach(rsvp => {
    addBook(rsvp);
  })
}

function populateMeet () {
  for (let i = 0; i < 3; i++) {
    document.querySelector('#meets-section').appendChild(meetDataCreator());
    document.querySelector('#notif-section').appendChild(notifCreator());
    document.querySelector('#booked-section').appendChild(bookCreator());
  }

}

//populateMeet();

const populateProfile = () => {
  const inputFields = document.getElementsByClassName('profile-input');
  const editBtns = document.getElementsByClassName('profile-edit-button');

  loop.call(inputFields, elem => {
    elem.value = data.user[elem.getAttribute('pointer')]
  })

  loop.call(editBtns, elem => {
    elem.addEventListener('click', e => {
      let input = document.getElementById(elem.getAttribute('input'));
      input.disabled = elem.classList.contains('active');
      elem.innerHTML = input.disabled ? 'edit' : 'ok';
      elem.classList.toggle('active', !input.disabled);
      if (!input.disabled) input.focus();
    })
  })
}

document.getElementById('profile-picture-input')
  .addEventListener('change', e => {
    const input = document.getElementById('profile-picture-input'),
      img = document.getElementById('profile-picture')
    imageInputControl(null, input, img)
    document.getElementById('profile-icon')
      .src = input.url[0];
  })

populateProfile()

window.addEventListener('load', e => populate())

window.addEventListener('scroll', scroll)