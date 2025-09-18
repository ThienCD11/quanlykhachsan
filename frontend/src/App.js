import axios from "axios";
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import HomePage from './pages/HomePage';
import RoomPage from "./pages/RoomPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;
