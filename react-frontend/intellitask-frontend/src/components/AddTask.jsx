import React, { useState } from 'react';

const AddTaskForm = ({ onNewTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [importanceLevel, setImportanceLevel] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('deadline', deadline);
      formData.append('importance_level', importanceLevel);
      formData.append('is_completed', false);

      const response = await fetch('http://127.0.0.1:8000/api/tasks/', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const newTask = await response.json();
        onNewTask(newTask);
        setTitle('');
        setDescription('');
        setDeadline('');
        setImportanceLevel('1');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred while creating the task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="deadline" className="block text-gray-700">Deadline:</label>
          <input
            type="datetime-local"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="importance_level" className="block text-gray-700">Importance Level:</label>
          <select
            id="importance_level"
            value={importanceLevel}
            onChange={(e) => setImportanceLevel(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Task...' : 'Add Task'}
        </button>
        {submitError && <p className="text-red-600 mt-2">{submitError}</p>}
      </form>
    </div>
  );
};

export default AddTaskForm;