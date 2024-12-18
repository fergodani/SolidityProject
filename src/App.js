import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes para las páginas
import Bank from './components/Bank/Bank';
import Tikets from './components/Tikets/Tikets';
import Home from './components/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/tikets" element={<Tikets />} />
      </Routes>
    </Router>
  );
}

export default App;
