import React, { useState } from 'react';
// 💡 BƯỚC 1: Thêm useLocation để nhận biết trang nào đang mở nhằm đổi màu Menu động
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  ChevronDown, 
  Users, 
  Layers, 
  AlertTriangle, 
  BarChart3,
  LayoutTemplate 
} from 'lucide-react'; 

export default function SideBar() {
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(true);
  const location = useLocation(); // Lấy đường dẫn hiện tại của trình duyệt

  // Hàm tiện ích: Kiểm tra xem menu có đang được kích hoạt hay không để tự động sáng màu
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-10 shadow-sm h-screen sticky top-0">
      <div className="h-16 flex items-center justify-center border-b border-slate-100">
        <h2 className="font-extrabold text-2xl tracking-wide text-blue-600">
          JobPortal<span className="text-slate-800">Admin</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
        
        {/* Dashboard (💡 Đã đổi màu động bằng hàm isActive) */}
        <Link 
          to="/admin" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            isActive('/admin') 
              ? 'bg-blue-50 text-blue-700' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <div className="pt-5 pb-2">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Vận Hành</p>
        </div>

        {/* Quản lý hệ thống (Dropdown Menu) */}
        <div>
          <button
            onClick={() => setIsSystemMenuOpen(!isSystemMenuOpen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname.includes('/admin/moderation')
                ? 'text-blue-700 font-semibold bg-slate-50/50'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5" />
              <span>Quản lý hệ thống</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isSystemMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSystemMenuOpen && (
            <div className="pl-11 pr-3 py-2 space-y-1.5 border-l-2 border-slate-100 ml-5 mt-1">
              {/* 💡 BƯỚC 2: Truyền thêm query ?tab=... để trang nhận biết cần mở tab nào */}
              <Link 
                to="/admin/moderation?tab=companies" 
                className={`block py-1.5 text-sm transition-colors ${
                  location.pathname === '/admin/moderation' && location.search.includes('tab=companies')
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-blue-600 font-medium'
                }`}
              >
                Duyệt doanh nghiệp
              </Link>
              <Link 
                to="/admin/moderation?tab=jobs" 
                className={`block py-1.5 text-sm transition-colors ${
                  location.pathname === '/admin/moderation' && (location.search.includes('tab=jobs') || location.search === '')
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-blue-600 font-medium'
                }`}
              >
                Kiểm duyệt tin đăng
              </Link>
            </div>
          )}
        </div>

        {/* Quản lý tài khoản */}
        <Link 
          to="/admin/users" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive('/admin/users') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Quản lý tài khoản</span>
        </Link>

        {/* Quản lý danh mục (💡 Đã sửa thêm Icon Layers và chỉnh lề chữ đều đặn) */}
        <Link 
          to="/admin/categories" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive('/admin/categories') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Quản lý danh mục</span>
        </Link>

        {/* Quản lý mẫu CV */}
        <Link 
          to="/admin/cv-templates" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive('/admin/cv-templates') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <LayoutTemplate className="w-5 h-5" />
          <span>Quản lý mẫu CV</span>
        </Link>

        {/* Báo cáo vi phạm */}
        <Link 
          to="/admin/reports" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive('/admin/reports') ? 'bg-red-50 text-red-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          <span>Báo cáo vi phạm</span>
        </Link>

        <div className="pt-5 pb-2">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Phân Tích</p>
        </div>

        {/* Báo cáo thống kê */}
        <Link 
          to="/admin/statistics" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive('/admin/statistics') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Báo cáo thống kê</span>
        </Link>
      </nav>
    </aside>
  );
}