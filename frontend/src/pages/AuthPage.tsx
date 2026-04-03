// ==============================
// Authentication Page (Sign Up & Log In)
// ==============================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../api/auth";

function AuthPage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true); // Controls form mode (Sign Up/Login)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  /**
   * Handles input changes and updates form state.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission for login or signup.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password confirmation for sign-up
    if (isSignup && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (isSignup) {
        await signup(formData.email, formData.password);
        alert("Signup successful! You can now log in.");
        setIsSignup(false); // Switch to login mode
      } else {
        const result = await login(formData.email, formData.password);
        localStorage.setItem("token", result.access_token); // Store JWT token
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-lg border-4 border-amber-500">
        
        {/* Page Title */}
        <h2 className="text-3xl font-bold text-center text-amber-500 mb-4">
          {isSignup ? "Sign Up" : "Log In"}
        </h2>

        {/* Display error message if any */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-amber-500 bg-gray-100 text-gray-900 rounded placeholder-gray-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-amber-500 bg-gray-100 text-gray-900 rounded placeholder-gray-500"
          />

          {isSignup && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border border-amber-500 bg-gray-100 text-gray-900 rounded placeholder-gray-500"
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-500 text-gray-900 p-2 rounded hover:bg-amber-600 transition"
          >
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        {/* Toggle between Sign Up and Log In */}
        <p className="text-sm text-center mt-4 text-gray-300">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-amber-500 underline"
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;