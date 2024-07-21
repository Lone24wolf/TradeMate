import React, { useState } from "react";
import "./login.css"
// import { FaAppStoreIos, FaFacebook, FaGoogle } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import axios from 'axios';
// import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from '../../userSlice';


interface FormData {
    email: string;
    password: string;
}
export default function Login() {


    const [formData, setFormData] = useState<FormData>({
            email: '',
            password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(formData)
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const csrftoken = getCookie('csrftoken');
            const response = await axios.post('http://127.0.0.1:8000/playground/login/', {
                email: formData.email,
                password: formData.password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                }
            });
            console.log('Response from backend:', response.data);
            if (response.status === 200) {
                alert('Login successful.');
                dispatch(setUser({ email: formData.email }));
                navigate('/');
            }

            // dispatch(setUser({ email: response.data.email }));

         
            // navigate('/');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const { status, data } = error.response || {};
                if (status === 400) {
                    alert(data?.error || 'Please provide an email.');
                } else if (status === 404) {
                    alert(data?.error || 'Email not found. Please sign up.');
                } else if (status === 401) {
                    alert(data?.error || 'Incorrect password.');
                } else {
                    alert('An unexpected error occurred.');
                }
            } else {
                console.error('Error sending data to backend:', error);
                alert('An unexpected error occurred.');
            }
        }
    };


    return (
        <div className="login">
            

            <form className="loginform" onSubmit={handleSubmit}>
                <div className="loginsideimg">
                {/* <img src='/images/default.png'/>   */}
               
                </div>
                <fieldset>
                    <legend>
                        Welcome Back
                    </legend>

                    <label htmlFor="email" className="user">

                        <input name="email" type="email"  placeholder="email" value={formData.email} onChange={handleChange} />
                        {/* {data.map((item)=>(<p key={item._id}>{item.username}</p>))} */}
                    </label>
                    <br />  <br /><br />
                    <label htmlFor="password" className="pwd"><input name="password" type="password"  placeholder="Password" value={formData.password} onChange={handleChange} />
                    </label>
                    <div className="login_extras">
                        <div id="remme">
                            <label htmlFor="remember"><input type="checkbox" name="remember" value="remember" />Remember Me</label>
                        </div>
                        <a href="#">Forgot Your Password?</a>
                    </div>
                    <div className="submitbtn">                   
                        <input type="submit" name="loginsubmit" value="Log In" />
                    </div>

                    <hr /><div className="Signin"><button className="google" >Sign In With Google</button><button className="google">   Sign In with Facebook</button></div>
                <p className="reglink">Don't have an account? <a href="/register">Register</a>.</p>
                </fieldset>
            </form>
        </div>
    )
}

function getCookie(name: string): string {
    const cookieValue: string | null = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
    return cookieValue;
}