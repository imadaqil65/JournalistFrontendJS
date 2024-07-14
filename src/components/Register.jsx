import React, { useState } from 'react';
import JournalistAPI from '../api/JournalistAPI';

function Register() {
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        birthday: ''
    });

    const [notification, setNotification] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        JournalistAPI.createUser(userData)
            .then(data => {
                if (typeof data === 'object') {
                    console.log('User created successfully:', data);
                    setNotification('User created successfully!');
                    setError('');
                } else {
                    console.log('User created successfully:', data);
                    setNotification('User created successfully!');
                    setError('');
                }

                setUserData({
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: '',
                    birthday: ''
                });

                setTimeout(() => {
                    setNotification('');
                }, 3000);
            })
            .catch(err => {
                console.error('Error creating user:', err);
                setError('Error creating user. Please try again.');
                setNotification('');

                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            
            {notification && (
                <div className="notification success">
                    {notification}
                </div>
            )}

            {error && (
                <div className="notification error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">

                <div className="input-con">
                    <i className='fas fa-user'></i>
                    <input type="text" id="firstName" name="firstname" value={userData.firstname} onChange={handleChange} required placeholder='First Name'/>
                </div>

                <div className="input-con">
                    <i className='fas fa-user'></i>
                    <input type="text" id="lastName" name="lastname" value={userData.lastname} onChange={handleChange} required placeholder='Last Name'/>
                </div>

                <div className="input-con">
                    <i className='fas fa-envelope'></i>
                    <input type="email" id="email" name="email" value={userData.email} onChange={handleChange} required placeholder='Email'/>
                </div>

                <div className="input-con">
                    <i className='fas fa-lock'></i>
                    <input type="password" id="password" name="password" value={userData.password} onChange={handleChange} required placeholder='Password'/>
                </div>

                <div className="input-con">
                    <i className='fas fa-calendar'></i>
                    <input type="date" id="birthday" name="birthday" value={userData.birthday} onChange={handleChange} required />
                </div>

                <button type="submit" className="register-button">Register</button>
            </form>
        </div>
    );
}

export default Register;

