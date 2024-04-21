import React, {useState,useEffect} from "react";
import "./register.css"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword:''
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // setFormDatae(value)
        // setFormDatap(value)
    };
    const [email, setFormDatae]=useState(formData.email)
    const [password, setFormDatap]=useState(formData.password)
    // const [password, setFormDatap]=useState(formData.password)
    const [confirmPassword, setFormDatacp]=useState(formData.confirmPassword)

    useEffect(() => {
        // Update email state when formData.email changes
        setFormDatae(formData.email);
    }, [formData.email]); // Run this effect when formData.email changes

    useEffect(() => {
        // Update password state when formData.password changes
        setFormDatap(formData.password);
    }, [formData.password]);
    useEffect(() => {
        // Update password state when formData.password changes
        setFormDatacp(formData.confirmPassword);
    }, [formData.confirmPassword]);

    console.log(formData)
    console.log(email)
    console.log(password)
    // const handlechangepassword = (e: React.ChangeEvent<HTMLInputElement>) =>{
    //     setFormDatap(e.target.value)
    // }
    // const handlechangemail = (e: React.ChangeEvent<HTMLInputElement>) =>{
    //     setFormDatae(e.target.value)
    // }
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const csrftoken = getCookie('csrftoken');
            // Send POST request to backend with form data
            const response = await axios.post('http://127.0.0.1:8000/playground/register/ ', {
                email,password,confirmPassword,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                }
            });
            console.log('Response from backend:', response.data);
            // Redirect user or perform further actions based on response
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };


    return (
        <div className="login">
            <form className="regform" onSubmit={handleSubmit} >
                <div className="loginsideimgr">
                    {/* <img src='/images/default.png'/>   */}
                </div>
                <fieldset>
                    <legend>
                        Sign Up!
                    </legend>
                    <label htmlFor="email" className="user">
                        <input name="email" type="email" placeholder="Email Id" value={formData.email} onChange={handleChange}/>
                    </label>
                    <br />  <br /><br />
                    <label htmlFor="newpassword" className="pwd"><input type="password" name="password" placeholder="New Password" value={formData.password} onChange={handleChange}/></label>
                    <label htmlFor="confpassword" className="pwd"><input type="password" name="confirmPassword" placeholder="Confirm New Password" value={formData.confirmPassword} onChange={handleChange}/></label>
                    <div className="login_extras">

                        <div id="remme">
                            <label htmlFor="remember"><input type="checkbox" name="remember" />Remember Me</label></div>
                    </div>
                     <div className="submitbtn" >                   <input type="submit" name="loginsubmit" value="Register" /></div>
                    <hr /><div className="Signin"><button className="google" >Sign In With Google</button><button className="google">   Sign In with Facebook</button></div>
                    <p className="reglink">Have an account? <a href="/login">Log In</a>.</p>
                </fieldset>
            </form>
        </div>
    )
}


function getCookie(name: string): string {
    const cookieValue: string | null = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
    return cookieValue;
}
