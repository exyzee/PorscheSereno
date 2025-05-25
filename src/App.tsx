import { Routes, Route } from 'react-router-dom';
import HomeContent from './pages/HomeContent';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import MapContent from './pages/MapContent';
import DashboardLayout from './layout/DashboardLayout';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <DashboardLayout>
            <HomeContent />
          </DashboardLayout>
        } />
        <Route path="/map" element={
          <DashboardLayout>
            <MapContent />
          </DashboardLayout>
        } />
        <Route path="/settings" element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        } />
        <Route path="/dashboard" element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        } />
      </Routes>
    </div>
  );
}

export default App;
