import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
const Login = () => {

    const history = useNavigate();

    const handleGoBack = () => {
        history(-1);
    };

    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            history("/Dashboard")
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };
    return (
        <section className='bod'>
            <div onClick={handleGoBack} className="back-button responsive">
                <i className='fa-solid fa-arrow-left' />
            </div>
            <div className='contain'>
                <form onSubmit={handleSubmit}>
                    <div className='title'>
                        Login
                    </div>
                    <div className="input-box">
                        <input type='Text' placeholder='Email' name="email" required />
                        <div className='underline' />
                    </div>
                    <div className="input-box">
                        <input type='password' placeholder='Password' name="password" required />
                        <div className='underline' />
                    </div>
                    <div className="input-box button">
                        <input type='submit' value="Login" />
                    </div>
                    {error && <span>{error}</span>}
                </form>
                <div className="crac">
                    <Link to="/Register">Don't Have An Account ?</Link>
                </div>
            </div>
        </section>
    )
}

export default Login