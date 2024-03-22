import React from 'react';
import '../css/Register.css'
import { useNavigate,Link } from 'react-router-dom';

function Register() {
  return (
    <div className="container">
      <form id="registerForm" className="login-form">
        <input type="text" placeholder="First Name" id="firstName" />
        <input type="text" placeholder="Last Name" id="lastName" />
        <input type="text" placeholder="Phone Number" id="phoneNumber" />
        <input type="text" placeholder="Username" id="registerUsername" />
        <input type="password" placeholder="Password" id="registerPassword" />
        <button type="submit">Register</button>
        <Link id="linkToLogin" to='/'>If you already have account, SIGN-IN here!</Link>

      </form>
    </div>
  );
}

export default Register;
