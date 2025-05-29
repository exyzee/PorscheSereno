import { Routes, Route } from 'react-router-dom';
import HomeContent from './pages/HomeContent';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import MapContent from './pages/MapContent';
import ProfileContent from './pages/ProfileContent';
import DashboardLayout from './layout/DashboardLayout';
import './App.css';

// App handles all the main routes. Each page gets the dashboard layout.
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Home (default) */}
        <Route path="/" element={
          <DashboardLayout>
            <HomeContent />
          </DashboardLayout>
        } />
        {/* Map view */}
        <Route path="/map" element={
          <DashboardLayout>
            <MapContent />
          </DashboardLayout>
        } />
        {/* User settings */}
        <Route path="/settings" element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        } />
        {/* Analytics dashboard */}
        <Route path="/dashboard" element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        } />
        {/* User profile */}
        <Route path="/profile" element={
          <DashboardLayout>
            <ProfileContent />
          </DashboardLayout>
        } />
      </Routes>
    </div>
  );
}

export default App;
