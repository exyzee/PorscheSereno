import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ReactGA from 'react-ga4'

// Initialize Google Analytics
// Get your Measurement ID from GA4:
// 1. Go to GA4 → Admin → Data Streams → Web
// 2. Create a new stream with a proper domain (e.g., https://your-app.netlify.app)
// 3. Copy the Measurement ID (G-XXXXXXXX)
ReactGA.initialize('G-XXXXXXXXXX'); // Replace with your actual GA4 measurement ID from the web stream

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/Sereno---Dashboard-1">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
