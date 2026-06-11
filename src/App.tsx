import React from 'react';
// FIXED: Changed 'react-router' to 'react-router-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeacherLogin from './pages/TeacherLogin';
import TeacherSignup from './pages/TeacherSignup';
import StudentPlay from './pages/StudentPlay';
import LandingPage from './pages/LandingPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<TeacherLogin />} />
        <Route path="/signup" element={<TeacherSignup />} />
        <Route path="/play" element={<StudentPlay />} />

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="teacher" element={<TeacherDashboard />} />
          <Route path="student" element={<StudentDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;