import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTaskForm from './AddTask';
import ProtectedRoute from '../ProtectedRoute';
import { FiPlus } from "react-icons/fi";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskCheckboxes, setTaskCheckboxes] = useState({});
  const [showAddTask, setShowAddTask] = useState(false);
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
          if (response.status === 401) {
            navigate('/login');
          } else {
            throw Error('Error fetching tasks');
          }
        }
        return response.json();
      })
      .then((data) => {
        const filteredTasks = data.filter((task) => !task.is_deleted);
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
    <ProtectedRoute>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">My Task List</h1>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md flex items-center focus:outline-none"
              onClick={() => setShowAddTask(!showAddTask)}
            >
              <FiPlus />
              {showAddTask ? 'Close' : 'New Task'}
            </button>
          </div>
          <ul className="task-list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-gray-100 p-4 rounded-md mb-4 flex items-center justify-between transition-all duration-200 hover:bg-gray-200"
              >
                <p className="text-lg text-gray-700">{task.title}</p>
                <input
                  type="checkbox"
                  checked={taskCheckboxes[task.id] || false}
                  onChange={() => handleTaskComplete(task.id)}
                  className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                />
              </li>
            ))}
          </ul>
          {showAddTask && <AddTaskForm />}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TasksPage;
