import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import IntroLogo from './components/IntroLogo';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/map" element={<MapView />} />
    </Routes>
  );
}

export default App;
