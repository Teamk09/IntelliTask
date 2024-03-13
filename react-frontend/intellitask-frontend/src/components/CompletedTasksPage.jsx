import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../ProtectedRoute';

const CompletedTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    setIsLoading(true);
    const showCompleted = true;
  
    fetch(`http://127.0.0.1:8000/api/tasks/?show_completed=${showCompleted}`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) return;
          throw new Error('Error fetching tasks');
        }
        return response.json();
      })
      .then(data => {
        const completedTasks = data.filter(task => task.is_completed);
        setTasks(completedTasks);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
        console.error('Error fetching tasks: ', error);
      });
  }

  if (isLoading) return <p className="text-center text-gray-700">Loading completed tasks...</p>;
  if (error) return <p className="text-center text-red-600">Error fetching completed tasks: {error.message}</p>;

  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl w-full">
          <h1 className="text-2xl font-semibold text-gray-800 mb-8">Completed Tasks</h1>
          {tasks.length === 0 ? (
            <p className="text-center text-gray-600">No completed tasks found.</p>
          ) : (
            <ul className="task-list">
              {tasks.map(task => (
                <li key={task.id} className="bg-gray-100 p-4 rounded-md mb-4 flex items-center justify-between">
                  <p className="text-lg text-gray-700">{task.title}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CompletedTasksPage;