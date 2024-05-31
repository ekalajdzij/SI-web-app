import React, { useState, useEffect } from "react";
import "../css/Navbar.css";
import { useMsal } from "@azure/msal-react";
import axios from "axios";

import { Link, ScrollLink } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router-dom";

function Navbar({ signed, isSuperAdmin }) {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [isSuper, setIsSuper] = useState(isSuperAdmin || false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const { instance } = useMsal();
  let navigate = useNavigate();

  const [flag, setFlag] = useState(true);

  const handleLogout = () => {
    if (JSON.parse(localStorage.getItem("isLoggedInVia2fa")) == true) {
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("accessToken");
      localStorage.setItem("isLoggedInVia2fa", false);
      localStorage.setItem("ime", "neautorizovano");
      localStorage.setItem("user", "");
      signed(false);
      navigate("/");
    } else {
      instance.logoutPopup().then((r) => {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("accessToken");
        localStorage.setItem("isLoggedIn", "false");
        localStorage.setItem("ime", "neautorizovano");
        localStorage.setItem("user", "");

        navigate("/");
      });
    }
  };

  async function fetchAdminData() {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "https://fieldlogistics-control.azurewebsites.net/api/admin",
        {
          method: "GET",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("accessToken", [...response.headers][0][1]);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      //console.log(data);
      localStorage.setItem("adminData", JSON.stringify(data));

      //console.log("Podaci su uspješno dohvaćeni i pohranjeni.");
      navigate("/admin");
    } catch (error) {
      console.error("Došlo je do greške pri dohvaćanju podataka:", error);
    }
  }

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isLoggedInVia2fa") !== "undefined")
      setFlag(JSON.parse(localStorage.getItem("isLoggedInVia2fa")));
    if (localStorage.getItem("isSuperAdmin") !== "undefined")
      setIsSuper(JSON.parse(localStorage.getItem("isSuperAdmin")) || false);
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `/user-manual-web.pdf`;
    link.setAttribute("download", "example.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <i
            className="fas fa-info"
            style={{ color: "white", cursor: "pointer", marginRight: "50px" }}
            onClick={handleDownload}
          />

          <i
            className="fas fa-map-marker-alt"
            style={{ color: "white", marginRight: "-20px" }}
          />
          <p id="nav-title">Field Logistic Control</p>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            {flag && (
              <li className="nav-item">
                <RouterLink
                  to="/home"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Home
                </RouterLink>
              </li>
            )}
            {isSuper && flag && (
              <li className="nav-item">
                <RouterLink
                  to="/company"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Companies
                </RouterLink>
              </li>
            )}
            {isSuper && flag && (
              <li className="nav-item">
                <RouterLink className="nav-links" onClick={fetchAdminData}>
                  Admins
                </RouterLink>
              </li>
            )}
            {!isSuper && flag && (
              <li className="nav-item">
                <RouterLink
                  to="/users"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Users
                </RouterLink>
              </li>
            )}
            {!isSuper && flag && (
              <li className="nav-item">
                <RouterLink
                  to="/campaign"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Campaigns
                </RouterLink>
              </li>
            )}

            <li>
              <RouterLink
                to="/"
                className="nav-links-mobile"
                onClick={flag ? handleLogout : () => navigate("/")}
              >
                {flag ? "SIGN OUT" : "SIGN IN"}
              </RouterLink>
            </li>
          </ul>
          {button &&
            (flag ? (
              <button className="loginout" onClick={handleLogout}>
                SIGN OUT
              </button>
            ) : (
              <button
                className="loginout"
                onClick={() => {
                  navigate("/");
                }}
              >
                SIGN IN
              </button>
            ))}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
