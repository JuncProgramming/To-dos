const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
const todoHeaderText = document.getElementById('todo-text');
const doneHeaderText = document.getElementById('done-text');
const form = document.getElementById('item-form');
const textField = document.getElementById('item-input');
const submitBtn = document.getElementById('submit');
const icon = submitBtn.querySelector('i');
const clearBtn = document.getElementById('clear-all');
const spacer = document.querySelector('hr');

let isEditMode = false;
let editTarget = null;
let originalId = null;
let originalText = null;

const updateUI = () => {
  todoList.childElementCount === 0
    ? (todoHeaderText.style.display = 'none')
    : (todoHeaderText.style.display = 'block');
  todoHeaderText.innerText = `To do - ${todoList.childElementCount}`;
  doneList.childElementCount === 0
    ? (doneHeaderText.style.display = 'none')
    : (doneHeaderText.style.display = 'block');
  doneHeaderText.innerText = `Done - ${doneList.childElementCount}`;
  todoList.childElementCount === 0 && doneList.childElementCount === 0
    ? ((clearBtn.style.display = 'none'), (spacer.style.display = 'none'))
    : ((clearBtn.style.display = 'block'), (spacer.style.display = 'block'));
};

const addOrEditItem = () => {
  const icon = submitBtn.querySelector('i');
  const items = getItems();
  if (isEditMode) {
    icon.style.color = '#8b51ce';
    submitBtn.style.backgroundColor = '#200f33';
    icon.classList.replace('fa-plus', 'fa-pen-to-square');
    const newText = textField.value.trim();
    if (newText.length === 0) {
      isEditMode = false;
      editTarget = null;
      originalId = null;
      originalText = null;
      textField.value = '';
      icon.style.color = '#8b51ce';
      submitBtn.style.backgroundColor = '#200f33';
      icon.classList.replace('fa-pen-to-square', 'fa-plus');
      updateUI();
      return;
    }

    const updatedItems = items.map((item) =>
      item.id == originalId ? { ...item, text: newText } : item
    );

    saveItems(updatedItems);
    loadItems();
    icon.style.color = '#8b51ce';
    submitBtn.style.backgroundColor = '#200f33';
    icon.classList.replace('fa-pen-to-square', 'fa-plus');
    isEditMode = false;
    editTarget = null;
    originalId = null;
    originalText = null;
    textField.value = '';
    return;
  } else {
    const userText = textField.value.trim();
    if (userText.length === 0) return;

    items.push({ id: Date.now(), text: userText, status: 'todo' });
    saveItems(items);
    loadItems();

    icon.style.color = '#8b51ce';
    submitBtn.style.backgroundColor = '#200f33';
    icon.classList.replace('fa-pen-to-square', 'fa-plus');
    textField.value = '';
  }
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  addOrEditItem();
  textField.value = '';
  textField.focus();
};

const saveItems = (items) => {
  localStorage.setItem('items', JSON.stringify(items));
};

const getItems = () => {
  const items = localStorage.getItem('items');
  return items ? JSON.parse(items) : [];
};

const loadItems = () => {
  todoList.querySelectorAll('li').forEach((item) => {
    item.remove();
  });
  doneList.querySelectorAll('li').forEach((item) => {
    item.remove();
  });
  const items = getItems();

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.text;
    li.dataset.id = item.id;
    li.classList.add(
      item.status === 'todo' ? 'todo-list-item' : 'done-list-item'
    );

    const iconGroup = document.createElement('div');
    iconGroup.classList.add('icon-group');

    const checkBtn = document.createElement('button');
    const check = document.createElement('i');
    check.classList.add(
      'fa-solid',
      item.status === 'todo' ? 'fa-circle-check' : 'fa-rotate-left'
    );
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

    li.appendChild(iconGroup);

    item.status === 'todo'
      ? todoList.appendChild(li)
      : doneList.appendChild(li);
  });

  updateUI();
};

const handleTodoListClick = (e) => {
  const todoLi = e.target.closest('li');
  const id = todoLi.dataset.id;
  let items = getItems();
  if (e.target.classList.contains('fa-circle-check')) {
    todoLi.remove();
    todoLi.classList.replace('todo-list-item', 'done-list-item');
    const icon = todoLi.querySelector('i.fa-circle-check');
    if (icon) {
      icon.classList.replace('fa-circle-check', 'fa-rotate-left');
    }
    doneList.appendChild(todoLi);
    items = items.map((item) =>
      item.id == id ? { ...item, status: 'done' } : item
    );
    saveItems(items);
    updateUI();
  } else if (e.target.classList.contains('fa-trash')) {
    todoLi.remove();
    let items = getItems();
    items = items.filter((item) => item.id != id);
    saveItems(items);
    updateUI();
  } else if (e.target.classList.contains('fa-pen')) {
    icon.style.color = '#200f33';
    submitBtn.style.backgroundColor = '#8b51ce';
    icon.classList.replace('fa-plus', 'fa-pen-to-square');
    originalId = id;
    isEditMode = true;
    editTarget = todoLi;
    textField.value = todoLi.firstChild.textContent;
  }
};

const handleDoneListClick = (e) => {
  const doneLi = e.target.closest('li');
  const id = doneLi.dataset.id;
  let items = getItems();
  if (e.target.classList.contains('fa-rotate-left')) {
    doneLi.remove();
    doneLi.classList.replace('done-list-item', 'todo-list-item');
    const icon = doneLi.querySelector('i.fa-rotate-left');
    if (icon) {
      icon.classList.replace('fa-rotate-left', 'fa-circle-check');
    }
    todoList.appendChild(doneLi);
    items = items.map((item) =>
      item.id == id ? { ...item, status: 'todo' } : item
    );
    saveItems(items);
    updateUI();
  } else if (e.target.classList.contains('fa-trash')) {
    doneLi.remove();
    let items = getItems();
    items = items.filter((item) => item.id != id);
    saveItems(items);
    updateUI();
  } else if (e.target.classList.contains('fa-pen')) {
    icon.style.color = '#200f33';
    submitBtn.style.backgroundColor = '#8b51ce';
    icon.classList.replace('fa-plus', 'fa-pen-to-square');
    originalId = id;
    isEditMode = true;
    editTarget = doneLi;
    textField.value = doneLi.firstChild.textContent;
  }
};

const handleClearAllClick = () => {
  if (confirm('Are you sure you want to delete every item?')) {
    todoList.querySelectorAll('li').forEach((item) => {
      item.remove();
    });
    doneList.querySelectorAll('li').forEach((item) => {
      item.remove();
    });
    localStorage.removeItem('items');
    updateUI();
  } else {
    console.log(`Nothing's changed! ;)`);
  }
};

function init() {
  loadItems();
  form.addEventListener('submit', handleFormSubmit);
  todoList.addEventListener('click', handleTodoListClick);
  doneList.addEventListener('click', handleDoneListClick);
  clearBtn.addEventListener('click', handleClearAllClick);
}

init();
