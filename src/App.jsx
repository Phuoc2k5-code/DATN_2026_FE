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
import AiJobs from './views/user/AIJobs';
import CreateCV from './views/user/CreateCV';
import UpdateCV from './views/user/CreateCV';
import CVPreviewAndTemplate from './views/user/CVPreviewAndTemplate';
// admin
import AdminLoginPage from './views/auth/AdminLoginPage';
import LayoutAdmin from './layouts/layout_admin/Layout';
import AdminDashboard from './views/admin/AdminDashboard';
import ReportManagement from './views/admin/ReportManagement';
import UserManagement from './views/admin/UserManagement';
import CVTemplateManagement from './views/admin/CVTemplateManagement';
import CategoryManagement from './views/admin/CategoryManagement';
import StatisticalReport from './views/admin/StatisticalReport';
import SystemModeration from './views/admin/SystemModeration';

// employer
import EmployerPage from './views/employer/EmployerPage';
import EmployerProfile from './views/employer/EmployerProfile';

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
            <Route path="/ai-suggestions" element={<AiJobs />} />
            <Route path="/cv-management/create-cv" element={<CreateCV />} />
            <Route path="/cv-management/edit-cv/:id" element={<UpdateCV />} />
            <Route path="/cv-management/preview-cv/:id" element={<CVPreviewAndTemplate />} />
          </Route>
          <Route path="/employer" element={<EmployerPage />} />
          <Route path="/employer/profile" element={<EmployerProfile />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<LayoutAdmin/>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<ReportManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/cv-templates" element={<CVTemplateManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/statistics" element={<StatisticalReport />} />
           <Route path="/admin/moderation" element={<SystemModeration />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
