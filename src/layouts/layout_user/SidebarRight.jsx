import { Bell, Bookmark, Calendar, MessageSquare, Settings, User } from "lucide-react";
import { Link } from 'react-router-dom';
export default function SidebarRight() {
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
        <div className="p-1 rounded-lg text-slate-400 transition-all group-hover:bg-amber-50 group-hover:text-amber-500 relative">
          <Bell size={12} />
          <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-red-500 rounded-full"></span>
        </div>
        <span className="text-[8px] font-bold text-slate-400 mt-0.5 transition-colors group-hover:text-amber-600">Thông báo</span>
      </div>

      <div className="flex flex-col items-center group cursor-pointer w-full text-center px-1">
        <div className="p-1 rounded-lg text-slate-400 transition-all group-hover:bg-slate-100 group-hover:text-slate-700">
          <Link to="/profile">
            <Settings size={12} />
          </Link>
        </div>
        <span className="text-[8px] font-bold text-slate-400 mt-0.5 transition-colors group-hover:text-slate-700">Cài đặt</span>
      </div>
    </div>
  )
}