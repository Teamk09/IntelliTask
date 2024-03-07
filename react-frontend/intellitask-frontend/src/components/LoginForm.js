import React, { useState } from 'react';


const LoginForm = ({ isLoggedIn, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                onLoginSuccess();
            } else if (data.error) {
                setErrorMessage(data.error);
            }
        } else {
            setErrorMessage('An error occurred while logging in');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;