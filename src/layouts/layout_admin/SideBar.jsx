import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  ChevronDown, 
  Users, 
  Layers, 
  AlertTriangle, 
  BarChart3,
  LayoutTemplate // Thêm icon LayoutTemplate cho quản lý mẫu CV
} from 'lucide-react'; 

export default function SideBar() {
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(true);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-10 shadow-sm h-screen">
      <div className="h-16 flex items-center justify-center border-b border-slate-100">
        <h2 className="font-extrabold text-2xl tracking-wide text-blue-600">
          JobPortal<span className="text-slate-800">Admin</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
        
        {/* Dashboard */}
        <Link to="/admin" className="flex items-center space-x-3 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-semibold transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <div className="pt-5 pb-2">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Vận Hành</p>
        </div>

        {/* Quản lý hệ thống */}
        <div>
          <button
            onClick={() => setIsSystemMenuOpen(!isSystemMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5" />
              <span>Quản lý hệ thống</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isSystemMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSystemMenuOpen && (
            <div className="pl-11 pr-3 py-2 space-y-1.5 border-l-2 border-slate-100 ml-5 mt-1">
              <a href="#" className="block py-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">Duyệt doanh nghiệp</a>
              <a href="#" className="block py-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">Kiểm duyệt tin đăng</a>
            </div>
          )}
        </div>

        {/* Quản lý tài khoản */}
        <Link to="/admin/users" className="flex items-center space-x-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
          <Users className="w-5 h-5" />
          <span>Quản lý tài khoản</span>
        </Link>

        {/* Quản lý danh mục */}
        <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
          <Layers className="w-5 h-5" />
          <span>Quản lý danh mục</span>
        </a>

        {/* Quản lý mẫu CV (Mới thêm) */}
        <Link to="/admin/cv-templates" className="flex items-center space-x-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
          <LayoutTemplate className="w-5 h-5" />
          <span>Quản lý mẫu CV</span>
        </Link>

        {/* Báo cáo vi phạm */}
        <Link to="/admin/reports" className="flex items-center space-x-3 px-3 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors">
          <AlertTriangle className="w-5 h-5" />
          <span>Báo cáo vi phạm</span>
        </Link>

        <div className="pt-5 pb-2">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Phân Tích</p>
        </div>

        {/* Báo cáo thống kê */}
        <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
          <BarChart3 className="w-5 h-5" />
          <span>Báo cáo thống kê</span>
        </a>
      </nav>
    </aside>
  )
}