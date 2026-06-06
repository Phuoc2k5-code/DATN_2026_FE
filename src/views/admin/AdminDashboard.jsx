import React, { useState } from 'react';

export default function AdminDashboard() {
  return (
    <div>

      {/* TOP CARDS: Tối giản, Icon trên, Số dưới, không có % */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Tổng người dùng</p>
          <h3 className="text-3xl font-bold text-slate-800">12,450</h3>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Tin tuyển dụng mới</p>
          <h3 className="text-3xl font-bold text-slate-800">842</h3>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Cần kiểm duyệt</p>
          <h3 className="text-3xl font-bold text-slate-800">45</h3>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Báo cáo vi phạm</p>
          <h3 className="text-3xl font-bold text-slate-800">8</h3>
        </div>

      </div>

      {/* CHARTS ROW: Chia tỷ lệ 2/3 và 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Lưu lượng truy cập & Ứng tuyển</h3>
            <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
              <option>Năm nay</option>
            </select>
          </div>
          <div className="h-72 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center">
            <p className="text-slate-400 font-medium">Khu vực nhúng biểu đồ Line/Bar Chart (Ví dụ: Chart.js hoặc Recharts)</p>
          </div>
        </div>

        {/* Side Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tỷ lệ trạng thái tin đăng</h3>
          <div className="h-72 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center space-y-4">
            <div className="w-32 h-32 rounded-full border-8 border-blue-500 border-t-emerald-400 border-l-amber-400"></div>
            <p className="text-slate-400 font-medium text-sm">Khu vực nhúng Doughnut Chart</p>
          </div>
        </div>
      </div>

      {/* DATA TABLE: Danh sách công việc chờ duyệt */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Tin tuyển dụng chờ duyệt mới nhất</h3>
          <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Xem tất cả &rarr;</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Doanh nghiệp</th>
                <th className="px-6 py-4 font-semibold">Tiêu đề công việc</th>
                <th className="px-6 py-4 font-semibold">Ngày tạo</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">Công ty TNHH TechNova</td>
                <td className="px-6 py-4 text-slate-600">Senior Frontend Developer (ReactJS)</td>
                <td className="px-6 py-4 text-slate-500">06/06/2026</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Chờ duyệt</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">Xem</button>
                  <button className="text-emerald-600 hover:text-emerald-800 font-medium">Duyệt</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">Global Solutions Corp</td>
                <td className="px-6 py-4 text-slate-600">Chuyên viên Marketing Digital</td>
                <td className="px-6 py-4 text-slate-500">05/06/2026</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Chờ duyệt</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">Xem</button>
                  <button className="text-emerald-600 hover:text-emerald-800 font-medium">Duyệt</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};