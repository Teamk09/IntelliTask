import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './LogoutForm';
import './NavBar.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const navClass = `navbar ${isOpen ? 'open' : ''}`; // Combine classes

  return (
    <nav className={navClass}>
      <div className="navbar-header">
        <Link to="/" className="navbar-brand">
          My App
        </Link>
        <button className="navbar-toggle" onClick={toggleNav}>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
      </div>
      <div className="navbar-collapse">
        <ul className="navbar-nav">
          <li>
            <Link to="/tasks">Tasks</Link>
          </li>
          <li>
            <Link to="/logout" onClick={Logout.handleLogout}>Logout</Link> {/* Updated */}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
