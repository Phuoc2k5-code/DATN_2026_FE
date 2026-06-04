import { 
  User, Calendar, Bookmark, Settings, 
  Bot, Sparkles // 💡 Import thêm icon Robot và Lấp lánh từ lucide-react
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
export default function SidebarRight() {
  const navigate = useNavigate();
  const location = useLocation();
  const issue = location.pathname === '/ai-suggestions' ? true : false;
  return (
    <div className="w-14 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col items-center py-3 gap-3 sticky top-24 h-fit shrink-0">
      <div className="flex flex-col items-center group cursor-pointer w-full text-center px-1">
        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:text-white shadow-sm">
            <Link to="/cv-management">
              <User size={11} />
            </Link>
        </div>
        <span className="text-[8px] font-bold text-slate-400 mt-1 transition-colors group-hover:text-blue-600">Hồ sơ</span>
      </div>

      <div className="w-6 h-px bg-slate-100 my-0.5"></div>

      <div className="flex flex-col items-center group cursor-pointer w-full text-center px-1">
        <div className="p-1 rounded-lg text-slate-400 transition-all group-hover:bg-orange-50 group-hover:text-orange-500">
          <Link to="/application-history">
            <Calendar size={12} />
          </Link>
        </div>
        <span className="text-[8px] font-bold text-slate-400 mt-0.5 transition-colors group-hover:text-orange-600">Lịch sử</span>
      </div>

      <div className="flex flex-col items-center group cursor-pointer w-full text-center px-1">
        <div className="p-1 rounded-lg text-slate-400 transition-all group-hover:bg-rose-50 group-hover:text-rose-500">
          <Link to="/saved-jobs">
            <Bookmark size={12} />
          </Link>
        </div>
        <span className="text-[8px] font-bold text-slate-400 mt-0.5 transition-colors group-hover:text-rose-600">Đã lưu</span>
      </div>

      <div className="flex flex-col items-center group cursor-pointer w-full text-center px-1">
        <div className="p-1 rounded-lg text-slate-400 transition-all group-hover:bg-slate-100 group-hover:text-slate-700">
          <Link to="/profile">
            <Settings size={12} />
          </Link>
        </div>
        <span className="text-[8px] font-bold text-slate-400 mt-0.5 transition-colors group-hover:text-slate-700">Cài đặt</span>
      </div>
      <div className="w-full h-px bg-slate-100 my-1"></div>

        {/* 🤖 MỚI: ICON ROBOT AI TỐI ƯU TRẢI NGHIỆM ĐỒ ÁN */}
        <button           
          type="button" 
          onClick={() => navigate('/ai-suggestions')} // Điều hướng đến trang AI Gợi ý
          className="group flex flex-col items-center gap-1 relative animate-pulse-slow"
        >
          {/* Nút bấm chứa hiệu ứng Gradient AI nổi bật */}
          <div className={`p-2.5 rounded-full transition-all text-white shadow-md ${
            issue 
              ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 scale-110 ring-4 ring-purple-100' 
              : 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 hover:shadow-lg'
          }`}>
            <Bot size={19} className="animate-wiggle" />
          </div>
          
          <span className={`text-[9.5px] font-black uppercase tracking-tight transition-colors ${
            issue ? 'text-purple-600' : 'text-slate-400 group-hover:text-purple-500'
          }`}>
            AI Gợi ý
          </span>

          {/* Chấm tròn nhỏ thể hiện có thông báo việc làm mới match với CV */}
          <span className="absolute top-0 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>
    </div>
  )
}