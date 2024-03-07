import React from 'react';

function Task(props) {
    return (
        <div>
            <h2>{props.title}</h2>
            <p>{props.description}</p>
        </div>
    );
}

export default Task;
