import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Login from "./Login";
import Company from "./Company";
import Error from "./Error";
import Register from "./Register";
import TwoFactorPortal from "./TwoFactorPortal";
import "../css/App.css";
import CRUDadmin from "./CRUDadmin";
import CRUDuser from "./CRUDuser";
import CampaignView from "./CampaignView";
import UserCampaignCRUD from "./UserCampaignCRUD";
import Locations from "./Locations";
import Map from "./Map";
import Records from "./Records";





// Komponenta za kontrolu prikaza Navbar-a
function ControlNavbar({signed,isSuperAdmin}) {
  const location = useLocation();
  if (location.pathname !== "/" && location.pathname !== "/register" && location.pathname !== "/twofactor") {
    return <Navbar signed={signed} isSuperAdmin={isSuperAdmin} />;
  }
  return null;
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [qr, setQR] = useState("default");
  const [visible, setVisible] = useState(false);
  const [back, setBack] = useState(false);

  const [signedIn, setSigned] = useState(JSON.parse(localStorage.getItem('isLoggedInVia2fa')) || false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isSuperAdmin, setSuperAdmin] = useState(false);

  const setSuperfunction = (x) => {
    setSuperAdmin(x);
  }
 useEffect(()=>{
  if (
    localStorage.getItem('isSuperAdmin') !== undefined &&
    localStorage.getItem('isSuperAdmin') !== null &&
    (localStorage.getItem('isSuperAdmin') === "true" || localStorage.getItem('isSuperAdmin') === 'true' || localStorage.getItem('isSuperAdmin') === true)
  ) {
    setSuperAdmin(true);
  } else {
    setSuperAdmin(false);
  }


  if (
    localStorage.getItem('isLoggedInVia2fa') !== undefined &&
    localStorage.getItem('isLoggedInVia2fa') !== null &&
    (localStorage.getItem('isLoggedInVia2fa') === "true" || localStorage.getItem('isLoggedInVia2fa') === 'true' || localStorage.getItem('isLoggedInVia2fa') === true)
  ) {
    setSigned(true);
  } else {
    setSigned(false);
  }
 },[])


 /* useEffect(() => {
    
    if (signedIn && location.pathname === "/") {
      navigate("/home");
    } 
  }, [signedIn, location.pathname]);*/

  const setVisfunction = (x) => {
    setVisible(x);
  }
  const setGoBack = (x) => {
    setBack(x);
  }
  const signed = (x) => {
    setSigned(x);
  }

  const setQRfunction = (x) => {
    setQR(x);
  }

  return (
      <div>
        <ControlNavbar signed={signed} isSuperAdmin={isSuperAdmin} />
        <Routes>
          <Route path="/home" element={signedIn ? <Home  isSuper={isSuperAdmin}/> : <Error />} />
          <Route path="/" element={<Login QR={setQRfunction} visib={setVisfunction} supe={setSuperfunction} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={(isSuperAdmin && signedIn) ? <CRUDadmin /> : <Error />} />
          <Route path="/users" element={(!isSuperAdmin && signedIn) ? <CRUDuser /> : <Error />} />
          <Route path="/campaign" element={(!isSuperAdmin && signedIn) ? <CampaignView /> : <Error />} />
          <Route path="/usercamp" element={(!isSuperAdmin && signedIn) ? <UserCampaignCRUD /> : <Error />} />
          <Route path="/location" element={(!isSuperAdmin && signedIn) ? <Locations setGoBack={setGoBack} /> : <Error />} />
          <Route path="/map" element={(!isSuperAdmin && signedIn) ? <Map setGoBack={setGoBack} /> : <Error />} />
          <Route path="/record" element={(!isSuperAdmin && signedIn) ? <Records back={back} /> : <Error />} />

          <Route path="/company" element={(isSuperAdmin && signedIn) ? <Company /> : <Error />} />
          <Route path="/twofactor" element={<TwoFactorPortal qrcode={qr} vis={visible} signed={signed} isSuper={isSuperAdmin} />} />
        </Routes>
      </div>
  );
}

export default AppWrapper;