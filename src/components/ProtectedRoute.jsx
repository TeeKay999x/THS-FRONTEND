import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  if (!isLoggedIn) {
    // Drop back to the authentication screen if the login flag isn't active
    return <Navigate to="/admin/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;