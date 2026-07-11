import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
export default function Layout () {
  // 1. Lấy thông tin user từ localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); 

  // 2. Kiểm tra xem có phải admin không
  const isAdmin = user && user.role === 'admin';

  // 3. Nếu KHÔNG PHẢI admin -> Đá văng về trang login ngay lập tức, không chạy code bên dưới
  if (!token || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
        <Footer/>
      </div>
    </div>
  );
}