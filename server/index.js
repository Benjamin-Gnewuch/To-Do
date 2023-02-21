const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// create a todo
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    await pool.query(
      'INSERT INTO todos (description, created_on) VALUES ($1, CURRENT_TIMESTAMP)',
      [description]
    );
    res.send('added todo');
  } catch (error) {
    console.error(error);
  }
});

// read all todos
app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM todos ORDER BY todo_id');
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    await pool.query(
      'UPDATE todos SET description = $1, was_edited = true WHERE todo_id = $2',
      [description, id]
    );
    res.send('todo updated');
  } catch (error) {
    console.error(error);
  }
});

// delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM todos WHERE todo_id = $1', [id]);

    res.send('todo deleted');
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
