import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function TwoFactorPortal() {
    let navigate = useNavigate();

    const [pin, setPin] = useState("");

    const handleLog2fa=(e)=>{
        e.preventDefault();
        axios.post(`/api/login/authenticate/2fa?code=${pin}`, {
          Username: localStorage.getItem('user'),
          Password: localStorage.getItem('pass'),
        })
        .then(response => {
          console.log('Uspješno logiranje:');
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("isLoggedInVia2fa", 'true');


          navigate('/home');
        })
        .catch(error => {
          console.error('Greška prilikom logiranja:', error);
        });
      }
  return (
    <div>
    <img src={localStorage.getItem('QR')}></img>
    
    <input
                type="text"
                placeholder="Username or phone number"
                id="username"
                value={pin} onChange={(e)=> setPin(e.target.value)}
              />
                            <button onClick={(e)=>{handleLog2fa(e)}} type="submit">Log in</button>
    </div>
  )
}

export default TwoFactorPortal