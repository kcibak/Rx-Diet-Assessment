// Bootstraps the React application into the Vite-provided root element.
// StrictMode keeps development behavior aligned with React's recommended checks.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
