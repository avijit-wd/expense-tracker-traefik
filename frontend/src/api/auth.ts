// ==============================
// Authentication API Calls
// Handles user signup and login
// ==============================

import axios from "axios";
import { API_BASE_URL } from "../config";

/**
 * Sends a signup request to the backend.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A success message if registration is successful.
 * @throws An error message if signup fails.
 */
export const signup = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, { email, password });
    return response.data; // Expected response: { message: "User registered successfully" }
  } catch (error: any) {
    throw error.response?.data?.detail || "Signup failed";
  }
};

/**
 * Sends a login request to the backend.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns An object containing the access token and token type.
 * @throws An error message if login fails.
 */
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data; // Expected response: { access_token: "jwt-token", token_type: "bearer" }
  } catch (error: any) {
    throw error.response?.data?.detail || "Login failed";
  }
};