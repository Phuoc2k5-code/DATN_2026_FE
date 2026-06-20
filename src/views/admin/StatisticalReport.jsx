import React, { useState, useEffect } from 'react';
import { Download, Users, Briefcase, BarChart2, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import html2pdf from 'html2pdf.js';

const API_BASE_URL = 'http://localhost:8000/api/admin';

// Bộ màu sắc Pastel nhẹ nhàng, hiện đại
const COLORS_PASTEL = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

export default function StatisticalReport() {
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  // Lấy token xác thực cấu hình Axios
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
  };

  // Hàm gọi API lấy dữ liệu thống kê dựa trên bộ lọc thời gian
  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/statistics?range=${dateRange}`, getAuthConfig());
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu thống kê:', error);
      alert(error.response?.data?.message || 'Không thể lấy dữ liệu thống kê từ máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại API ngay khi người dùng thay đổi bộ lọc Select Option
  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  // Hàm xử lý xuất file báo cáo PDF
  const handleExportPDF = () => {
    const element = document.getElementById('report-content');
    if (!element) {
      alert('Không tìm thấy nội dung báo cáo để xuất!');
      return;
    }

    const options = {
      margin:       [10, 10, 10, 10], 
      filename:     `Bao-cao-thong-ke-${dateRange}-${new Date().toISOString().slice(0,10)}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' } // Khổ A4 nằm ngang để vừa khít 2 biểu đồ
    };

    html2pdf().set(options).from(element).save();
  };

  // Component hiển thị phần trăm tăng trưởng (%) kèm màu sắc tín hiệu
  const GrowthIndicator = ({ val }) => {
    if (val === 0) return <span className="text-sm font-semibold text-slate-400">0%</span>;
    const isPositive = val > 0;
    return (
      <span className={`text-sm font-semibold flex items-center ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {isPositive ? `+${val}` : val}%
      </span>
    );
  };

  // Hàm custom hiển thị chữ trong Legend kèm số lượng
  const renderCustomLegend = (value, entry) => {
    const amount = entry.payload?.total || entry.payload?.value || 0;
    const unit = entry.payload?.total !== undefined ? 'người' : 'tin';
    return <span className="text-xs text-slate-600 font-medium ml-1">{value} ({amount} {unit})</span>;
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* HEADER CONTROL AREA */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Báo cáo & Thống kê</h1>
          <p className="text-sm text-slate-500 mt-1">Phân tích chuyên sâu về hiệu suất nền tảng và xu hướng tuyển dụng.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            disabled={loading}
            className="text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-600 font-medium shadow-sm"
          >
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="year">Năm nay</option>
          </select>
          <button 
            onClick={handleExportPDF}
            disabled={loading || !stats}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo (PDF)</span>
          </button>
        </div>
      </div>

      {loading && !stats ? (
        <div className="text-center py-20 text-slate-500 font-medium">
          Đang tính toán và thu thập dữ liệu phân tích hệ thống...
        </div>
      ) : (
        /* VÙNG CHỤP XUẤT FILE BÁO CÁO (ID: report-content) */
        <div id="report-content" className="bg-slate-50 rounded-2xl space-y-8">
          
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Thẻ 1: Lượt đăng ký mới */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
                <h3 className="text-sm font-semibold text-slate-600">Lượt đăng ký mới</h3>
              </div>
              <div className="flex items-end justify-between">
                <h2 className="text-3xl font-bold text-slate-800">
                  {(stats?.cards?.users?.current || 0).toLocaleString()}
                </h2>
                <GrowthIndicator val={stats?.cards?.users?.growth || 0} />
              </div>
            </div>

            {/* Thẻ 2: Tin tuyển dụng tạo mới */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Briefcase className="w-5 h-5" /></div>
                <h3 className="text-sm font-semibold text-slate-600">Tin tuyển dụng tạo mới</h3>
              </div>
              <div className="flex items-end justify-between">
                <h2 className="text-3xl font-bold text-slate-800">
                  {(stats?.cards?.jobs?.current || 0).toLocaleString()}
                </h2>
                <GrowthIndicator val={stats?.cards?.jobs?.growth || 0} />
              </div>
            </div>

            {/* Thẻ 3: Lượt nộp CV */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><BarChart2 className="w-5 h-5" /></div>
                <h3 className="text-sm font-semibold text-slate-600">Lượt nộp CV thành công</h3>
              </div>
              <div className="flex items-end justify-between">
                <h2 className="text-3xl font-bold text-slate-800">
                  {(stats?.cards?.applications?.current || 0).toLocaleString()}
                </h2>
                <GrowthIndicator val={stats?.cards?.applications?.growth || 0} />
              </div>
            </div>
          </div>

          {/* CHARTS AREA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BIỂU ĐỒ TRÒN 1: TĂNG TRƯỞNG NGƯỜI DÙNG */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-slate-800 mb-4">Tăng trưởng người dùng</h3>
              <div className="h-72 w-full flex items-center justify-center">
                {stats?.charts?.user_growth && stats.charts.user_growth.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.charts.user_growth}
                        dataKey="total"
                        nameKey="label"
                        cx="50%"
                        cy="45%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={3}
                        label={false}
                      >
                        {stats.charts.user_growth.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_PASTEL[index % COLORS_PASTEL.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => [`${value} thành viên`, 'Đăng ký']} 
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        layout="horizontal"
                        align="center"
                        iconType="circle" 
                        iconSize={8}
                        formatter={renderCustomLegend}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-sm text-slate-400">Không có dữ liệu</span>
                )}
              </div>
            </div>

            {/* BIỂU ĐỒ TRÒN 2: TỶ LỆ NGÀNH NGHỀ TUYỂN DỤNG */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-slate-800 mb-4">Tỷ lệ ngành nghề tuyển dụng</h3>
              <div className="h-72 w-full flex items-center justify-center">
                {stats?.charts?.category_distribution && stats.charts.category_distribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.charts.category_distribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={3}
                        label={false}
                      >
                        {stats.charts.category_distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_PASTEL[index % COLORS_PASTEL.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => [`${value} bài đăng`, 'Ngành nghề']} 
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        layout="horizontal"
                        align="center"
                        iconType="circle" 
                        iconSize={8}
                        formatter={renderCustomLegend}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-sm text-slate-400">Không có dữ liệu</span>
                )}
              </div>
            </div>
          </div>

          {/* TOP DOANH NGHIỆP TABLE */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Top Doanh nghiệp tuyển dụng nhiều nhất</h3>
            </div>
            <div className="overflow-x-auto">
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
                  {stats?.top_companies && stats.top_companies.length > 0 ? (
                    stats.top_companies.map((company) => (
                      <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{company.company_name}</td>
                        <td className="px-6 py-4 text-slate-600">{company.industry || 'Chưa cập nhật'}</td>
                        <td className="px-6 py-4 text-center font-medium">{company.jobs_count || 0}</td>
                        <td className="px-6 py-4 text-center text-blue-600 font-semibold">
                          {(company.applications_count || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                        Không có dữ liệu doanh nghiệp trong khoảng thời gian này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}