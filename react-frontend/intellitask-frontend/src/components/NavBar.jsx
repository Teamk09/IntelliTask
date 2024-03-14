import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleNav = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-2 right-4 bg-gray-200 text-gray-800 z-10 flex items-center p-4 rounded-lg shadow-md">
      <div className="flex items-center">
        <Link to="/tasks/" className="text-gray-800 text-lg font-semibold mr-4">
          My List
        </Link>
        <button
          className="bg-none border-none text-gray-800 focus:outline-none"
          onClick={toggleNav}
        >
          <div className="w-6 h-1 bg-gray-800 mb-1" />
          <div className="w-6 h-1 bg-gray-800 mb-1" />
          <div className="w-6 h-1 bg-gray-800" />
        </button>
      </div>
      <div
        className={`absolute top-full left-0 w-full bg-gray-100 flex flex-col items-center transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <ul className="py-3">
          <li>
            <Link
              to="/tasks"
              className="block py-3 px-6 bg-gray-300 hover:bg-gray-400 text-white rounded-md m-2"
            >
              <span className="flex items-center justify-center">Tasks</span>
            </Link>
          </li>
          <li>
            <Link
              to="/tasks/new"
              className="block py-3 px-6 bg-gray-300 hover:bg-gray-400 text-white rounded-md m-2"
            >
              <span className="flex items-center justify-center">Add Task</span>
            </Link>
          </li>
          <li>
            <Link
              to="/tasks/completed"
              className="block py-3 px-6 bg-gray-300 hover:bg-gray-400 text-white rounded-md m-2"
            >
              <span className="flex items-center justify-center">Completed Tasks</span>
            </Link>
          </li>
          <li>
            <Link
              to="/logout"
              className="block py-3 px-6 bg-gray-300 hover:bg-gray-400 text-white rounded-md m-2"
            >
              <span className="flex items-center justify-center">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;