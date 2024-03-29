import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import TasksPage from './components/TasksPage';
import NavBar from './components/NavBar';
import Logout from './components/LogoutForm';
import AddTaskForm from './components/AddTask';
import ProtectedRoute from './ProtectedRoute';
import CompletedTasksPage from './components/CompletedTasksPage';

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
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/tasks/" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
            <Route path="/logout/" element={<Logout />} />
            <Route path="/tasks/new/" element={<ProtectedRoute><AddTaskForm /></ProtectedRoute>} />
            <Route path="/tasks/completed" element={<ProtectedRoute><CompletedTasksPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
