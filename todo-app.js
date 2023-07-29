(function() {
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

function createTodoItemForm() {
  let form = document.createElement('form');
  let input = document.createElement('input');
  let buttonWrapper = document.createElement('div');
  let button = document.createElement('button');

  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = 'Введите название нового дела';
  buttonWrapper.classList.add('input-group-append');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Добавить дело';
  button.disabled = true;

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  input.addEventListener('input', function() {
    if (input.value) {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  });

  return {
    form,
    input,
    button,
  };
}

function createTodoList() {
  let list = document.createElement('ul');
  list.classList.add('list-group');
  return list;
}

function createTodoItem(todo) {
  let item = document.createElement('li');
  let buttonGroup = document.createElement('div');
  let doneButton = document.createElement('button');
  let deleteButton = document.createElement('button');

  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  item.textContent = todo.name;

  if (todo.done) {
    item.classList.add('list-group-item-success');
  }

  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success');
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Удалить';

  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  return {
    item,
    doneButton,
    deleteButton,
    todo
  };
}

function createTodoApp(container, title = 'Список дел', listName) {

let todoItems = [];

function getTodoItemsFromLocalStorage() {
  return JSON.parse(localStorage.getItem(listName)) || [];
}

function setTodoItemsToLocalStorage() {
  localStorage.setItem(listName, JSON.stringify(todoItems));
}

todoItems = getTodoItemsFromLocalStorage();

let todoAppTitle = createAppTitle(title);
let todoItemForm = createTodoItemForm();
let todoList = createTodoList();

container.append(todoAppTitle);
container.append(todoItemForm.form);
container.append(todoList);

function renderTodoList() {
  todoList.innerHTML = '';
  if (todoItems.length === 0) {
    let p = document.createElement('p');
    p.textContent = 'Список дел пока пуст';
    todoList.append(p);
    return;
  }
  todoItems.forEach(function(item) {
    let todoItem = createTodoItem(item);

    todoItem.doneButton.addEventListener('click', function() {
      todoItem.item.classList.toggle('list-group-item-success');
      item.done = !item.done;
      setTodoItemsToLocalStorage();
    });

    todoItem.deleteButton.addEventListener('click', function() {
      if (confirm('Вы уверены?')) {
        let todoIndex = todoItems.findIndex(todo => todo.id === item.id);
        todoItems.splice(todoIndex, 1);
        setTodoItemsToLocalStorage();
        renderTodoList();
      }
    });

    todoList.append(todoItem.item);
  });
}

todoItems = getTodoItemsFromLocalStorage();
renderTodoList();

todoItemForm.form.addEventListener('submit', function(e) {
  e.preventDefault();

  if (!todoItemForm.input.value) {
    return;
  }

  function getMaxId() {
    return todoItems.reduce((maxId, todo) => Math.max(maxId, todo.id), 0);
  }

  let newTodo = {
    id: getMaxId() + 1,
    name: todoItemForm.input.value,
    done: false
  };

  todoItems.push(newTodo);
  setTodoItemsToLocalStorage();
  renderTodoList();

  todoItemForm.input.value = '';
  todoItemForm.button.disabled = true;
});

todoItemForm.input.addEventListener('input', function() {
  if (todoItemForm.input.value) {
    todoItemForm.button.disabled = false;
  } else {
    todoItemForm.button.disabled = true;
  }
});
}

window.createTodoApp = createTodoApp; })();
