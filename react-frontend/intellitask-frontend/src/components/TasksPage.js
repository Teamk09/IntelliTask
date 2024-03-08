import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskCheckboxes, setTaskCheckboxes] = useState({}); // State for checkboxes
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    fetch('http://127.0.0.1:8000/api/tasks/', {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) { // Check for 401 Unauthorized
            navigate('/login'); // Redirect to login
          } else {
            throw Error('Error fetching tasks');
          }
        }
        return response.json();
      })
      .then((data) => {
        const filteredTasks = data.filter((task) => !task.is_deleted); // Filter out deleted tasks
        setTasks(filteredTasks);
        const initialCheckboxes = data.reduce((acc, task) => {
          acc[task.id] = task.is_completed;
          return acc;
        }, {});
        setTaskCheckboxes(initialCheckboxes);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
        console.error('Error fetching tasks: ', error);
      });
  }, [navigate]);

  const handleTaskComplete = async (taskId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_completed: true }),
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
        setTaskCheckboxes((prev) => ({ ...prev, [taskId]: true }));
      } else {
        console.error("Error updating task:", response);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

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
            <li key={task.id} className="bg-white p-4 rounded-md shadow-sm mb-4 transition-all duration-200 hover:translate-y-1 hover:shadow-md animate-fade-in flex items-center justify-between"> {/* Changes Here */}
              <p className="text-lg text-gray-700">{task.title}</p>
              <input
                type="checkbox"
                checked={taskCheckboxes[task.id] || false}
                onChange={() => handleTaskComplete(task.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TasksPage;
