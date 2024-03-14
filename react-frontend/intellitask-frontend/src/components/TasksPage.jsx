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
  const [sortDirection, setSortDirection] = useState('asc');

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
    let sortedTasks;
    switch (sortOption) {
      case 'date':
        sortedTasks = tasks.sort((a, b) => {
          const dateA = new Date(a.deadline);
          const dateB = new Date(b.deadline);
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;
      case 'importance':
        sortedTasks = tasks.sort((a, b) => {
          const importanceA = a.importance_level;
          const importanceB = b.importance_level;
          return sortDirection === 'asc'
            ? importanceA - importanceB
            : importanceB - importanceA;
        });
        break;
      case 'alphabetical':
        sortedTasks = tasks.sort((a, b) => {
          return sortDirection === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        });
        break;
      default:
        sortedTasks = tasks;
    }
    return sortedTasks;
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


  const handleTaskClick = (task, event) => {
    if (event.target.type !== 'checkbox' && event.target.tagName.toLowerCase() !== 'button') {
      setSelectedTask(task);
      setShowModal(true);
    }
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
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl w-full overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <label htmlFor="sort-option" className="mr-2">Sort by:</label>
            <select
              id="sort-option"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-gray-200 rounded-md p-2 mr-2"
            >
              <option value="default">Default</option>
              <option value="date">Date</option>
              <option value="importance">Importance</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
            <label htmlFor="sort-direction" className="mr-2">Direction:</label>
            <select
              id="sort-direction"
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              className="bg-gray-200 rounded-md p-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
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
                onClick={(event) => handleTaskClick(task, event)}
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