import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
// import Login from './components/Login';
import RegisterTypeSelection from './components/RegisterTypeSelection';
import RegisterSupplier from './components/RegisterSupplier';
import RegisterOwner from './components/RegisterOwner';
import Login from './components/Login';
import OwnerChoises from './components/OwnerChoises';
import SupplierChoises from './components/SupllierChoises';




function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterTypeSelection />} />
        <Route path="/register/supplier" element={<RegisterSupplier />} />
        <Route path="/register/owner" element={<RegisterOwner />} />
        <Route path="/owner/ownerchises" element={<OwnerChoises/>}></Route>
        <Route path="/supplier/supllierchoises" element={<SupplierChoises/>}></Route>

      </Routes>
    </Router>
    
  );
}

export default App;



