import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Alert from './Alert';

const Login = ({ showAlert }) => {
    const [credential, setCredential] = useState({ email: '', password: '' });
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credential)
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.authtoken);
                showAlert("You are Logged in", "success");
                history.push("/");
            } else {
                showAlert("Invalid Credentials", "danger");
            }
        } catch (error) {
            showAlert("Unable to fetch API", "danger")
        }
    };

    const onChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2 className='my-3'>Login to continue on iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={credential.email} onChange={onChange} required aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' value={credential.password} onChange={onChange} minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default Login;