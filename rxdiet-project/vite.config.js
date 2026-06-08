// Configures Vite to build and serve the React frontend.
// The React plugin enables JSX transformation and development refresh behavior.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
