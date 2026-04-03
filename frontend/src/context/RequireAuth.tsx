// ==============================
// RequireAuth Component
// Protects routes by ensuring the user is authenticated
// ==============================

import { Navigate } from "react-router-dom";
import React from "react";

/**
 * Higher-order component that checks for authentication.
 * If a token exists in localStorage, it renders the children (protected content).
 * Otherwise, it redirects the user to the authentication page.
 */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/auth" replace />;
}

export default RequireAuth;