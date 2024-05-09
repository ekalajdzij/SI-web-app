import "../css/Login.css";
import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login({ QR, visib, supe}) {
  const { instance } = useMsal();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [warning, setWarning] = useState(false);

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
    setFlag(JSON.parse(localStorage.getItem("isLoggedIn")) || false);
    setIme(localStorage.getItem("ime") || null);
    const numberOfActiveAccounts = instance.getAllAccounts().length;
     if(flag)
    if (!numberOfActiveAccounts) {
      localStorage.setItem("imee", "neautorizovanno");
      localStorage.setItem("isLoggedIn", "false");
      //localStorage.removeItem("accessToken");
      localStorage.removeItem("decodedToken");
      setFlag(false);
    }

    if (!flag) {
      //localStorage.removeItem("accessToken");
      localStorage.removeItem("decodedToken");
      //setAccessToken(null);
    }

    if (accessToken) {
      setDecodedToken(localStorage.getItem("decodedToken") || null);
    }
  }, []);

  /*useEffect(() => {
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
  }, [instance]);*/

  const getAccessToken = () => {
    return new Promise((resolve, reject) => {
      const accounts = instance.getAllAccounts();

      if (accounts.length > 0) {
        const request = {
          account: accounts[accounts.length - 1],
          scopes: ["https://graph.microsoft.com/.default"],
        };

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
            localStorage.setItem("isLoggedIn", "true");
            setFlag(true);

            getAccessToken()
              .then(({ decodedAcc, decodedId, accessToken }) => {
                localStorage.setItem("ime", `Welcome ${decodedAcc.name}`);
                setIme(`Welcome ${decodedAcc.name}`);
                setDecodedToken(decodedAcc);
                localStorage.setItem("isLoggedInVia2fa", "false");

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
    }
  };

  const handleLog = async (e) => {
    e.preventDefault();

    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);

    await axios
      .post("http://localhost:5200/api/login", {
        Username: user,
        Password: pass,
      })
      .then((response) => {
        console.log(response)
        localStorage.setItem("company", response.data.companyId);
        localStorage.setItem("companyName", response.data.name);
        localStorage.setItem("ime", response.data.username);
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("isSuperAdmin",response.data.isSuperAdmin)
        supe(response.data.isSuperAdmin)
        console.log("Token na loginu:", response.data.token);
        if (
          response.data.secretKey == "" ||
          response.data.secretKey == "default" ||
          response.data.secretKey == undefined
        ) {
          visib(true);
          localStorage.setItem("logged", true);
          axios
            .post("http://localhost:5200/api/login/setup/2fa", {
              Username: user,
              Password: pass,
            }
              
            )
            .then((response) => {
              localStorage.setItem("QR", response.data.qrCodeImageUrl);
              localStorage.setItem("key", response.data.manualEntryKey);
              QR(response.data.qrCodeImageUrl);
              navigate("/twofactor");
            })
            .catch((error) => {
              console.error("Greška prilikom logiranja:", error);
            });
        } else {
          localStorage.setItem("logged", false);
          visib(false);
          navigate("/twofactor");
        }
      })
      .catch((error) => {
        console.error("Greška prilikom logiranja:", error);
        setWarning(true);
        setUser("");
        setPass("");
      });
  };

  useEffect(() => {
    if (user != "" || pass != "") {
      setWarning(false);
    }
  }, [user, pass]);

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
            <form id="loginForm" className="login-form">
              <input
                type="text"
                placeholder="Username or phone number"
                id="username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="inputs"
              />
              <input
                type="password"
                className="inputs"
                placeholder="Password"
                id="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              {warning && <p id="errorLogin">Invalid login data</p>}

              <button
                id="loginButton"
                onClick={(e) => {
                  handleLog(e);
                }}
                type="submit"
              >
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
            <p id="redirect">
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
