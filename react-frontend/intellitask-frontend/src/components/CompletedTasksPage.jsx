import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import TaskModal from './TaskModal';

const CompletedTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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

  const handleDeleteTask = async (taskId, permanent = false) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/?permanent=${permanent}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        console.error('Error deleting task:', response);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleTaskClick = (task, event) => {
    if (event.target.tagName.toLowerCase() !== 'button') {
      setSelectedTask(task);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  if (isLoading) return <p className="text-center text-gray-700">Loading completed tasks...</p>;
  if (error) return <p className="text-center text-red-600">Error fetching completed tasks: {error.message}</p>;

  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl w-full overflow-y-auto max-h-screen">
          <h1 className="text-2xl font-semibold text-gray-800 mb-8">Completed Tasks</h1>
          {tasks.length === 0 ? (
            <p className="text-center text-gray-600">No completed tasks found.</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="bg-gray-100 p-4 rounded-md mb-4 flex items-center justify-between cursor-pointer"
                  onClick={(event) => handleTaskClick(task, event)}
                >
                  <p className="text-lg text-gray-700">{task.title}</p>
                  <div>
                    <button
                      className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-md"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteTask(task.id, true);
                      }}
                    >
                      Permanent Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {showModal && <TaskModal task={selectedTask} onClose={closeModal} />}
    </ProtectedRoute>
  );
};

export default CompletedTasksPage;