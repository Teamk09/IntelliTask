import React, { useState, useEffect } from 'react';
import './App.css'; // Or your relevant CSS file

function App() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);

        fetch('http://127.0.0.1:8000/api/tasks/', {
            headers: {
                'Authorization': "Token ce556f79f2994a518301d7cb114250b495ea9409" // Replace 'token' with the actual token
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
    }, []); // Empty dependency array: Fetch only once on component load

    // Render loading, error, or tasks accordingly
    if (isLoading) {
        return <p>Loading tasks...</p>;
    }

    if (error) {
        return <p>Error fetching tasks: {error.message}</p>;
    }

    return (
        <div>
            <h1>My Task List</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
