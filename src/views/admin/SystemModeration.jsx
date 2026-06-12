import React, { useState } from 'react';
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
  DollarSign
} from 'lucide-react';

export default function SystemModeration() {
  // Quản lý Tab hiện tại: 'jobs' (Kiểm duyệt tin) hoặc 'companies' (Kiểm duyệt công ty)

// ... bên trong component SystemModeration ...
const [searchParams, setSearchParams] = useSearchParams();
// Lấy tab từ URL (ví dụ: ?tab=companies), nếu không có mặc định là 'jobs'
const activeTab = searchParams.get('tab') || 'jobs'; 

const setActiveTab = (tabName) => {
  setSearchParams({ tab: tabName });
};
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Dữ liệu giả lập Tin tuyển dụng chờ duyệt
  const [pendingJobs, setPendingJobs] = useState([
    { id: 'JOB001', title: 'Senior Frontend Developer (ReactJS)', company: 'Công ty TNHH TechNova', date: '06/06/2026', salary: '25 - 35 triệu', location: 'TP. Hồ Chí Minh' },
    { id: 'JOB002', title: 'Chuyên viên Marketing Digital', company: 'Global Solutions Corp', date: '05/06/2026', salary: '15 - 20 triệu', location: 'Hà Nội' },
    { id: 'JOB003', title: 'NodeJS Backend Engineer', company: 'Nippon Tech Việt Nam', date: '04/06/2026', salary: 'Thỏa thuận', location: 'Đà Nẵng' },
  ]);

  // 2. Dữ liệu giả lập Công ty/Doanh nghiệp mới đăng ký chờ xác minh
  const [pendingCompanies, setPendingCompanies] = useState([
    { id: 'COM001', name: 'Tập đoàn Công nghệ VinAI', taxCode: '0102345678', scale: '100-500 nhân sự', date: '06/06/2026', website: 'https://vinai.io' },
    { id: 'COM002', name: 'Công ty Cổ phần Giáo dục EdTech', taxCode: '0314987654', scale: '20-50 nhân sự', date: '05/06/2026', website: 'https://edtech.edu.vn' },
  ]);

  // Hàm xử lý Duyệt tin / Duyệt công ty
  const handleApprove = (id, name, type) => {
    alert(`Đã PHÊ DUYỆT ${type === 'job' ? 'tin tuyển dụng' : 'doanh nghiệp'}: ${name}`);
    if (type === 'job') {
      setPendingJobs(pendingJobs.filter(job => job.id !== id));
    } else {
      setPendingCompanies(pendingCompanies.filter(com => com.id !== id));
    }
  };

  // Hàm xử lý Từ chối / Hạ tin
  const handleReject = (id, name, type) => {
    const reason = prompt(`Nhập lý do TỪ CHỐI ${type === 'job' ? 'tin' : 'doanh nghiệp'} này:`);
    if (reason !== null) {
      alert(`Đã TỪ CHỐI với lý do: ${reason || 'Không có lý do cụ thể'}`);
      if (type === 'job') {
        setPendingJobs(pendingJobs.filter(job => job.id !== id));
      } else {
        setPendingCompanies(pendingCompanies.filter(com => com.id !== id));
      }
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

      {/* THANH ĐIỀU HƯỚNG TAB CHỨC NĂNG */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-xl shadow-sm gap-2">
        <button
          onClick={() => { setActiveTab('jobs'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'jobs'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Kiểm duyệt tin đăng ({pendingJobs.length})
        </button>
        <button
          onClick={() => { setActiveTab('companies'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'companies'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
      </div>

      {/* KHỐI NỘI DUNG CHÍNH (TABLES) */}
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
                {pendingJobs
                  .filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{job.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">ID: {job.id}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{job.company}</td>
                      <td className="px-6 py-4">
                        <div className="text-slate-700 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-slate-400" />{job.salary}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{job.location}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 flex items-center gap-1.5 pt-6">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {job.date}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết nội dung tin">
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
                {pendingJobs.length === 0 && (
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
                {pendingCompanies
                  .filter(com => com.name.toLowerCase().includes(searchTerm.toLowerCase()) || com.taxCode.includes(searchTerm))
                  .map((com) => (
                    <tr key={com.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{com.name}</div>
                        <a href={com.website} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-0.5 block">{com.website}</a>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 font-medium">{com.taxCode}</td>
                      <td className="px-6 py-4 text-slate-600">{com.scale}</td>
                      <td className="px-6 py-4 text-slate-500 flex items-center gap-1.5 pt-6">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {com.date}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem giấy phép KD & Thông tin">
                          <Eye className="w-4 h-4 inline" />
                        </button>
                        <button 
                          onClick={() => handleApprove(com.id, com.name, 'company')}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg font-semibold text-xs inline-flex items-center gap-1 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" /> Xác minh
                        </button>
                        <button 
                          onClick={() => handleReject(com.id, com.name, 'company')}
                          className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-semibold text-xs inline-flex items-center gap-1 transition-all"
                        >
                          <X className="w-3.5 h-3.5" /> Từ chối
                        </button>
                      </td>
                    </tr>
                ))}
                {pendingCompanies.length === 0 && (
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