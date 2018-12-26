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
const createBtn = document.querySelector('.meet-create-button');
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

loop.call(document.getElementsByClassName('create-button'), button => {
  const id = button.id;
  if (id === 'meet-create-button') {
    button.addEventListener('click', e => {
      createMeet();
    })
  } else if (id === 'meet-create-edit') {
    button.addEventListener('click', e => {
      editMeet();
    })
  } else {
    button.addEventListener('click', e => {
      clearInputs();
      tabSelector[0].click();
      editMeet(false);
    })
  }
})

const toggleOrganizer = title => {
  const head = document.querySelector('.organizer-header');
  head.innerHTML = title;
}

const populateEdit = (data) => {
  const container = document.querySelector(".meet-selected-container");
  const inputFields = document.getElementsByClassName('meet-create-input');
  loop.call(inputFields, input => {
    pointer = input.getAttribute('pointer');
    if (pointer === 'tags') {
      input.value = data[pointer].join(', ');
    }
    else if (pointer === 'images') {
      imageInputControl(container, input, null, 1, data[pointer]);
    } else input.value = data[pointer];
  })
}

const imageInputControl = (container, input, imagee, action, data = null) => {
  if (!input.url) input.url = [];
  if (action === 1) {
    while(container.hasChildNodes()) container.removeChild(container.firstChild);
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

document.getElementById('meet-picture-input')
  .addEventListener('change', e => {
    const container = document.querySelector(".meet-selected-container"),
      input = document.getElementById('meet-picture-input');
    imageInputControl(container, input, null)
  });

const getData = (inputClass, data) => {
  const inputFields = document.getElementsByClassName(inputClass),
    obj = data || {};
  loop.call(inputFields, input => {
    pointer = input.getAttribute('pointer');
    if (pointer === 'tags') {
      obj[pointer] = input.value.replace(/ /g, '').split(',');
    } 
    else if (pointer === 'images') {
      obj[pointer] = input.url;
      console.log(input.url)
    }
    else obj[pointer] = input.value;
  });
  return obj;
}

const editMeet = (data) => {
  const container = document.querySelector('.meet-create-button-container');  
  if (data) {
    container.classList.add('edit');
    toggleOrganizer(data.title);
    container.meet = data
    populateEdit(data);
    tabSelector[2].click();
  } else {
    //verify inputs
    if (data !== false) {
      const obj = getData('meet-create-input', container.meet);
      addMeet(obj, true)
    }
    //send patch request
    tabSelector[0].click();
    container.classList.remove('edit');
    toggleOrganizer('New Meet')
  }
}

const createMeet = () => {
  const obj = getData('meet-create-input'),
    dummyData = {id: 1, rsvp: {yes: 0, maybe: 0, no: 0}, questions: 0}
  // send post request
  obj.id = dummyData.id;
  obj.rsvp = dummyData.rsvp;
  obj.questions = dummyData.questions;
  addMeet(obj);
  tabSelector[0].click;
  clearInputs();
} 

const clearInputs = () => {
  loop.call(document.getElementsByClassName('meet-create-input'), input => {
    input.value = '';
    const container = document.querySelector(".meet-selected-container");
    while (container.hasChildNodes()) container.removeChild(container.firstChild);
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

const meetControl = (container, edit, cancel) => {
  edit.addEventListener('click', e => {
    e.stopPropagation();
    editMeet(container.data);
  })

  cancel.addEventListener('click', e => {
    e.stopPropagation();
    container.parentElement.removeChild(container);
    tabSelector[0].click();
  })
}

const notifContol = notif => {
  notif.addEventListener('click', e => {
    e.stopPropagation();
    notif.classList.toggle('yes', !notif.classList.contains('yes'))
  })
}

const imgBtnControl = imgBtn => {
  console.log(imgBtn.boxArray)
  const [parent, child1, child2] = imgBtn.boxArray;
  imgBtn.addEventListener('click', e => {
    if (parent.classList.contains('showing')) {
      parent.classList.remove('showing');
      imgBtn.classList.remove('expanded');
    } else {
      parent.classList.add('showing');
      imgBtn.classList.add('expanded');
    }
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

const commentBtnControl = commentBtn => {
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
}

const replyBtnControl = btns => {
  btns.forEach(btn => {
    btn.addEventListener('click', e => {
      btn.input.value = `@${btn.username}${btn.input.value}`;
      btn.input.focus();
    })
  })
}

const addMeet = (data, replace = false) => {
  const container = replace ? Array.prototype
    .find.call(document.getElementsByClassName('meet-container'), meet => Number(meet.id) === data.id) : null,
    [main, edit, cancel] = meetCreator(document.querySelector('#meets-section'), data, container);

  main.addEventListener('click', e => {
    expandMeet(data)
    swith(4);
  });

  meetControl(main, edit, cancel);
}

const addNotif = data => {
  notifCreator(document.querySelector('#notif-section'), data);
}

const expandMeet = (meetData, question) => {
  const container = document.getElementById('meet-expanded-container');

  while (container.hasChildNodes()) container.removeChild(container.lastChild);

  const [box, edit, cancel] = meetCreator(container, meetData);

  if (meetData.images.length > 0) {
    const imgBtn = imageCreator(meetData.images, container);
    imgBtnControl(imgBtn);
  }

  meetControl(meetData, edit, cancel);
  const [main, ask, voteArray, commentBtns] = questionContainerCreator(container, data.questions);
  
  askBtnControl(ask);
  
  voteArray.forEach(voteBtns => {
    voteBtns.forEach(voteControl);
  });
  
  commentBtns.forEach(commentBtn => {
    commentBtnControl(commentBtn);
  })
}

const addQuestion = (box, question) => {
  
  const [voteArray, commentBtn] = questionCreator(box, question.data);
  
  voteArray.forEach(voteBtns => {
    voteBtns.forEach(voteControl);
  });

  commentBtnControl(commentBtn[0]);
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

    replyBtn.input = input;
    replyBtnControl([replyBtn]);
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
}

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

populateProfile();

window.addEventListener('load', e => populate())

window.addEventListener('scroll', scroll)