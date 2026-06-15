import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, Briefcase, Building2, Layers, X, Calendar, User, FileText, CheckCircle } from 'lucide-react';

export default function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Quản lý 2 bộ lọc trạng thái và loại đối tượng
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // STATE QUẢN LÝ MODAL CHI TIẾT
  const [selectedReport, setSelectedReport] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:8000/api/admin';
  const token = localStorage.getItem('token');

  // ================= 1. HÀM FETCH DANH SÁCH BÁO CÁO =================
  const fetchReports = () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (statusFilter !== 'all') queryParams.append('status', statusFilter);
    if (typeFilter !== 'all') queryParams.append('type', typeFilter);

    fetch(`${API_BASE_URL}/violation-reports?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Không thể tải danh sách báo cáo.');
      return response.json();
    })
    .then(res => {
      if (res.success) {
        setReports(res.data);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError('Có lỗi xảy ra khi kết nối đến máy chủ.');
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, typeFilter]);

  // ================= 2. HÀM FETCH CHI TIẾT ĐỂ MỞ MODAL =================
  const handleShowDetail = (id) => {
    setLoadingDetail(true);
    setIsModalOpen(true);
    
    fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Không thể tải chi tiết báo cáo.');
      return response.json();
    })
    .then(res => {
      if (res.success) {
        setSelectedReport(res.data);
      }
      setLoadingDetail(false);
    })
    .catch(err => {
      console.error(err);
      alert('Không thể lấy thông tin chi tiết.');
      setIsModalOpen(false);
      setLoadingDetail(false);
    });
  };

  // ================= 3. HÀM XỬ LÝ BÁC BỎ BÁO CÁO =================
  const handleReject = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn bác bỏ báo cáo này?')) {
      fetch(`${API_BASE_URL}/reports/${id}/dismiss`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ admin_note: 'Báo cáo bị bác bỏ bởi Admin do thiếu căn cứ.' })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReports(reports.map(r => r.id === id ? { ...r, status: 'dismissed' } : r));
        }
      });
    }
  };

  // ================= 4. HÀM XỬ LÝ KỶ LUẬT =================
  const handleDiscipline = (id) => {
    const note = window.prompt('Nhập lý do / ghi chú kỷ luật:', 'Vi phạm tiêu chuẩn đăng tin tuyển dụng.');
    if (note !== null) {
      fetch(`${API_BASE_URL}/reports/${id}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ admin_note: note })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          setReports(reports.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
        }
      });
    }
  };

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Chờ xử lý</span>;
      case 'resolved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Đã xử lý</span>;
      case 'dismissed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Đã bác bỏ</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 p-6 relative">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Báo cáo vi phạm</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý, theo dõi số lượt và kiểm duyệt phản ánh cộng đồng.</p>
        </div>
        
        {/* Bộ lọc Pills */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex bg-slate-200/60 p-1 rounded-lg">
            <button onClick={() => setTypeFilter('all')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${typeFilter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Layers className="h-3.5 w-3.5" /> Tất cả đối tượng</button>
            <button onClick={() => setTypeFilter('job')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${typeFilter === 'job' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Briefcase className="h-3.5 w-3.5" /> Tin tuyển dụng</button>
            <button onClick={() => setTypeFilter('company')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${typeFilter === 'company' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Building2 className="h-3.5 w-3.5" /> Doanh nghiệp</button>
          </div>

          <div className="inline-flex bg-slate-200/60 p-1 rounded-lg">
            <button onClick={() => setStatusFilter('all')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${statusFilter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Tất cả trạng thái</button>
            <button onClick={() => setStatusFilter('pending')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${statusFilter === 'pending' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Cần xử lý</button>
          </div>
        </div>
      </div>

      {error && <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">{error}</div>}

      {/* Table Container */}
      <div className="bg-white ring-1 ring-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-semibold">Người báo cáo</th>
                <th className="px-6 py-4 font-semibold">Đối tượng vi phạm</th>
                <th className="px-6 py-4 font-semibold">Tần suất vi phạm</th>
                <th className="px-6 py-4 font-semibold">Lý do & Nội dung</th>
                <th className="px-6 py-4 font-semibold">Ngày báo cáo</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500 mb-2" /> Đang tải dữ liệu...
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  const reportsCount = report.job_id ? (report.job?.reports_count || 0) : (report.company?.reports_count || 0);
                  return (
                    <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {report.user?.username || report.user?.name || 'Ẩn danh'}
                        <div className="text-xs text-slate-400 font-normal mt-0.5">{report.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {report.job_id ? (
                          <>
                            <div className="font-semibold text-slate-800 truncate max-w-[180px]">{report.job?.title}</div>
                            <div className="text-xs text-blue-600 bg-blue-50 border border-blue-100 inline-block px-1.5 py-0.5 rounded mt-1 font-medium">Tin tuyển dụng</div>
                          </>
                        ) : (
                          <>
                            <div className="font-semibold text-slate-800 truncate max-w-[180px]">{report.company?.company_name}</div>
                            <div className="text-xs text-purple-600 bg-purple-50 border border-purple-100 inline-block px-1.5 py-0.5 rounded mt-1 font-medium">Doanh nghiệp</div>
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {reportsCount >= 10 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200 animate-pulse">
                            <AlertTriangle className="h-3.5 w-3.5" /> {reportsCount} lượt
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            {reportsCount} lượt
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-red-600/80 font-semibold">{report.reason_type}</div>
                        <div className="text-xs text-slate-500 max-w-[200px] truncate mt-0.5">{report.description || 'Không có mô tả chi tiết'}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{new Date(report.created_at).toLocaleDateString('vi-VN')}</td>
                      <td className="px-6 py-4">{renderStatusBadge(report.status)}</td>
                      <td className="px-6 py-4 text-right">
                        {report.status === 'pending' ? (
                          <div className="flex justify-end items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleReject(report.id)} className="text-slate-400 hover:text-slate-700 font-medium transition-colors">Bỏ qua</button>
                            <button onClick={() => handleDiscipline(report.id)} className="text-red-600 hover:text-red-800 font-semibold transition-colors">Kỷ luật</button>
                          </div>
                        ) : (
                          // BẤM VÀO ĐÂY ĐỂ MỞ MODAL XEM CHI TIẾT
                          <button onClick={() => handleShowDetail(report.id)} className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                            Chi tiết
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================= COMPONENT MODAL CHI TIẾT (YÊU CẦU MỚI) ======================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Hồ Sơ Chi Tiết Báo Cáo Vi Phạm</h3>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); setSelectedReport(null); }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {loadingDetail ? (
                <div className="py-12 text-center text-slate-400">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500 mb-2" />
                  Đang tải hồ sơ từ máy chủ...
                </div>
              ) : selectedReport && (
                <>
                  {/* Thông tin đối tượng bị tố cáo */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Đối tượng bị phản ánh</span>
                    <div className="font-bold text-slate-800 text-base">
                      {selectedReport.job_id ? selectedReport.job?.title : selectedReport.company?.company_name}
                    </div>
                    <div className="mt-1">
                      {selectedReport.job_id ? (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 font-semibold rounded">Mục: Tin tuyển dụng</span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 font-semibold rounded">Mục: Doanh nghiệp</span>
                      )}
                      <span className="ml-2 text-xs text-slate-500">Trạng thái hiện tại: <strong className="text-slate-700">{selectedReport.job_id ? selectedReport.job?.status : selectedReport.company?.status}</strong></span>
                    </div>
                  </div>

                  {/* Chi tiết người gửi và lý do */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-slate-400 flex items-center gap-1"><User className="h-4 w-4" /> Người gửi báo cáo:</div>
                      <div className="font-semibold text-slate-800">{selectedReport.user?.username || selectedReport.user?.name || 'Ẩn danh'}</div>
                      <div className="text-xs text-slate-500">{selectedReport.user?.email}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-400 flex items-center gap-1"><Calendar className="h-4 w-4" /> Thời gian gửi:</div>
                      <div className="font-semibold text-slate-800">{new Date(selectedReport.created_at).toLocaleString('vi-VN')}</div>
                    </div>
                  </div>

                  {/* Nội dung tố cáo từ Ứng viên */}
                  <div className="space-y-1.5">
                    <div className="text-sm text-slate-400 font-medium">Lý do phân loại: <span className="text-red-600 font-bold">{selectedReport.reason_type}</span></div>
                    <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-xl text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {selectedReport.description || 'Người dùng không nhập mô tả chi tiết.'}
                    </div>
                  </div>

                  {/* NHẬT KÝ PHÂN XỬ CỦA ADMIN */}
                  <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-sm text-emerald-800 font-bold">
                      <CheckCircle className="h-4 w-4 text-emerald-600" /> Nhật ký phân xử của Admin
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5 pl-1">
                      <li>• <strong>Trạng thái quyết định:</strong> {renderStatusBadge(selectedReport.status)}</li>
                      <li>• <strong>Thời gian xử lý:</strong> {selectedReport.resolved_at ? new Date(selectedReport.resolved_at).toLocaleString('vi-VN') : 'Không có dữ liệu'}</li>
                      <li className="mt-2 pt-2 border-t border-emerald-100 text-sm text-slate-700 leading-relaxed">
                        <strong>Ghi chú / Lý do kỷ luật kỹ thuật:</strong>
                        <p className="mt-1 text-slate-600 italic font-medium">"{selectedReport.admin_note || 'Không có ghi chú lưu trữ.'}"</p>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => { setIsModalOpen(false); setSelectedReport(null); }}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-300 transition-colors"
              >
                Đóng hồ sơ
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}