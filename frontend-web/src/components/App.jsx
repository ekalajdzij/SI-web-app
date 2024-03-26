import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../css/App.css";
import Login from "./Login";
import Register from "./Register";

import Home from "./Home"; // Pretpostavljamo da imate komponentu RouteMap
import TwoFactorPortal from "./TwoFactorPortal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/twofactor" element={<TwoFactorPortal />} />

      </Routes>
    </Router>
  );
}

export default App;
