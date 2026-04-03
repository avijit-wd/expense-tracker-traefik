// ==============================
// Main Entry Point for the React App
// ==============================

import { StrictMode } from 'react';  // Enables React's strict mode for highlighting potential issues
import { createRoot } from 'react-dom/client';  // Modern ReactDOM API for concurrent mode
import App from './App.tsx';  // Import the root component of the application
import './styles/global.css';  // Global CSS styles

// Ensure the root element exists before rendering
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found. Ensure there is a <div id='root'></div> in your HTML.");
}

// Render the application inside the root element
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);