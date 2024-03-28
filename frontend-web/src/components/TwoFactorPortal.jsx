import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/TwoFactorPortal.css";

function TwoFactorPortal({ qrcode, vis }) {
  let navigate = useNavigate();
  const [slika, setSlika] = useState(qrcode);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [click, setClick] = useState(false);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(vis);

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
    setSlika(localStorage.getItem("QR"));
    setVisible(JSON.parse(localStorage.getItem("logged")));
  }, []);

  useEffect(() => {
    if (pin.length === 6) {
      handleLog2fa();
    }
  }, [pin]);
  //<button onClick={handleLog2fa} type="submit">Verify</button>
  const handleLog2fa = () => {
    axios
      .post(
        `https://fieldlogistics-control.azurewebsites.net/api/login/authenticate/2fa?code=${pin}`,
        {
          Username: localStorage.getItem("user"),
          Password: localStorage.getItem("pass"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,

          },
        }
      )
      .then((response) => {
        console.log(response.headers.authorization);
        localStorage.setItem("accessToken", response.headers.authorization);

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isLoggedInVia2fa", "true");
        localStorage.setItem("logged", false);
        setVisible(false);

        navigate("/home");
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setError(true);
      });
  };
  return (
    <div className="main-container">
      <div className="two-factor-portal">
        {visible && <h3>Set up Two-factor Authentication</h3>}
        {visible && (
          <h4>
            Scan this QR image into your authenticator app such as Google
            Authenticator
          </h4>
        )}
        {visible && <img src={slika} alt="QR Code" />}
        {visible && (
          <h4>If you can't scan the image, enter this code instead</h4>
        )}
        {visible && (
          <button onClick={() => setClick(!click)}>
            {click ? "Hide Manual Key" : "Show Manual Key"}
          </button>
        )}
        {click && (
          <input
            type="text"
            value={localStorage.getItem("key")}
            readOnly
            className="inp"
          />
        )}
        {visible && <h4 id="digit-text">Enter the 6-digit code</h4>}
        {!visible && (
          <div id="lock-logo">
            <img src="https://static-00.iconduck.com/assets.00/lock-icon-419x512-h1mk7mwx.png"></img>
          </div>
        )}
        {!visible && <h3>Welcome back</h3>}
        {!visible && <h5>Please enter your 6-digit code</h5>}
        <div className={visible ? "digit-inputs" : "digit-visible"}>
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              id={`digit-${index}`}
              data-testid={`digit-${index}`}
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
    </div>
  );
}

export default TwoFactorPortal;
