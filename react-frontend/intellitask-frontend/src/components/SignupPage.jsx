import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import zxcvbn from 'zxcvbn';
import bcrypt from 'bcryptjs';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password1: '',
    password2: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password1, password2 } = formData;

    // Check if passwords match
    if (password1 !== password2) {
      setErrorMessage("Passwords don't match");
      return;
    }

    // Validate password strength
    const passwordStrength = zxcvbn(password1);
    if (passwordStrength.score < 3) {
      setErrorMessage(
        'Password is too weak. It should be at least 8 characters long, contain a mix of letters, numbers, and symbols, and not be a commonly used password.'
      );
      return;
    }

    // Check username length
    if (username.length < 3) {
      setErrorMessage('Username must be at least 3 characters long');
      return;
    }

    try {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password1, 10);

      const response = await fetch('http://127.0.0.1:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: hashedPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sign up successful
        localStorage.setItem('token', data.token);
        navigate('/login');
      } else {
        setErrorMessage(
          data.errors ? Object.values(data.errors).join(', ') : 'An error occurred while signing up'
        );
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An error occurred while signing up');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password1" className="block text-gray-700 mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password1"
              name="password1"
              value={formData.password1}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password2" className="block text-gray-700 mb-2">
              Confirm Password:
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 mb-4">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-500 hover:text-indigo-600">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;