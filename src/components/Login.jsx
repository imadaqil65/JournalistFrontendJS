import React, { useState } from 'react';
import LoginApi from '../api/LoginApi';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await LoginApi.checkUser(email, password);
            console.log('Login successful:', result);
            window.location.href = '/';
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-con">
                    <i className='fas fa-envelope'></i>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='Email'/>
                </div>
                <div className="input-con">
                    <i className='fas fa-lock'></i>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='Password'/>
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
}

export default Login;
