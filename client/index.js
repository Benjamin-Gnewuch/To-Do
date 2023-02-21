// domain name for URL of server. Change this to your domain name.
const domain = `http://127.0.0.1:5000`;

const todoInputEl = document.querySelector('.todo__input');
const addOrChangeBtnEl = document.querySelector('.todo__add-btn');

const state = {
  editMode: false,
  editId: null,
};

const enterEditMode = todoId => {
  state.editMode = true;
  state.editId = todoId;

  todoInputEl.setAttribute('placeholder', 'Change the thing...');
  addOrChangeBtnEl.textContent = 'Change';
  addOrChangeBtnEl.classList.add('change-btn');
};

const exitEditMode = () => {
  state.editMode = false;
  state.editId = null;

  todoInputEl.value = '';
  todoInputEl.setAttribute('placeholder', 'Do the thing...');
  addOrChangeBtnEl.textContent = 'Add';
  addOrChangeBtnEl.classList.remove('change-btn');
};

const fetchTodos = async () => {
  const response = await fetch(`${domain}/todos`);
  const todos = await response.json();

  return todos;
};

const addTodo = async description => {
  await fetch(`${domain}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });
  todoInputEl.value = '';
  await renderTodos();
};

const editTodo = async (id, description) => {
  await fetch(`${domain}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });

  exitEditMode();
  await renderTodos();
};

const deleteTodo = async id => {
  const response = await fetch(`${domain}/todos/${id}`, {
    method: 'DELETE',
  });
};

const renderTodos = async () => {
  const todoListEl = document.querySelector('.todo-list__list');
  todoListEl.innerHTML = '';
  const todos = await fetchTodos();
  todos.forEach(todo => {
    const timestampString = todo.created_on;
    const formattedTimestamp = new Date(timestampString).toLocaleString();

    const liEl = document.createElement('li');
    liEl.classList.add('todo-list__item');
    liEl.innerHTML = `
    <div class="todo-list__item-container">
      <span class="todo-list__item-text">${todo.description}</span>
      <div class="todo-actions">
      ${
        !state.editMode
          ? `<button class="todo-list__item-edit-btn">edit</button>
      <button class="todo-list__item-delete-btn">x</button>`
          : ''
      }
      ${
        state.editMode && state.editId === todo.todo_id
          ? `<span class="edit-arrow">&#8592;</span>
          <button class="todo-list__item-cancel-btn">cancel</button>`
          : ''
      }
      </div>
      </div>
      <p class="todo-list__timestamp">${
        todo.was_edited ? `edited on:` : `created on:`
      } ${formattedTimestamp}</p>
      
    `;

    // handle todo delete button click
    liEl.addEventListener('click', async e => {
      if (e.target.classList.contains('todo-list__item-delete-btn')) {
        console.log('delete todo', todo.todo_id);
        await deleteTodo(todo.todo_id);
        await renderTodos();
      }
    });

    // handle todo edit button click
    liEl.addEventListener('click', async e => {
      if (e.target.classList.contains('todo-list__item-edit-btn')) {
        console.log('edit todo', todo.todo_id);
        todoInputEl.value = '';
        todoInputEl.focus();
        enterEditMode(todo.todo_id);
        await renderTodos();
      }
    });

    // handle todo cancel button click
    liEl.addEventListener('click', async e => {
      if (e.target.classList.contains('todo-list__item-cancel-btn')) {
        console.log('cancel edit', todo.todo_id);
        exitEditMode();
        await renderTodos();
      }
    });
    todoListEl.appendChild(liEl);
  });
};

addOrChangeBtnEl.addEventListener('click', async e => {
  e.preventDefault();

  const description = todoInputEl.value;

  if (state.editMode === false && description !== '') {
    await addTodo(description);
  }

  if (state.editMode === true && description !== '') {
    await editTodo(state.editId, description);
  }
});

// initial render
renderTodos();
