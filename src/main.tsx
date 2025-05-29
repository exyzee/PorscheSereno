import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ReactGA from 'react-ga4'

// Only set up Google Analytics if it's enabled and we have an ID
const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

if (enableAnalytics && gaMeasurementId) {
  try {
    ReactGA.initialize(gaMeasurementId)
    console.log('Google Analytics initialized with ID:', gaMeasurementId)
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error)
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/Sereno---Dashboard-1">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
