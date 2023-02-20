const todoInputEl = document.querySelector('.todo__input');
const addBtnEl = document.querySelector('.todo__add-btn');

const fetchTodos = async () => {
  const response = await fetch('http://127.0.0.1:5000/todos');
  const todos = await response.json();

  return todos;
};

const deleteTodo = async id => {
  const response = await fetch(`http://127.0.0.1:5000/todos/${id}`, {
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
      <span class="todo-list__item-text">${todo.description}</span>
      <button class="todo-list__item-delete-btn">x</button>
      <p class="todo-list__timestamp">created on: ${formattedTimestamp}</p>
    `;

    // handle todo delete button click
    liEl.addEventListener('click', async e => {
      if (e.target.classList.contains('todo-list__item-delete-btn')) {
        console.log('delete todo', todo.todo_id);
        await deleteTodo(todo.todo_id);
        await renderTodos();
      }
    });
    todoListEl.appendChild(liEl);
  });
};

addBtnEl.addEventListener('click', async e => {
  e.preventDefault();

  const description = todoInputEl.value;

  if (description !== '') {
    await fetch('http://127.0.0.1:5000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });
    todoInputEl.value = '';
    await renderTodos();
  }
});

renderTodos();
