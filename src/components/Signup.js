import React, { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'


function Signup(props) { 
    const [credential, setCredential] = useState({ name: "", email: "", password: "", cpassword: '' });    
    let history = useHistory()

    const handleSubmit = async (e) => { 
        e.preventDefault();
        const { name, email, password} = credential
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        }); 

        const json = await response.json();
        // console.log(json)
        if(json.success) {
            // Save the auth token Redirect  
            localStorage.setItem('token', json.authtoken)
            props.showAlert("Account created Successfully", "success")
            history.push("/")
        }

        else{
            props.showAlert("Invalid Credential", "danger")
        }
    };

    const onChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value });
    };

    return (
        <div>
             <h2 className='my-3'>Create an account to use iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Enter your Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={onChange}  minLength={3}  required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={onChange} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={5}  required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={5}  required/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default Signup;

