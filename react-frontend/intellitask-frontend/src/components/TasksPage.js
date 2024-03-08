import React, { useState, useEffect } from 'react';

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

  if (isLoading) {
    return <p className="text-center text-gray-700">Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error fetching tasks: {error.message}</p>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-lg w-full">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">My Task List</h1>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="bg-white p-4 rounded-md shadow-sm mb-4 transition-all duration-200 hover:translate-y-1 hover:shadow-md animate-fade-in">
              <p className="text-lg text-gray-700">{task.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TasksPage;