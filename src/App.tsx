import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import OnboardSchool from './pages/OnboardSchool.js';
import SetupClasses from './pages/SetupClasses.js';
import Dashboard from './pages/Dashboard.js';

// Route protection context session wall helper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('edubuddy_token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ========================================================= */}
        {/* PUBLIC ROUTES                                             */}
        {/* Open entry points — accessible without an active session  */}
        {/* ========================================================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* This path is now fully accessible for initial school setups */}
        <Route path="/onboard" element={<OnboardSchool />} />

        {/* ========================================================= */}
        {/* PRIVATE PROTECTED ROUTES                                  */}
        {/* Locked beneath token validation verification guards      */}
        {/* ========================================================= */}
        <Route 
          path="/setup-classes" 
          element = {
            <ProtectedRoute>
              <SetupClasses />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard" 
          element = {
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback Catch-all Route redirecting to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;