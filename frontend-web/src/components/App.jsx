import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../css/App.css";
import Login from "./Login";
import Register from "./Register";

import Home from "./Home"; // Pretpostavljamo da imate komponentu RouteMap
import TwoFactorPortal from "./TwoFactorPortal";

function App() {
  const [qr, setQR] = useState("default");
  const [visible, setVisible] = useState();
  const setVisfunction=(x)=>{
    setVisible(x);
}

   const setQRfunction=(x)=>{
       setQR(x);
   }
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login QR={setQRfunction} visib={setVisfunction} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/twofactor" element={<TwoFactorPortal qrcode={qr} vis={visible}/>} />

      </Routes>
    </Router>
  );
}

export default App;
