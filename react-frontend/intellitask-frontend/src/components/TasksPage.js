import React, { useState, useEffect, useRef } from 'react';
import { FiPlus } from "react-icons/fi";
import AddTaskForm from './AddTask';
import ProtectedRoute from '../ProtectedRoute';
import TaskModal from './TaskModal';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskCheckboxes, setTaskCheckboxes] = useState({});
  const [showAddTask, setShowAddTask] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const isMounted = useRef(false);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetchTasks();
    }
  }, []);

  const fetchTasks = () => {
    setIsLoading(true);
    fetch('http://127.0.0.1:8000/api/tasks/', {
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
        const filteredTasks = data.filter(task => !task.is_deleted);
        setTasks(filteredTasks);
        setTaskCheckboxes(data.reduce((acc, task) => {
          acc[task.id] = task.is_completed;
          return acc;
        }, {}));
        setIsLoading(false);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
        console.error('Error fetching tasks: ', error);
      });
  }

  const sortTasks = (tasks) => {
    switch (sortOption) {
      case 'date':
        return tasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
      case 'importance':
        return tasks.sort((a, b) => b.importance_level - a.importance_level);
      case 'alphabetical':
        return tasks.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return tasks;
    }
  };

  const handleTaskComplete = async taskId => {
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
        setTasks(tasks.filter(task => task.id !== taskId));
        setTaskCheckboxes(prev => ({ ...prev, [taskId]: true }));
      } else {
        console.error("Error updating task:", response);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleNewTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };


  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  if (isLoading) return <p className="text-center text-gray-700">Loading tasks...</p>;
  if (error) return <p className="text-center text-red-600">Error fetching tasks: {error.message}</p>;

  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-8">
         <div>
          <label htmlFor="sort-option" className="mr-2">Sort by:</label>
          <select id="sort-option" value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="bg-gray-200 rounded-md p-2">
            <option value="default">Default</option>
            <option value="date">Date</option>
            <option value="importance">Importance</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md flex items-center focus:outline-none"
          onClick={() => setShowAddTask(!showAddTask)}
        >
          <FiPlus />
          {showAddTask ? 'Close' : 'New Task'}
        </button>
      </div>
          <ul className="task-list">
            {sortTasks(tasks).map(task => (
              <li
                key={task.id}
                className="bg-gray-100 p-4 rounded-md mb-4 flex items-center justify-between transition-all duration-200 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleTaskClick(task)}
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
          {showAddTask && <AddTaskForm onNewTask={handleNewTask} />}
        </div>
      </div>
      {showModal && <TaskModal task={selectedTask} onClose={closeModal} />}
    </ProtectedRoute>
  );
};

export default TasksPage;