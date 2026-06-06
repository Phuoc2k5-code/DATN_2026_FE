import React, { useState } from 'react';

export default function SideBar() {
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(true);
  
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-10 shadow-sm">
      <div className="h-16 flex items-center justify-center border-b border-slate-100">
        <h2 className="font-extrabold text-2xl tracking-wide text-blue-600">
          JobPortal<span className="text-slate-800">Admin</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
        <a href="#" className="flex items-center space-x-3 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-semibold transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          <span>Dashboard</span>
        </a>

        <div className="pt-5 pb-2">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Vận Hành</p>
        </div>

        <div>
          <button
            onClick={() => setIsSystemMenuOpen(!isSystemMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span>Quản lý hệ thống</span>
            </div>
            <svg className={`w-4 h-4 transition-transform ${isSystemMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          {isSystemMenuOpen && (
            <div className="pl-11 pr-3 py-2 space-y-1.5 border-l-2 border-slate-100 ml-5 mt-1">
              <a href="#" className="block py-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">Duyệt doanh nghiệp</a>
              <a href="#" className="block py-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">Kiểm duyệt tin đăng</a>
            </div>
          )}
        </div>

        <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <span>Quản lý tài khoản</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <span>Quản lý danh mục</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <span>Báo cáo vi phạm</span>
        </a>

        <div className="pt-5 pb-2">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Phân Tích</p>
        </div>
        <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span>Báo cáo thống kê</span>
        </a>
      </nav>
    </aside>
  )
}