const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
const todoHeaderText = document.getElementById('todo-text');
const doneHeaderText = document.getElementById('done-text');
const form = document.getElementById('item-form');
const textField = document.getElementById('item-input');
const submitBtn = document.getElementById('submit');
const clearBtn = document.getElementById('clear-all');
const spacer = document.querySelector('hr');

let isEditMode = false;
let editTarget = null;

const updateUI = () => {
  if (todoList.childElementCount === 0) {
    todoHeaderText.style.display = 'none';
  } else {
    todoHeaderText.style.display = 'block';
    todoHeaderText.innerText = `To do - ${todoList.childElementCount}`;
  }
  if (doneList.childElementCount === 0) {
    doneHeaderText.style.display = 'none';
  } else {
    doneHeaderText.style.display = 'block';
    doneHeaderText.innerText = `Done - ${doneList.childElementCount}`;
  }
  if (todoList.childElementCount === 0 && doneList.childElementCount === 0) {
    clearBtn.style.display = 'none';
    spacer.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    spacer.style.display = 'block';
  }
};

const addOrEditItem = () => {
  if (isEditMode) {
    if (textField.value.trim().length === 0) {
      return;
    } else {
      editTarget.firstChild.textContent = textField.value;
    }
    isEditMode = false;
    editTarget = null;
    textField.value = '';
    updateUI();
    return;
  } else {
    const userText = textField.value;
    if (userText.trim().length === 0) {
      return;
    }
    const todo = document.createElement('li');
    const text = document.createTextNode(userText);
    const iconGroup = document.createElement('div');
    iconGroup.classList.add('icon-group');
    todo.classList.add('todo-list-item');
    todo.appendChild(text);
    todo.appendChild(iconGroup);

    const checkBtn = document.createElement('button');
    const check = document.createElement('i');
    check.classList.add('fa-solid', 'fa-circle-check');
    checkBtn.appendChild(check);
    iconGroup.appendChild(checkBtn);

    const trashBtn = document.createElement('button');
    const trash = document.createElement('i');
    trash.classList.add('fa-solid', 'fa-trash');
    trashBtn.appendChild(trash);
    iconGroup.appendChild(trashBtn);

    const penBtn = document.createElement('button');
    const pen = document.createElement('i');
    pen.classList.add('fa-solid', 'fa-pen');
    penBtn.appendChild(pen);
    iconGroup.appendChild(penBtn);
    todoList.appendChild(todo);
        
    textField.value = '';
    updateUI();
  }
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  addOrEditItem();
  textField.value = '';
  textField.focus();
};

const handleTodoListClick = (e) => {
  const todoLi = e.target.closest('li');
  if (e.target.classList.contains('fa-circle-check')) {
    todoLi.remove();
    todoLi.classList.replace('todo-list-item', 'done-list-item');
    const icon = todoLi.querySelector('i.fa-circle-check');
    if (icon) {
      icon.classList.replace('fa-circle-check', 'fa-rotate-left');
    }
    doneList.appendChild(todoLi);
    updateUI();
  } else if (e.target.classList.contains('fa-trash')) {
    todoLi.remove();
    updateUI();
  } else if (e.target.classList.contains('fa-pen')) {
    isEditMode = true;
    editTarget = todoLi;
    textField.value = todoLi.innerText;
  }
};

const handleDoneListClick = (e) => {
  const doneLi = e.target.closest('li');
  if (e.target.classList.contains('fa-rotate-left')) {
    doneLi.remove();
    doneLi.classList.replace('done-list-item', 'todo-list-item');
    const icon = doneLi.querySelector('i.fa-rotate-left');
    if (icon) {
      icon.classList.replace('fa-rotate-left', 'fa-circle-check');
    }
    todoList.appendChild(doneLi);
    updateUI();
  } else if (e.target.classList.contains('fa-trash')) {
    doneLi.remove();
    updateUI();
  } else if (e.target.classList.contains('fa-pen')) {
    isEditMode = true;
    editTarget = doneLi;
    textField.value = doneLi.innerText;
  }
};

const handleClearAllClick = (e) => {
  if (confirm('Are you sure you want to delete every item?')) {
    todoList.querySelectorAll('li').forEach((item) => {
      item.remove();
    });
    doneList.querySelectorAll('li').forEach((item) => {
      item.remove();
    });
    updateUI();
  } else {
    console.log(`Nothing's changed! ;)`);
  }
};

function init() {
  form.addEventListener('submit', handleFormSubmit);
  todoList.addEventListener('click', handleTodoListClick);
  doneList.addEventListener('click', handleDoneListClick);
  clearBtn.addEventListener('click', handleClearAllClick);
  updateUI();
}

init();
