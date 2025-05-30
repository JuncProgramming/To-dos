const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
const todoHeaderText = document.getElementById('todo-text');
const doneHeaderText = document.getElementById('done-text');
const form = document.getElementById('item-form');
const textField = document.getElementById('item-input');
const submitBtn = document.getElementById('submit');

const updateHeadersTexts = () => {
  if(todoList.childElementCount === 0) {
    todoHeaderText.style.display = 'none'
  } else {
    todoHeaderText.style.display = 'block'
    todoHeaderText.innerText = `To do - ${todoList.childElementCount}`
  }
  if(doneList.childElementCount === 0) {
    doneHeaderText.style.display = 'none'
  } else {
    doneHeaderText.style.visibility = 'block'
    doneHeaderText.innerText = `Done - ${doneList.childElementCount}`
  }
  
}

const onAdd = (itemClass, listType, icon) => {
  const userText = textField.value;
  if (userText.trim().length === 0) {
    return
  }
  const todo = document.createElement('li');
  const text = document.createTextNode(userText);
  const iconGroup = document.createElement('div');
  iconGroup.classList.add('icon-group');
  todo.classList.add(itemClass);
  todo.appendChild(text);
  todo.appendChild(iconGroup);

  const checkBtn = document.createElement('button');
  const check = document.createElement('i');
  check.classList.add('fa-solid', 'fa-circle-check');
  checkBtn.appendChild(check);
  iconGroup.appendChild(checkBtn);

  const trashBtn = document.createElement('button');
  const trash = document.createElement('i');
  trash.classList.add('fa-solid', icon);
  trashBtn.appendChild(trash);
  iconGroup.appendChild(trashBtn);

  const penBtn = document.createElement('button');
  const pen = document.createElement('i');
  pen.classList.add('fa-solid', 'fa-pen');
  penBtn.appendChild(pen);
  iconGroup.appendChild(penBtn);

  listType.appendChild(todo);
  updateHeadersTexts()
};

const onTodoAdd = (e) => {
  e.preventDefault();
  onAdd('todo-list-item', todoList, 'fa-trash');
  textField.value = '';
  textField.focus();
};

const onDoneAdd = () => {
  onAdd('done-list-item', doneList, 'fa-rotate-left');
};


function init() {
  form.addEventListener('submit', onTodoAdd);
  updateHeadersTexts()
}

init()