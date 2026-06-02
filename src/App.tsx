import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import OnboardSchool from './pages/OnboardSchool.js';
import SetupClasses from './pages/SetupClasses.js';
import Dashboard from './pages/Dashboard.js';
import ClassDashboard from './pages/ClassDashboard.js';
import CreateAssignment from './pages/CreateAssignment.js';
import AdminPanel from './pages/AdminPanel.js';
import ForgotPassword from './pages/ForgotPassword.js';
import ResetPassword from './pages/ResetPassword.js';
import WorkspaceFinder from './pages/WorkspaceFinder';
import LandingPage from './pages/LandingPage.js';

// Route protection context session wall helper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('edubuddy_token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Workspace specific routes */}
        <Route path="/:schoolId/login" element={<Login />} />
        <Route path="/:schoolId/forgot-password" element={<ForgotPassword />} />
        <Route path="/:schoolId/reset-password" element={<ResetPassword />} />

        {/* Public marketing + workspace finder */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace" element={<WorkspaceFinder />} />
        <Route path="/login" element={<WorkspaceFinder />} />
        
        {/* PUBLIC ROUTES */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboard" element={<OnboardSchool />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* PRIVATE PROTECTED ROUTES */}
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

        <Route 
          path="/dashboard/classes/:classId" 
          element = {
            <ProtectedRoute>
              <ClassDashboard />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/dashboard/classes/:classId/assignments/new"
          element={
            <ProtectedRoute>
              <CreateAssignment />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/:schoolId/admin" 
          element = {
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />

        {/* Fallback Catch-all Route redirecting to root workspace finder */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;