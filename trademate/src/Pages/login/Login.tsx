import React from "react";
import "./login.css"
// import { FaAppStoreIos, FaFacebook, FaGoogle } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import axios from 'axios';
// import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";


export default function Login() {

    return (
        <div className="login">
            

            <form className="loginform" >
                <div className="loginsideimg">
                {/* <img src='/images/default.png'/>   */}
               
                </div>
                <fieldset>
                    <legend>
                        Welcome Back
                    </legend>

                    <label htmlFor="username" className="user">

                        <input name="username" type="text"  placeholder="Username" />
                        {/* {data.map((item)=>(<p key={item._id}>{item.username}</p>))} */}
                    </label>
                    <br />  <br /><br />
                    <label htmlFor="password" className="pwd"><input type="password"  placeholder="Password" /></label><div className="login_extras">
                        <div id="remme">
                            <label htmlFor="remember"><input type="checkbox" name="remember" value="remember" />Remember Me</label></div>
                        <a href="#">Forgot Your Password?</a>
                    </div><div className="submitbtn">                   <input type="submit" name="loginsubmit" value="Log In"/></div>

                    <hr /><div className="Signin"><button className="google" >Sign In With Google</button><button className="google">   Sign In with Facebook</button></div>
                <p className="reglink">Don't have an account? <a href="/register">Register</a>.</p>
                </fieldset>
            </form>
        </div>
    )
}