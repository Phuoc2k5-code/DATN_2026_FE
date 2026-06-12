import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, Users, Briefcase, BarChart2 } from 'lucide-react';

export default function StatisticalReport() {
  const [dateRange, setDateRange] = useState('month');

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Báo cáo & Thống kê</h1>
          <p className="text-sm text-slate-500 mt-1">Phân tích chuyên sâu về hiệu suất nền tảng và xu hướng tuyển dụng.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-600 font-medium shadow-sm"
          >
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="year">Năm nay</option>
          </select>
          <button className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl shadow-sm transition-all">
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo (PDF)</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
            <h3 className="text-sm font-semibold text-slate-600">Lượt đăng ký mới</h3>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-slate-800">2,845</h2>
            <span className="text-sm font-semibold text-emerald-500 flex items-center"><TrendingUp className="w-4 h-4 mr-1"/> +12.5%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Briefcase className="w-5 h-5" /></div>
            <h3 className="text-sm font-semibold text-slate-600">Tin tuyển dụng tạo mới</h3>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-slate-800">1,240</h2>
            <span className="text-sm font-semibold text-emerald-500 flex items-center"><TrendingUp className="w-4 h-4 mr-1"/> +5.2%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><BarChart2 className="w-5 h-5" /></div>
            <h3 className="text-sm font-semibold text-slate-600">Lượt nộp CV thành công</h3>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-slate-800">18,520</h2>
            <span className="text-sm font-semibold text-red-500 flex items-center"><TrendingUp className="w-4 h-4 mr-1 rotate-180"/> -2.1%</span>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Tăng trưởng người dùng</h3>
          <div className="h-64 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">
            [Khu vực gắn biểu đồ Bar Chart]
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">Tỷ lệ ngành nghề tuyển dụng</h3>
          <div className="h-64 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">
            [Khu vực gắn biểu đồ Pie/Doughnut Chart]
          </div>
        </div>
      </div>

      {/* Top Table */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-100"><h3 className="font-bold text-slate-800">Top Doanh nghiệp tuyển dụng nhiều nhất</h3></div>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Tên doanh nghiệp</th>
              <th className="px-6 py-3 font-semibold">Lĩnh vực</th>
              <th className="px-6 py-3 font-semibold text-center">Số tin đăng</th>
              <th className="px-6 py-3 font-semibold text-center">Lượt ứng tuyển</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-900">FPT Software</td>
              <td className="px-6 py-4 text-slate-600">Công nghệ thông tin</td>
              <td className="px-6 py-4 text-center font-medium">45</td>
              <td className="px-6 py-4 text-center text-blue-600 font-semibold">1,250</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-900">Shopee Việt Nam</td>
              <td className="px-6 py-4 text-slate-600">Thương mại điện tử</td>
              <td className="px-6 py-4 text-center font-medium">38</td>
              <td className="px-6 py-4 text-center text-blue-600 font-semibold">980</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}