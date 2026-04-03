// ==============================
// Main Application Routing
// ==============================

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage"; // Authentication page component
import Dashboard from "./pages/Dashboard"; // Dashboard component for authenticated users
import RequireAuth from "./context/RequireAuth"; // Higher-order component for authentication protection

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirects root `/` to `/auth` */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Public Route: Authentication Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Route: Dashboard (Requires Authentication) */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        {/* Catch-all Route: 404 Page */}
        <Route path="*" element={<p>404 - Not Found</p>} />
      </Routes>
    </Router>
  );
}

export default App;
