import React from "react";
import "../css/Register.css";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  return (
    <>
      <div className="main">
        <div className="cover-frame">
          <div className="registration-frame">
            <h2>Create an account</h2>
            <form id="registerForm" className="register-form">
              <input type="text" className="inputs"
                placeholder="First Name" id="firstName" />
              <input type="text" className="inputs"
                placeholder="Last Name" id="lastName" />
              <input type="text" className="inputs"
                placeholder="Phone Number" id="phoneNumber" />
              <input type="text" className="inputs"
                placeholder="Username" id="registerUsername" />
              <input
                type="password"
                placeholder="Password"
                id="registerPassword"
                className="inputs"

              />
              <button type="submit">Create account</button>
            </form>
            <p>
              Already have an account?
              <Link id="linkToLogin" to="/">
                Log in!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
