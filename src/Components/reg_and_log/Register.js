import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
    const [error, setError] = useState(null);
    const history = useNavigate();

    const handleGoBack = () => {
        history(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName,
                email
            });

            await setDoc(doc(db, "userChats", res.user.uid), {

            });
            history("/Login");
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
                        SignUp
                    </div>
                    <div className="input-box">
                        <input type='text' placeholder='Username' name='displayName' required />
                        <div className='underline' />
                    </div>
                    <div className="input-box">
                        <input type='email' placeholder='Email-ID' name='email' required />
                        <div className='underline' />
                    </div>
                    <div className="input-box">
                        <input type='password' placeholder='Password' name='password' required />
                        <div className='underline' />
                    </div>
                    <div className="input-box button">
                        <input type='submit' value="SignUp" />
                    </div>
                    {error && <span>{error}</span>}
                </form>
                <div className="crac">
                    <Link to="/Login">Already Have An Account ?</Link>
                </div>
            </div>
        </section>
    );
};

export default Register;
