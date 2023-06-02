import React, { useState } from 'react';
import axios from 'axios';

function UserForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.ChangeEvent<any>) => {
        e.preventDefault();
        axios.post('http://localhost:4000/users', { name, email })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
        />
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
        />
        <button type="button" onClick={handleSubmit}>Add User</button>
        </form>
    );
}

export default UserForm;