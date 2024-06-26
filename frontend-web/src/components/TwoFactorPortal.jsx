import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/TwoFactorPortal.css";

function TwoFactorPortal({ qrcode, vis, signed, isSuper }) {
  let navigate = useNavigate();
  const [slika, setSlika] = useState(qrcode);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [click, setClick] = useState(false);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(vis);
  //const [isSuperAdmin, setSuperAdmin] = useState(isSuper || false);
  const [company, setCompId] = useState(localStorage.getItem("company"));

  const pin = digits.join("");

  const handleDigitChange = (digit, index) => {
    const newDigits = [...digits];
    newDigits[index] = digit.slice(-1); 
    setDigits(newDigits);

    
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
    else setError(false);
  }, [pin]);
  
  const handleLog2fa = async () => {
   await axios
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
      .then(async (response) => {
        if (response.headers.authorization) {
          //console.log(response.headers.authorization);
          localStorage.setItem("accessToken", response.headers.authorization);
        }

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isLoggedInVia2fa", true);
        localStorage.setItem("logged", false);
        signed(true);

        if (isSuper) {
          try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
              "https://fieldlogistics-control.azurewebsites.net/api/company",
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );
    
            localStorage.setItem('homeScreen','superadmin')
            const data = response.data;
            localStorage.setItem("companyData", JSON.stringify(data));
            //console.log(data);
          } catch (error) {
            console.error("There was a problem with fetching company data:", error);
          }
        } else {
          localStorage.setItem('homeScreen','admin')

          try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
              "https://fieldlogistics-control.azurewebsites.net/api/user",
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );
    
            //console.log(response);
            const data = response.data;
            localStorage.setItem("userData", JSON.stringify(data));
            //console.log(data);
          } catch (error) {
            console.error("There was a problem with fetching user data:", error);
          }
    
          try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
              `https://fieldlogistics-control.azurewebsites.net/api/campaigns/company/${company}`,
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );
    
            // console.log(response);
            const data1 = response.data;
           
            localStorage.setItem("campaignData", JSON.stringify(data1));
            //console.log(data1);
          } catch (error) {
            console.error("There was a problem with fetching campaign data:", error);
          }
        }

        navigate("/home");
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setError(true);
        setVisible(JSON.parse(localStorage.getItem("logged")));
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
