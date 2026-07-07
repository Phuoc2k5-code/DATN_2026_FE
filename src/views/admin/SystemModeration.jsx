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
  Loader2,
  Globe,
  MapPin,
  FileText,
  Award,
  Gift,
  FileSpreadsheet,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = 'http://127.0.0.1:8000';
const API_BASE_URL = `${BACKEND_URL}/api`;
const token = localStorage.getItem('token'); 

export default function SystemModeration() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'jobs'; 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('job'); 
  const [detailData, setDetailData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const setActiveTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const apiHeaders = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  };

  const fetchModerationData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'jobs') {
        const res = await axios.get(`${API_BASE_URL}/admin/moderation/jobs?search=${searchTerm}`, apiHeaders);
        if (res.data.success) setPendingJobs(res.data.data);
      } else {
        const res = await axios.get(`${API_BASE_URL}/admin/moderation/companies?search=${searchTerm}`, apiHeaders);
        if (res.data.success) setPendingCompanies(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu kiểm duyệt:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationData();
  }, [activeTab, searchTerm]);

  const handleOpenDetail = async (id, type) => {
    setModalType(type);
    setIsModalOpen(true);
    setModalLoading(true);
    setDetailData(null);

    try {
      const url = type === 'job' ? `${API_BASE_URL}/job-detail/${id}` : `${API_BASE_URL}/companies/${id}`;
      const res = await axios.get(url, apiHeaders);
      if (res.data) {
        setDetailData(res.data.data || res.data);
      }
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
      alert("Không thể tải thông tin chi tiết!");
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleApprove = async (id, name, type) => {
    if (!window.confirm(`Xác nhận PHÊ DUYỆT ${type === 'job' ? 'tin đăng' : 'doanh nghiệp'}: ${name}?`)) return;
    
    try {
      const endpoint = type === 'job' ? `/admin/moderation/jobs/${id}/approve` : `/admin/moderation/companies/${id}/approve`;
      const res = await axios.put(`${API_BASE_URL}${endpoint}`, {}, apiHeaders);
      
      if (res.data.success) {
        alert(res.data.message);
        setIsModalOpen(false);
        fetchModerationData();
      }
    } catch (error) {
      alert("Thao tác thất bại!");
    }
  };

  const handleReject = async (id, name, type) => {
    const reason = prompt(`Nhập lý do TỪ CHỐI ${type === 'job' ? 'tin' : 'doanh nghiệp'} này:`);
    if (reason === null) return; 
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do cụ thể!");
      return;
    }

    try {
      const endpoint = type === 'job' ? `/admin/moderation/jobs/${id}/reject` : `/admin/moderation/companies/${id}/reject`;
      const res = await axios.put(`${API_BASE_URL}${endpoint}`, { reject_reason: reason }, apiHeaders);
      
      if (res.data.success) {
        alert(res.data.message);
        setIsModalOpen(false);
        fetchModerationData();
      }
    } catch (error) {
      alert("Thao tác thất bại!");
    }
  };

  const formatSalary = (job) => {
    if (job.is_negotiable) return 'Thỏa thuận';
    if (job.salary_min && job.salary_max) {
      return `${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()} VND`;
    }
    if (job.salary_min) return `Từ ${Number(job.salary_min).toLocaleString()} VND`;
    if (job.salary_max) return `Đến ${Number(job.salary_max).toLocaleString()} VND`;
    return 'Chưa cập nhật';
  };

  const getLicenseUrl = (licensePath) => {
    if (!licensePath) return null;
    if (licensePath.startsWith('http')) return licensePath;
    const path = licensePath.startsWith('/') ? licensePath : `/${licensePath}`;
    return `${BACKEND_URL}${path}`;
  };

  return (
    <div className="space-y-6 p-6">
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
          placeholder={activeTab === 'jobs' ? "Tìm theo tiêu đề..." : "Tìm tên doanh nghiệp, mã số thuế..."}
          className="bg-transparent text-sm text-slate-700 outline-none w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && <Loader2 className="w-4 h-4 text-blue-600 animate-spin ml-2" />}
      </div>

      {/* KHỐI BẢNG NỘI DUNG CHÍNH */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* TAB 1: BẢNG TIN ĐĂNG */}
        {activeTab === 'jobs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">Thông tin công việc</th>
                  <th className="px-6 py-4 font-semibold">Cấp bậc</th>
                  <th className="px-6 py-4 font-semibold">Mức lương / Địa điểm</th>
                  <th className="px-6 py-4 font-semibold">Hạn nộp</th>
                  <th className="px-6 py-4 font-semibold text-center w-28">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {pendingJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{job.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Mã tin: #{job.id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold text-slate-700">{job.level}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-600" />{formatSalary(job)}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {job.expired_at ? new Date(job.expired_at).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleOpenDetail(job.id, 'job')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleApprove(job.id, job.title, 'job')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Phê duyệt">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleReject(job.id, job.title, 'job')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Từ chối">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
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

        {/* TAB 2: BẢNG DOANH NGHIỆP */}
        {activeTab === 'companies' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold w-[25%]">Doanh nghiệp</th>
                  <th className="px-6 py-4 font-semibold w-[15%]">Mã số thuế</th>
                  <th className="px-6 py-4 font-semibold w-[35%]">Ngành nghề / Quy mô</th> 
                  <th className="px-6 py-4 font-semibold w-[13%]">Năm TL</th>
                  <th className="px-4 py-4 font-semibold text-center w-[12%]">Thao tác</th> 
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {pendingCompanies.map((com) => (
                  <tr key={com.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 truncate">
                      <div className="flex items-center gap-3 truncate">
                        {com.logo_url && <img src={com.logo_url} alt="logo" className="w-8 h-8 rounded-full border bg-slate-100 object-cover flex-shrink-0" />}
                        <div className="truncate">
                          <div className="font-semibold text-slate-800 truncate">{com.company_name}</div>
                          {com.website_url && <a href={com.website_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate block">{com.website_url}</a>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600 font-medium whitespace-nowrap">{com.tax_code}</td>
                    <td className="px-6 py-4 text-slate-600 break-words">
                      <div className="font-medium text-slate-800">{com.industry || 'Chưa cập nhật ngành nghề'}</div>
                      <div className="text-xs text-slate-400 mt-0.5 bg-slate-50 border border-slate-200/60 rounded px-1.5 py-0.5 inline-block">Quy mô: {com.size || 'N/A'} nhân sự</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">{com.founded_year || 'N/A'}</td>
                    <td className="px-2 py-4 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        <button onClick={() => handleOpenDetail(com.id, 'company')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem hồ sơ chi tiết">
                          <Eye className="w-4 h-4" />
                        </button>                        
                        <button onClick={() => handleApprove(com.id, com.company_name, 'company')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Xác minh doanh nghiệp">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleReject(com.id, com.company_name, 'company')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Từ chối">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* MODAL CHI TIẾT TỔNG HỢP */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                {modalType === 'job' ? <Briefcase className="w-5 h-5 text-blue-600" /> : <Building2 className="w-5 h-5 text-blue-600" />}
                {modalType === 'job' ? 'Thông tin chi tiết tin tuyển dụng' : 'Hồ sơ xác minh doanh nghiệp'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-sm text-slate-500">Đang đồng bộ dữ liệu từ hệ thống...</p>
                </div>
              ) : detailData ? (
                modalType === 'job' ? (
                  /* CHI TIẾT TIN TUYỂN DỤNG */
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md uppercase">Cấp bậc: {detailData.level || 'Chưa cập nhật'}</span>
                      <h4 className="text-xl font-bold text-slate-800 mt-2.5">{detailData.title}</h4>
                      <p className="text-sm font-semibold text-slate-600 mt-1 flex items-center gap-1">
                        <Building2 className="w-4 h-4 text-slate-400" /> ID doanh nghiệp liên kết: #{detailData.company_id}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                      <div className="flex items-center gap-2 text-slate-700">
                        <DollarSign className="w-4 h-4 text-emerald-600" /> 
                        <div>
                          <p className="text-xs text-slate-400">Mức lương yêu cầu</p>
                          <strong>{formatSalary(detailData)}</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <MapPin className="w-4 h-4 text-red-500" /> 
                        <div>
                          <p className="text-xs text-slate-400">Khu vực làm việc</p>
                          <strong>{detailData.location || 'Chưa cập nhật'}</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 col-span-2 border-t pt-2 mt-1 border-slate-200/60">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-slate-400">Hạn cuối nhận hồ sơ kiểm duyệt</p>
                          <strong className="text-red-600">{detailData.expired_at ? new Date(detailData.expired_at).toLocaleDateString('vi-VN') : 'Vô thời hạn'}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h5 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> Mô tả công việc</h5>
                      <div className="text-sm text-slate-600 bg-white border p-3.5 rounded-xl whitespace-pre-line leading-relaxed max-h-[150px] overflow-y-auto">
                        {detailData.description || 'Không có mô tả.'}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h5 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><Award className="w-4 h-4 text-slate-400" /> Yêu cầu ứng viên</h5>
                      <div className="text-sm text-slate-600 bg-white border p-3.5 rounded-xl whitespace-pre-line leading-relaxed max-h-[150px] overflow-y-auto">
                        {detailData.requirements || 'Không có thông tin yêu cầu.'}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h5 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><Gift className="w-4 h-4 text-slate-400" /> Chế độ đãi ngộ & Quyền lợi</h5>
                      <div className="text-sm text-slate-600 bg-white border p-3.5 rounded-xl whitespace-pre-line leading-relaxed max-h-[150px] overflow-y-auto">
                        {detailData.benefits || 'Không có thông tin quyền lợi.'}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CHI TIẾT DOANH NGHIỆP */
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      {detailData.logo_url && <img src={detailData.logo_url} alt="logo" className="w-16 h-16 rounded-xl border bg-slate-50 object-cover shadow-sm" />}
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-slate-800">{detailData.company_name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">User sở hữu ID: #{detailData.user_id}</p>
                        {detailData.website_url && (
                          <a href={detailData.website_url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1">
                            <Globe className="w-4 h-4" /> {detailData.website_url}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">Mã số thuế (tax_code)</p>
                        <strong className="font-mono text-slate-800">{detailData.tax_code || 'Chưa cung cấp'}</strong>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Lĩnh vực hoạt động (industry)</p>
                        <strong className="text-slate-800">{detailData.industry || 'Chưa cập nhật'}</strong>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Quy mô nhân sự (size)</p>
                        <strong className="text-slate-800">{detailData.size || 'N/A'}</strong>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Năm thành lập (founded_year)</p>
                        <strong className="text-slate-800">{detailData.founded_year || 'N/A'}</strong>
                      </div>
                      <div className="col-span-2 border-t pt-2 border-slate-200/60">
                        <p className="text-xs text-slate-400">Trụ sở doanh nghiệp (address)</p>
                        <strong className="text-slate-800">{detailData.address || 'Chưa cập nhật'}</strong>
                      </div>
                    </div>

                    {/* TÀI LIỆU GIẤY PHÉP KINH DOANH (GPKD) - KHÔNG HIỂN THỊ ẢNH TRỰC TIẾP */}
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><FileSpreadsheet className="w-4 h-4 text-slate-400" /> Giấy phép ĐKKD / Chứng nhận pháp lý</h5>
                      {detailData.business_license ? (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-sm">
                          <span className="text-slate-600 font-medium truncate max-w-[70%] text-xs font-mono">{detailData.business_license}</span>
                          <a href={getLicenseUrl(detailData.business_license)} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1 transition-colors">
                            Mở kiểm tra tệp gốc <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600">
                          Doanh nghiệp chưa tải lên tệp tin giấy phép kinh doanh!
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <h5 className="font-bold text-slate-800 text-sm">Giới thiệu doanh nghiệp</h5>
                      <div className="text-sm text-slate-600 bg-white border p-3.5 rounded-xl whitespace-pre-line max-h-[120px] overflow-y-auto">
                        {detailData.description || 'Không có mô tả.'}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h5 className="font-bold text-slate-800 text-sm">Phúc lợi công ty</h5>
                      <div className="text-sm text-slate-600 bg-white border p-3.5 rounded-xl whitespace-pre-line max-h-[120px] overflow-y-auto">
                        {detailData.benefits || 'Không có thông tin phúc lợi.'}
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <p className="text-center text-sm text-slate-400 py-6">Không tồn tại bản ghi.</p>
              )}
            </div>

            {/* Footer Modal Action */}
            {detailData && !modalLoading && (
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button 
                  onClick={() => handleReject(detailData.id, modalType === 'job' ? detailData.title : detailData.company_name, modalType)}
                  className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all"
                >
                  <X className="w-4 h-4" /> Từ chối đăng tải
                </button>
                <button 
                  onClick={() => handleApprove(detailData.id, modalType === 'job' ? detailData.title : detailData.company_name, modalType)}
                  className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/10 transition-all"
                >
                  <Check className="w-4 h-4" /> {modalType === 'job' ? 'Duyệt tin' : 'Xác minh ngay'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}