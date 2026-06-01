import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './view/user/LoginPage';
import HomePage from './view/user/page/HomePage';
import AdminPage from './view/admin/AminPage';
import AdminLoginPage from './view/admin/AdminLoginPage';
import EmployerPage from './view/employer/EmployerPage';
import JobDetail from './view/user/page/JobDetail';

function App() {
  return (
    <>    
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/employer" element={<EmployerPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
