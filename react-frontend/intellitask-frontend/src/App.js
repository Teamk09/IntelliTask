import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';

function App() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    useEffect(() => {
        setIsLoading(true);

        fetch('http://127.0.0.1:8000/api/tasks/', {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setTasks(data);
            setIsLoading(false);
        })
        .catch(error => {
            setError(error);
            setIsLoading(false);
        });
    }, [isLoggedIn]);

    // Render loading, error, or tasks accordingly
    if (isLoading) {
        return <p>Loading tasks...</p>;
    }

    if (error) {
        return <p>Error fetching tasks: {error.message}</p>;
    }

    return (
        <div>
            {isLoggedIn ? (
                <>
                    <h1>My Task List</h1>
                    <ul>
                        {tasks.map(task => (
                            <li key={task.id}>{task.title}</li>
                        ))}
                    </ul>
                </>
            ) : (
                <LoginForm isLoggedIn={isLoggedIn} onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;
