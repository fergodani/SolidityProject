import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes para las páginas
import Bank from './components/Bank/Bank';
import Tikets from './components/Tikets/Tikets';
import Home from './components/Home/Home';
import RealState from './components/RealState/RealState';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/tikets" element={<Tikets />} />
        <Route path="/state" element={<RealState />} />
      </Routes>
    </Router>
  );
}

export default App;
