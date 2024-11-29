import React, { useEffect, useState } from 'react';
import './App.css';
import Todo, { TodoType } from './Todo';

function App() {

  const [todos, setTodos] = useState<TodoType[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title) {
      setError("Title must not be empty")
      return
    } else {
      setError("")
    }

    const newTodo = {
      title,
      description
    }

    setTitle("")
    setDescription("")

    setTodos([...todos, newTodo])

    fetch("http://localhost:8080/", {
      method: "POST",
      body: JSON.stringify(newTodo),
    })
  }

  // Initially fetch todo
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosRequest = await fetch('http://localhost:8080/');
        if (todosRequest.status !== 200) {
          console.log('Error fetching data');
          return;
        }

        setTodos(await todosRequest.json());
      } catch (e) {
        console.log('Could not connect to server. Ensure it is running. ' + e);
      }
    }

    fetchTodos()

  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos.map((todo) =>
          <Todo
            key={todo.title + todo.description}
            title={todo.title}
            description={todo.description}
          />
        )}
      </div>

      <h2>Add a Todo</h2>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" name="title" autoFocus={true} />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" name="description" />
        {error && <p className="alert">{error}</p>}
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

export default App;
