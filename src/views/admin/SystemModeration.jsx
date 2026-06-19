import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Briefcase, 
  Building2, 
  Search, 
  Check, 
  X, 
  Eye, 
  FileCheck, 
  Calendar,
  DollarSign,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/admin/moderation';
const token = localStorage.getItem('token'); // Token quyền Admin

export default function SystemModeration() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'jobs'; 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Lưu trữ dữ liệu thực tế từ API
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);

  // Hàm điều hướng tab
  const setActiveTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // Cấu hình Header gửi kèm Token Admin
  const apiHeaders = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  };

  // Hàm tải dữ liệu tương ứng với Tab hiện tại
  const fetchModerationData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'jobs') {
        const res = await axios.get(`${API_BASE_URL}/jobs?search=${searchTerm}`, apiHeaders);
        if (res.data.success) setPendingJobs(res.data.data);
      } else {
        const res = await axios.get(`${API_BASE_URL}/companies?search=${searchTerm}`, apiHeaders);
        if (res.data.success) setPendingCompanies(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu kiểm duyệt:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tải lại dữ liệu khi đổi Tab hoặc kết thúc gõ tìm kiếm (Debounce nếu cần)
  useEffect(() => {
    fetchModerationData();
  }, [activeTab, searchTerm]);

  // Hàm xử lý Duyệt (Approve) bằng API
  const handleApprove = async (id, name, type) => {
    if (!window.confirm(`Xác nhận PHÊ DUYỆT ${type === 'job' ? 'tin đăng' : 'doanh nghiệp'}: ${name}?`)) return;
    
    try {
      const endpoint = type === 'job' ? `/jobs/${id}/approve` : `/companies/${id}/approve`;
      const res = await axios.put(`${API_BASE_URL}${endpoint}`, {}, apiHeaders);
      
      if (res.data.success) {
        alert(res.data.message);
        // Tải lại danh sách để đồng bộ UI
        fetchModerationData();
      }
    } catch (error) {
      alert("Thao tác thất bại, vui lòng thử lại!");
    }
  };

  // Hàm xử lý Từ chối (Reject) bằng API
  const handleReject = async (id, name, type) => {
    const reason = prompt(`Nhập lý do TỪ CHỐI ${type === 'job' ? 'tin' : 'doanh nghiệp'} này:`);
    if (reason === null) return; // Nhấn Cancel
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do cụ thể!");
      return;
    }

    try {
      const endpoint = type === 'job' ? `/jobs/${id}/reject` : `/companies/${id}/reject`;
      const res = await axios.put(`${API_BASE_URL}${endpoint}`, { reason: reason }, apiHeaders);
      
      if (res.data.success) {
        alert(res.data.message);
        fetchModerationData();
      }
    } catch (error) {
      alert("Thao tác thất bại!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileCheck className="w-7 h-7 text-blue-600" />
            Kiểm duyệt hệ thống
          </h2>
          <p className="text-sm text-slate-500 mt-1">Phê duyệt hoặc từ chối các yêu cầu đăng tải nội dung trên nền tảng.</p>
        </div>
      </div>

      {/* THANH ĐIỀU HƯỚNG TAB */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-xl shadow-sm gap-2">
        <button
          onClick={() => { setActiveTab('jobs'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'jobs' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Kiểm duyệt tin đăng ({pendingJobs.length})
        </button>
        <button
          onClick={() => { setActiveTab('companies'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'companies' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Kiểm duyệt doanh nghiệp ({pendingCompanies.length})
        </button>
      </div>

      {/* THANH TÌM KIẾM */}
      <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm max-w-md">
        <Search className="w-4 h-4 text-slate-400 mr-2.5" />
        <input 
          type="text" 
          placeholder={activeTab === 'jobs' ? "Tìm theo tiêu đề, công ty..." : "Tìm tên doanh nghiệp, mã số thuế..."}
          className="bg-transparent text-sm text-slate-700 outline-none w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && <Loader2 className="w-4 h-4 text-blue-600 animate-spin ml-2" />}
      </div>

      {/* KHỐI NỘI DUNG CHÍNH */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* TAB 1: BẢNG KIỂM DUYỆT TIN ĐĂNG */}
        {activeTab === 'jobs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">Thông tin công việc</th>
                  <th className="px-6 py-4 font-semibold">Doanh nghiệp</th>
                  <th className="px-6 py-4 font-semibold">Mức lương / Địa điểm</th>
                  <th className="px-6 py-4 font-semibold">Ngày gửi</th>
                  <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {pendingJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{job.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">ID: {job.id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{job.company?.company_name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-slate-400" />{job.salary || 'Thỏa thuận'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 flex items-center gap-1.5 pt-6">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {job.created_at ? job.created_at.substring(0, 10) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Xem chi tiết">
                        <Eye className="w-4 h-4 inline" />
                      </button>
                      <button 
                        onClick={() => handleApprove(job.id, job.title, 'job')}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg font-semibold text-xs inline-flex items-center gap-1 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" /> Duyệt
                      </button>
                      <button 
                        onClick={() => handleReject(job.id, job.title, 'job')}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-semibold text-xs inline-flex items-center gap-1 transition-all"
                      >
                        <X className="w-3.5 h-3.5" /> Từ chối
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingJobs.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">Không có tin đăng nào cần kiểm duyệt.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: BẢNG KIỂM DUYỆT DOANH NGHIỆP */}
        {activeTab === 'companies' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">Doanh nghiệp</th>
                  <th className="px-6 py-4 font-semibold">Mã số thuế / GPKD</th>
                  <th className="px-6 py-4 font-semibold">Quy mô</th>
                  <th className="px-6 py-4 font-semibold">Ngày tham gia</th>
                  <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {pendingCompanies.map((com) => (
                  <tr key={com.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{com.company_name}</div>
                      <a href={com.website} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-0.5 block">{com.website}</a>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600 font-medium">{com.tax_code || com.taxCode}</td>
                    <td className="px-6 py-4 text-slate-600">{com.size || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-500 flex items-center gap-1.5 pt-6">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {com.created_at ? com.created_at.substring(0, 10) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Xem giấy phép">
                        <Eye className="w-4 h-4 inline" />
                      </button>
                      <button 
                        onClick={() => handleApprove(com.id, com.company_name, 'company')}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg font-semibold text-xs inline-flex items-center gap-1 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" /> Xác minh
                      </button>
                      <button 
                        onClick={() => handleReject(com.id, com.company_name, 'company')}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-semibold text-xs inline-flex items-center gap-1 transition-all"
                      >
                        <X className="w-3.5 h-3.5" /> Từ chối
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingCompanies.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">Không có doanh nghiệp nào chờ xác minh.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}