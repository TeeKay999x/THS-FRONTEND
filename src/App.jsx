import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Storefront from './components/StoreFront';
import Checkout from './components/Checkout';

import AdminAuth from './components/AdminAuth';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          {/* 🛒 Public Customer Storefront Routes */}
          <Route path="/" element={<Storefront />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* 🔑 Public Admin Gateway (Login & Signup Interface Tabs) */}
          <Route path="/admin/auth" element={<AdminAuth />} />

          {/* 📋 Guarded Inventory Workspace Dashboard Studio */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* 🔄 Fallback Route: Redirects any undefined URL paths back to the home storefront */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;