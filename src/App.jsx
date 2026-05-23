import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Storefront from './components/StoreFront';
import Checkout from './components/Checkout';
import AdminStocker from './components/AdminStocker';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<Storefront />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/secret-manager-ths-99" element={<AdminStocker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;