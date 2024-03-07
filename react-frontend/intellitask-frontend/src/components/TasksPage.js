import React, { useState, useEffect } from 'react';
import './TasksPage.css';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    fetch('http://127.0.0.1:8000/api/tasks/', {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
        console.error('Error fetching tasks: ', error);
      });
  }, []);

  // Render loading, error, or tasks accordingly
  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error fetching tasks: {error.message}</p>;
  }

  return (
    <div className="task-list-container">
      <h1>My Task List</h1>
      <ul className="task-list">
        {tasks.map((task) => (
          <li className="task-item" key={task.id}>
            <p>{task.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;