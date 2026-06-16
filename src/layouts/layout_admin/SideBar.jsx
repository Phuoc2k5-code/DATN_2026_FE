import React, { useState, useEffect, useRef } from 'react';
// Thêm useNavigate để điều hướng sau khi đăng xuất
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  ChevronDown, 
  Users, 
  Layers, 
  AlertTriangle, 
  BarChart3,
  LayoutTemplate,
  LogOut // Import icon đăng xuất
} from 'lucide-react'; 

export default function SideBar() {
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(true);
  const location = useLocation(); 
  const navigate = useNavigate(); // Hook dùng để chuyển trang
  
  // Dùng useRef để lưu trữ thời gian đếm ngược mà không làm re-render lại giao diện liên tục
  const timeoutRef = useRef(null);
  const FIFTEEN_MINUTES = 15 * 60 * 1000; // 15 phút đổi ra mili-giây

  // Hàm kiểm tra menu kích hoạt
  const isActive = (path) => location.pathname === path;

  // ================= THAO TÁC 1: HÀM XỬ LÝ ĐĂNG XUẤT THỦ CÔNG =================
  const handleLogout = () => {
    // 1. Xóa sạch mọi dấu vết lưu trữ ở Local và Session Storage
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
    sessionStorage.clear(); // Xóa sạch bộ nhớ phiên làm việc

    // Nếu bạn có API đăng xuất bên Laravel, có thể gọi fetch ở đây trước khi xóa token:
    /*
    fetch('http://127.0.0.1:8000/api/admin/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    */

    // 2. Đá Admin bay về trang đăng nhập
    navigate('/login');
  };

  // ================= THAO TÁC 2: TỰ ĐỘNG ĐĂNG XUẤT KHI BẤT ĐỘNG (15 PHÚT) =================
  const resetTimer = () => {
    // Nếu có bộ đếm cũ đang chạy, xóa nó đi để tính lại từ đầu
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Thiết lập bộ đếm mới, sau 15 phút bất động sẽ tự gọi hàm handleLogout
    timeoutRef.current = setTimeout(() => {
      alert('Phiên làm việc đã hết hạn do bạn không tương tác trong 15 phút. Hệ thống sẽ tự động đăng xuất!');
      handleLogout();
    }, FIFTEEN_MINUTES);
  };

  useEffect(() => {
    // Các sự kiện để nhận biết người dùng còn đang ngồi trước màn hình và thao tác
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    // Kích hoạt bộ đếm ngay khi Admin vừa tải trang SideBar lần đầu tiên
    resetTimer();

    // Lắng nghe tất cả hành động của người dùng, hễ cử động là reset lại 15 phút
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Hàm dọn dẹp (Cleanup) khi Component bị hủy, tránh rò rỉ bộ nhớ (Memory Leak)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return (
    // Thêm h-screen để bám sát chiều cao màn hình và đính kèm flex-col để chia không gian menu
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-10 shadow-sm h-screen sticky top-0">
      
      {/* Brand Logo */}
      <div className="h-16 flex items-center justify-center border-b border-slate-100 flex-shrink-0">
        <h2 className="font-extrabold text-2xl tracking-wide text-blue-600">
          JobPortal<span className="text-slate-800">Admin</span>
        </h2>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
        
        {/* Dashboard */}
        <Link 
          to="/admin/dashboard" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            isActive('/admin') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
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

        {/* Quản lý danh mục */}
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

      {/* ================= NÚT ĐĂNG XUẤT CỐ ĐỊNH Ở ĐÁY SIDEBAR ================= */}
      <div className="p-4 border-t border-slate-100 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors duration-200 group"
        >
          {/* Thêm hiệu ứng dịch chuyển nhẹ sang phải khi di chuột vào nút logout */}
          <LogOut className="w-5 h-5 text-red-500 group-hover:translate-x-0.5 transition-transform" />
          <span>Đăng xuất</span>
        </button>
      </div>

    </aside>
  );
}