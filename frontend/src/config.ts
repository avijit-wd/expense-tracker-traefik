// ==============================
// API Configuration
// ==============================

/**
 * The base URL for API requests.
 * - `VITE_API_BASE_URL` is only set when running `npm run dev -- --mode development`
 * - In other cases (e.g., Docker containers), it falls back to `"http://localhost/api"`
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost/api";

export { API_BASE_URL };
