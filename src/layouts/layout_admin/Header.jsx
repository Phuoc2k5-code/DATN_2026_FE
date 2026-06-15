import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react'; // Dùng lucide-react cho đồng bộ dự án

export default function Header() {
  // 1. Lấy thông tin đường dẫn hiện tại từ Router
  const location = useLocation();

  // 2. Hàm ánh xạ: Cứ mỗi URL (path) sẽ tương ứng với một Tiêu đề
  const getPageTitle = (path) => {
    switch (path) {
      case '/':
      case '/dashboard':
        return 'Dashboard Tổng Quan';
      case '/admin/system':
        return 'Quản Lý Hệ Thống';
      case '/companies':
        return 'Quản Lý Doanh Nghiệp';
      case '/admin/cv-templates':
        return 'Quản Lý Mẫu CV';
      case '/admin/users':
        return 'Quản Lý Người Dùng';
      case '/admin/reports':
        return 'Báo cáo vi phạm';
      case '/admin/categories':
        return 'Quản Lý Danh Mục';
      case '/admin/statistics':
        return 'Báo cáo Thống Kê';
      case '/admin/moderation':
        return 'Quản Lý Hệ Thống';
      default:
        return 'Hệ Thống Quản Trị'; // Tiêu đề mặc định phòng hờ
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
      <div>
        {/* Tiêu đề thay đổi động dựa vào hàm getPageTitle */}
        <h2 className="text-xl font-bold text-slate-800 transition-all duration-200">
          {getPageTitle(location.pathname)}
        </h2>
      </div>

      <div className="flex items-center space-x-5">
        {/* Nút thông báo */}
        <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Thông tin Admin */}
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-5 cursor-pointer group">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
            alt="Admin"
            className="w-9 h-9 rounded-full ring-2 ring-slate-100 group-hover:ring-blue-100 transition-all"
          />
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Nguyễn Văn A</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}