import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouteLink} from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  FileCheck, 
  AlertTriangle, 
  Loader2,
  TrendingUp,
  Link
} from 'lucide-react';
// Import các component biểu đồ chuyên nghiệp từ Recharts
import { 
  BarChart, Bar, 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Tạo một instance axios riêng cho Admin để tái sử dụng header token
    const adminApi = axios.create({
      baseURL: 'http://127.0.0.1:8000/api/admin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    setLoading(true);
    // Thực hiện GET request thông qua Axios instance
    adminApi.get('/dashboard-stats')
      .then(response => {
        // Axios tự động parse JSON dữ liệu nằm trong biến `.data`
        if (response.data.success) {
          setData(response.data);
        }
      })
      .catch(err => {
        console.error("Lỗi API Dashboard:", err);
        // Axios gom hết lỗi (mạng, 4xx, 5xx) vào khối catch này
        setError(err.response?.data?.message || 'Không thể kết nối đến máy chủ để tải dữ liệu.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-3" />
        <p className="font-medium">Đang tổng hợp dữ liệu toàn hệ thống...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 m-6">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 p-6">
      
      {/* TOP CARDS: Phản ánh số liệu từ API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-4">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Tổng người dùng</p>
          <h3 className="text-3xl font-bold text-slate-800">
            {data?.cards?.total_users?.toLocaleString('vi-VN')}
          </h3>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Tin tuyển dụng mới (Tháng)</p>
          <h3 className="text-3xl font-bold text-slate-800">
            {data?.cards?.new_jobs_month?.toLocaleString('vi-VN')}
          </h3>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl mb-4">
            <FileCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Cần kiểm duyệt</p>
          <h3 className="text-3xl font-bold text-slate-800">
            {data?.cards?.pending_jobs?.toLocaleString('vi-VN')}
          </h3>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Báo cáo vi phạm (Pending)</p>
          <h3 className="text-3xl font-bold text-slate-800">
            {data?.cards?.pending_reports?.toLocaleString('vi-VN')}
          </h3>
        </div>

      </div>

      {/* CHARTS ROW: Đổ dữ liệu vào Recharts sạch sẽ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* 1. BIỂU ĐỒ CHÍNH: AREA MIỀN LỒNG NHAU */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Lưu lượng tương tác</h3>
              <p className="text-xs text-slate-400 mt-0.5">Thống kê chi tiết số lượt ứng tuyển và truy cập hệ thống 7 ngày qua</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
              <TrendingUp className="h-3 w-3" /> Realtime
            </span>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts?.line_bar} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApplies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} stroke="#cbd5e1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Lượt truy cập" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="Lượt ứng tuyển" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApplies)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. BIỂU ĐỒ TRÒN: DOUGHNUT CHART VÀ CHÚ THÍCH */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Tỷ lệ trạng thái tin đăng</h3>
            <p className="text-xs text-slate-400 mt-0.5">Cơ cấu trạng thái bài đăng tuyển dụng trên hệ thống</p>
          </div>
          
          <div className="h-52 w-full flex-1 relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.charts?.doughnut}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data?.charts?.doughnut?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tin`, 'Số lượng']} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Tạo tâm rỗng hiển thị tổng số tin của vòng tròn */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '-10px' }}>
              <span className="text-2xl font-black text-slate-700">
                {data?.charts?.doughnut?.reduce((sum, item) => sum + item.value, 0)}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tổng tin</span>
            </div>
          </div>

          {/* Render danh sách nhãn màu động từ backend trả về */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-slate-100">
            {data?.charts?.doughnut?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-xs text-slate-600 font-medium truncate">{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DATA TABLE: Danh sách 7 tin chờ duyệt mới nhất */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Tin tuyển dụng chờ duyệt mới nhất</h3>
            <p className="text-xs text-slate-400 mt-0.5">Danh sách các tin đăng doanh nghiệp gửi lên cần duyệt thẩm định nhanh</p>
          </div>
          <a href="/admin/moderation" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Xem tất cả &rarr;</a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 font-semibold">Doanh nghiệp</th>
                <th className="px-6 py-4 font-semibold">Tiêu đề công việc</th>
                <th className="px-6 py-4 font-semibold">Ngày tạo</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data?.latest_pending_jobs?.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{job.company_name}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{job.title}</td>
                  <td className="px-6 py-4 text-slate-500">{job.created_at}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
                      Chờ duyệt
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <RouteLink 
    to={`/jobs/${job?.id}`} 
    className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-2 py-1 rounded inline-block"
  >
    Xem chi tiết
  </RouteLink>
                  </td>
                </tr>
              ))}

              {data?.latest_pending_jobs?.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                    🎉 Tuyệt vời! Không còn tin tuyển dụng nào đang chờ phê duyệt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}