const todoInputEl = document.querySelector('.todo__input');
const addBtnEl = document.querySelector('.todo__add-btn');

const sampleData = [
  {
    todo_id: 1,
    description: 'Learn React',
    created_on: '2020-10-01T00:00:00.000Z',
  },
  {
    todo_id: 2,
    description: 'Learn Node',
    created_on: '2020-10-02T00:00:00.000Z',
  },
];

const renderTodos = todos => {
  const todoListEl = document.querySelector('.todo-list__list');
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
    todoListEl.appendChild(liEl);
  });
};

renderTodos(sampleData);

addBtnEl.addEventListener('click', e => {
  e.preventDefault();

  const todo = todoInputEl.value;
  console.log(todo);
});
