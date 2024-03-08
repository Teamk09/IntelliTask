//App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TasksPage from './components/TasksPage';
import NavBar from './components/NavBar';
import Logout from './components/LogoutForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-col items-center justify-center">
        <NavBar />
        <main className="container mx-auto flex-grow">
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
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
