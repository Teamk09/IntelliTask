import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TasksPage from './components/TasksPage';
import NavBar from './components/NavBar';
import Logout from './components/LogoutForm';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <NavBar />
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <TasksPage />
              ) : (
                <LoginPage isLoggedIn={isLoggedIn} onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;