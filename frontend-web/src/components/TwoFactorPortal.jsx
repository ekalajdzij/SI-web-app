import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/TwoFactorPortal.css";

function TwoFactorPortal({qrcode,vis}) {
    let navigate = useNavigate();
    const[slika,setSlika]=useState(qrcode)
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
   const[click,setClick]=useState(false)
   const[error,setError]=useState(false);
   const[visible,setVisible]=useState(vis);


    const pin = digits.join("");

    const handleDigitChange = (digit, index) => {
        const newDigits = [...digits];
        newDigits[index] = digit.slice(-1); // Take the last character to ensure only one digit per input
        setDigits(newDigits);

        // Automatically move to the next input field if not the last one
        if (digit && index < 5) {
            document.getElementById(`digit-${index + 1}`).focus();
        }
    };

    useEffect(() => {
        setSlika(localStorage.getItem('QR'));
    }, []); 


    useEffect(() => {
        if (pin.length === 6) {
                handleLog2fa()}
    }, [pin]); 
    //<button onClick={handleLog2fa} type="submit">Verify</button>  
    const handleLog2fa = () => {
        axios.post(`/api/login/authenticate/2fa?code=${pin}`, {
            Username: localStorage.getItem('user'),
            Password: localStorage.getItem('pass'),
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(response => {
            console.log(response.headers.authorization);
            localStorage.setItem("accessToken", response.headers.authorization );

            console.log('Successful login:');
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("isLoggedInVia2fa", 'true');
            navigate('/home');
        })
        .catch(error => {
            console.error('Error during login:', error);
            setError(true)
        });
    };

    return (
        <div className="two-factor-portal">
          {visible &&  <img src={slika} alt="QR Code" />}
           {visible && <button onClick={() => setClick(!click)}>{click ? 'Hide Manual Key' : 'Show Manual Key'}</button>}
    
            {click && <input
                type="text"
                value={localStorage.getItem('key')}
                readOnly
                className="inp"
            />}
            <div className="digit-inputs">
                {Array.from({ length: 6 }).map((_, index) => (
                    <input
                        key={index}
                        id={`digit-${index}`}
                        type="text"
                        maxLength="1"
                        className="inp digit"
                        value={digits[index]}
                        onChange={(e) => handleDigitChange(e.target.value, index)}
                    />
                ))}
            </div>
            {error && <p id="error">Invalid pin</p>}
         
        </div>
    );
}

export default TwoFactorPortal;
