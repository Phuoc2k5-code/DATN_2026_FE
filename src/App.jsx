import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// candidate
import Layout from './layouts/layout_user/Layout';
import LoginPage from './views/auth/LoginPage';
import HomePage from './views/user/HomePage';
import JobDetail from './views/user/JobDetail';
import UserProfile from './views/user/UserProfile';
import CVManagement from './views/user/CVManagement';
import SavedJobs from './views/user/SavedJobs';
import AppliedJobs from './views/user/AppliedJobs';
import CompanyDetail from './views/user/CompanyDetail';
// admin
import AdminLoginPage from './views/auth/AdminLoginPage';
import AdminPage from './views/admin/AdminPage';
// employer
import EmployerPage from './views/employer/EmployerPage';


function App() {
  return (
    <>    
      <BrowserRouter>
        <Routes>          
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/cv-management" element={<CVManagement />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/application-history" element={<AppliedJobs />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
          </Route>
          <Route path="/employer" element={<EmployerPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
