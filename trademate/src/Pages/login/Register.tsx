// src/Register.tsx
import React, { useState } from "react";
import "./register.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from '../../userSlice';

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const csrftoken = getCookie('csrftoken');
            const response = await axios.post('http://127.0.0.1:8000/playground/register/', {
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                }
            });
            console.log('Response from backend:', response.data);

            dispatch(setUser({ email: response.data.email }));

         
            navigate('/');
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };

    return (
        <div className="login">
            <form className="regform" onSubmit={handleSubmit}>
                <div className="loginsideimgr">
                    {/* <img src='/images/default.png'/> */}
                </div>
                <fieldset>
                    <legend>Sign Up!</legend>
                    <label htmlFor="email" className="user">
                        <input name="email" type="email" placeholder="Email Id" value={formData.email} onChange={handleChange} />
                    </label>
                    <br /> <br /><br />
                    <label htmlFor="newpassword" className="pwd">
                        <input type="password" name="password" placeholder="New Password" value={formData.password} onChange={handleChange} />
                    </label>
                    <label htmlFor="confpassword" className="pwd">
                        <input type="password" name="confirmPassword" placeholder="Confirm New Password" value={formData.confirmPassword} onChange={handleChange} />
                    </label>
                    <div className="login_extras">
                        <div id="remme">
                            <label htmlFor="remember">
                                <input type="checkbox" name="remember" />Remember Me
                            </label>
                        </div>
                    </div>
                    <div className="submitbtn">
                        <input type="submit" name="loginsubmit" value="Register" />
                    </div>
                    <hr />
                    <div className="Signin">
                        <button className="google">Sign In With Google</button>
                        <button className="google">Sign In with Facebook</button>
                    </div>
                    <p className="reglink">Have an account? <a href="/login">Log In</a>.</p>
                </fieldset>
            </form>
        </div>
    );
}

function getCookie(name: string): string {
    const cookieValue: string | null = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
    return cookieValue;
}
