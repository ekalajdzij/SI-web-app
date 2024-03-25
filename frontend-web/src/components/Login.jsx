import "../css/Login.css";
import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const baseURL = process.env.VITE_BASE_URL;
  const { instance } = useMsal();
  const [flag, setFlag] = useState(
    JSON.parse(localStorage.getItem("isLoggedIn")) || false
  );
  const [decodedToken, setDecodedToken] = useState(
    localStorage.getItem("decodedToken") || null
  );
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [ime, setIme] = useState(localStorage.getItem("ime") || null);
  let navigate = useNavigate();

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken") || null);
    setFlag(JSON.parse(localStorage.getItem("isLoggedIn")) || null);
    setIme(localStorage.getItem("ime") || null);
    const numberOfActiveAccounts = instance.getAllAccounts().length;

    if (!numberOfActiveAccounts) {
      localStorage.setItem("ime", "neautorizovano");
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("decodedToken");
      setFlag(false);
    }

    if (!flag) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("decodedToken");
      setAccessToken(null);
    }

    /*console.log(accessToken)
        console.log(flag);*/

    if (accessToken) {
      setDecodedToken(localStorage.getItem("decodedToken") || null);
    }
  }, []);

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken") || null);
    setFlag(JSON.parse(localStorage.getItem("isLoggedIn")) || null);
    setIme(localStorage.getItem("ime") || null);

    if (!flag) {
      setAccessToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("decodedToken");
    }

    const checkLoginStatus = async () => {
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          try {
            const decoded = jwtDecode(accessToken);
            setDecodedToken(decoded);
            localStorage.setItem("decodedToken", decoded);
            setFlag(true);
          } catch (error) {
            console.error("Token nije validan:", error);
            setFlag(false);
            localStorage.removeItem("accessToken");
            localStorage.setItem("isLoggedIn", "false");
          }
        }
      } else {
        localStorage.removeItem("decodedToken");
        localStorage.setItem("isLoggedIn", "false");
        setFlag(false);
        setDecodedToken(null);
      }
    };

    checkLoginStatus();
  }, [instance]);

  const getAccessToken = () => {
    return new Promise((resolve, reject) => {
      const accounts = instance.getAllAccounts();
      //console.log(accounts.length - 1);

      if (accounts.length > 0) {
        const request = {
          account: accounts[accounts.length - 1],
          scopes: ["https://graph.microsoft.com/.default"],
        };
        s;
        instance
          .acquireTokenSilent(request)
          .then((response) => {
            console.log("Access Token:", response.accessToken);
            console.log("Id Token:", response.idToken);
            const decodedAcc = jwtDecode(response.accessToken);
            const decodedId = jwtDecode(response.idToken);
            localStorage.setItem("accessToken", response.accessToken);
            resolve({
              decodedAcc,
              decodedId,
              accessToken: response.accessToken,
            });
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      } else {
        reject("No accounts found");
      }
    });
  };

  const handleLogin = (loginType) => {
    if (loginType === "popup") {
      instance
        .loginPopup()
        .then((response) => {
          if (response.account.username.endsWith("@etf.unsa.ba")) {
            //console.log(response);
            localStorage.setItem("isLoggedIn", "true");
            setFlag(true);

            getAccessToken()
              .then(({ decodedAcc, decodedId, accessToken }) => {
                localStorage.setItem("ime", `Welcome ${decodedAcc.name}`);
                setIme(`Welcome ${decodedAcc.name}`);
                setDecodedToken(decodedAcc);
                console.log("Decoded Token:", decodedAcc);

                if (decodedId.roles !== undefined) {
                  console.log("Role:", decodedId.roles[0]);
                }

                navigate("/home");
              })
              .catch((error) => {
                console.error("Error fetching access token:", error);
              });
          } else {
            handleLogout();
          }
        })
        .catch((e) => {
          console.error(e);
          //handleLogout();
        });
    } else if (loginType === "form") {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      try {
        axios
          .post(baseURL + "api/login/", {
            username,
            password,
          })
          .then((response) => {
            console.log(response);
            /*
            if (response.data.username.endsWith("@etf.unsa.ba")) {
              localStorage.setItem("isLoggedIn", "true");
              setFlag(true);
              localStorage.setItem("ime", `Welcome ${response.data.name}`);
              setIme(`Welcome ${response.data.name}`);
              navigate("/home");
            } else {
              //
            }
            */
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    instance.logoutPopup();
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("decodedToken");
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("ime", "neautorizovano");
    setDecodedToken(null);
    setFlag(false);
  };

  return (
    <>
      <div className="main">
        <div className="cover-frame">
          <div className="login-frame">
            <h2>Login to your account</h2>
            <form id="loginForm" className="login-form" action="#">
              <input
                type="text"
                placeholder="Username or phone number"
                id="username"
              />
              <input type="password" placeholder="Password" id="password" />
              <button type="submit" onClick={() => handleLogin("form")}>
                Log in
              </button>
            </form>
            <button
              className="microsoft-button"
              onClick={() => handleLogin("popup")}
            >
              <img
                src="https://avatars.githubusercontent.com/u/31075795?s=280&v=4"
                alt="Microsoft Logo"
                className="button-logo"
              ></img>
              Log in with Microsoft
            </button>
            <p>
              Don't have an account?{" "}
              <Link id="linkToRegister" to="/register">
                Sign up here!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
