import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { ArrowLeft, Clock, CheckCircle2, XCircle, Eye, Search, FileText, Calendar, MapPin, MessageSquare, X, Briefcase, ExternalLink, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

export default function AppliedJobs() {
  const navigate = useNavigate();
  const [appliedList, setAppliedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApply, setSelectedApply] = useState(null); 

  // Kiểm tra trạng thái đăng nhập nhanh để bọc lót UI
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const fetchAppliedJobs = async () => {
    // 💡 TỐI ƯU: Nếu chưa đăng nhập thì không gọi API nhằm tránh quăng lỗi 401 lên console
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://127.0.0.1:8000/api/applications-history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setAppliedList(response.data.data || []);
      } else {
        setError(response.data.message || "Không thể tải lịch sử ứng tuyển.");
      }
    } catch (err) {
      console.error("Lỗi khi kết nối API lịch sử ứng tuyển:", err);
      // Tự động xóa token hỏng nếu backend báo lỗi xác thực 401
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else {
        setError(err.response?.data?.message || "Không thể tải lịch sử ứng tuyển, vui lòng kiểm tra lại kết nối!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAppliedJobs();
  }, [isLoggedIn]);

  const filteredList = appliedList.filter(item => {
    const jobTitle = item.job?.title?.toLowerCase() || "";
    const companyName = item.job?.company?.name?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return jobTitle.includes(search) || companyName.includes(search);
  });

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
      case 'viewed': 
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-2xs">
            <Clock size={11} className="animate-spin [animation-duration:3s]" /> Chờ duyệt
          </span>
        );
      case 'interviewing': 
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-2xs">
            <Calendar size={11} /> Nhận lịch hẹn
          </span>
        );
      case 'accepted': 
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-2xs">
            <CheckCircle2 size={11} /> Trúng tuyển
          </span>
        );
      case 'rejected': 
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-2xs">
            <XCircle size={11} /> Xem phản hồi
          </span>
        );
      default:
        return null;
    }
  };

  const handleViewCv = (item) => {
      if (!item?.cv_file?.file_path) {
    alert("Không tìm thấy đường dẫn file CV!");
    return;
  }

  // 🟢 Thêm dấu "?" sau điều kiện check và dấu ":" trước chuỗi fallback local
  const storageUrl = item.cv_file.file_path.startsWith('http')
    ? item.cv_file.file_path
    : `http://127.0.0.1:8000${item.cv_file.file_path}`;

  window.open(storageUrl, '_blank');
  };

  // Trạng thái Đang tải dữ liệu toàn trang
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center font-sans">
        <div className="text-center">
          <Clock size={28} className="animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Đang tải lịch sử ứng tuyển...</p>
        </div>
      </div>
    );
  }

  // Trạng thái Lỗi API hệ thống
  if (error && isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center font-sans px-4">
        <div className="text-center max-w-sm p-6 bg-white border border-rose-100 rounded-2xl shadow-xs">
          <XCircle size={28} className="text-rose-500 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">{error}</p>
          <button 
            onClick={fetchAppliedJobs} 
            className="mt-3 text-[10px] bg-slate-800 text-white px-4 py-1.5 rounded-xl font-bold transition-all active:scale-95 cursor-pointer"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full relative">
      
      {/* HEADER TRANG */}
      <div className="w-full bg-gradient-to-br from-orange-100/60 via-amber-50/40 to-white text-slate-800 px-4 sm:px-6 lg:px-8 py-10 border-b border-orange-100/70 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors mb-5 group w-fit">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
            Quay lại trang chủ
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100/80 border border-orange-200/50 rounded-2xl shadow-sm backdrop-blur-xs">
                <FileText size={22} className="text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Lịch sử ứng tuyển
                </h1>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {isLoggedIn ? (
                    <>Bạn đã nộp đơn ứng tuyển cho <span className="text-orange-600 font-bold bg-orange-100/60 px-1.5 py-0.5 rounded border border-orange-200/40 mx-0.5">{appliedList.length}</span> vị trí công việc</>
                  ) : (
                    "Vui lòng đăng nhập để kiểm tra tiến trình xét duyệt hồ sơ"
                  )}
                </p>
              </div>
            </div>

            {isLoggedIn && (
              <div className="relative w-full sm:w-64 shrink-0">
                <input
                  type="text"
                  placeholder="Tìm công ty, vị trí..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs font-medium pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all shadow-xs"
                />
                <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU LỊCH SỬ CHÍNH */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* MÀN HÌNH CHƯA ĐĂNG NHẬP (Chặn lỗi khéo léo) */}
        {!isLoggedIn ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs max-w-xl mx-auto p-6">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
              <FileText size={24} className="text-amber-500" />
            </div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Bạn chưa đăng nhập</h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              Hãy đăng nhập tài khoản ứng viên để kiểm tra và quản lý toàn bộ danh sách các công việc đã nộp hồ sơ thành công.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-5 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <LogIn size={13} /> Đăng nhập xem lịch sử
            </button>
          </div>
        ) : filteredList.length === 0 ? (
          /* TRẠNG THÁI MẢNG RỖNG / KHÔNG TÌM THẤY TỪ KHÓA */
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs max-w-xl mx-auto">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-blue-100">
              <FileText size={24} className="text-blue-500" />
            </div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Không tìm thấy dữ liệu ứng tuyển</h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              {searchTerm ? "Không có kết quả nào trùng khớp với từ khóa tìm kiếm." : "Bạn chưa nộp hồ sơ vào bất kỳ công việc nào."}
            </p>
            {!searchTerm && (
              <Link 
                to="/" 
                className="mt-5 inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all"
              >
                <Briefcase size={13} /> Tìm việc làm ngay
              </Link>
            )}
          </div>
        ) : (
          /* DANH SÁCH HIỂN THỊ DẠNG TABLE */
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[720px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 w-[35%]">Vị trí & Công ty</th>
                    <th className="py-3 px-4 w-[15%]">Ngày nộp</th>
                    <th className="py-3 px-4 w-[20%]">Hồ sơ ứng tuyển</th> 
                    <th className="py-3 px-4 w-[15%]">Trạng thái</th>
                    <th className="py-3 px-4 w-[15%] text-center">Chi tiết phản hồi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3.5 px-4">
                        <Link to={`/jobs/${item.job_id}`} className="block group-hover:text-blue-600 transition-colors no-underline">
                          <div className="font-extrabold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{item.job?.title}</div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5 underline decoration-transparent group-hover:decoration-slate-300">
                            {item.job?.company?.name} (Xem tin tuyển dụng ↗)
                          </div>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {new Date(item.applied_at || item.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <button
                          type="button"
                          onClick={() => handleViewCv(item)}
                          className="flex flex-col items-start gap-1 text-left w-full bg-transparent border-0 p-0 cursor-pointer focus:outline-none group/cv"
                          title="Bấm vào để xem nội dung CV đã nộp"
                        >
                          {item.cv_type === 'online' ? (
                            <>
                              <span className="inline-flex items-center gap-1 text-blue-600 uppercase font-black text-[9px] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded shadow-2xs">
                                <FileText size={10} /> CV Trực tuyến
                              </span>
                              <span className="text-[11px] text-slate-600 font-bold mt-1 group-hover/cv:text-blue-600 group-hover/cv:underline inline-flex items-center gap-1">
                                🌐 Xem hồ sơ online <ExternalLink size={10} className="opacity-60" />
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="inline-flex items-center gap-1 text-rose-600 uppercase font-black text-[9px] bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded shadow-2xs">
                                <FileText size={10} /> File đính kèm PDF
                              </span>
                              <span className="text-[11px] text-slate-600 font-bold mt-1 truncate max-w-full block group-hover/cv:text-rose-600 group-hover/cv:underline" title={item.cv_file?.file_name}>
                                {/* Tài liệu đính kèm.pdf */}
                                {item.cv_file?.file_path}
                              </span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4">{renderStatusBadge(item.status)}</td>
                      <td className="py-3.5 px-4 text-center">
                        {['pending', 'viewed'].includes(item.status) ? (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg cursor-default">Chờ phản hồi</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedApply(item)} 
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-[10.5px] font-bold rounded-xl border shadow-2xs transition-all active:scale-95 cursor-pointer ${
                              ['interviewing', 'accepted'].includes(item.status)
                                ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200'
                            }`}
                          >
                            <Eye size={12} />
                            {item.status === 'rejected' ? 'Xem lý do' : 'Xem lịch hẹn'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL POPUP THÔNG TIN CHI TIẾT PHẢN HỒI */}
      {selectedApply && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans text-slate-800 antialiased">
          <div className="fixed inset-0 -z-10" onClick={() => setSelectedApply(null)} />
          
          <div className="bg-white border border-slate-200/80 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className={`p-4 text-white flex items-center justify-between shrink-0 ${
              ['interviewing', 'accepted'].includes(selectedApply.status) ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-slate-800 to-rose-950'
            }`}>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                  Phản hồi từ {selectedApply.job?.company?.name || "Nhà tuyển dụng"}
                </span>
                <h2 className="text-sm font-black mt-1 tracking-tight">{selectedApply.job?.title || "Vị trí ứng tuyển"}</h2>
              </div>
              <button 
                onClick={() => setSelectedApply(null)}
                className="p-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Nội dung phản hồi chi tiết */}
            <div className="p-5 space-y-4 text-xs font-semibold text-slate-700 leading-relaxed overflow-y-auto flex-1 text-left">
              
              {/* CASE 1: LỊCH HẸN PHỎNG VẤN */}
              {selectedApply.status === 'interviewing' && (
                <div className="space-y-3.5">
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <Calendar size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Thời gian phỏng vấn</h4>
                      <p className="text-slate-800 font-extrabold mt-0.5 text-xs">
                        {selectedApply.status_details?.interview_time 
                          ? new Date(selectedApply.status_details.interview_time).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })
                          : "14:30 - Ngày hẹn làm việc cụ thể sẽ được HR thông báo qua cuộc gọi điện thoại."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MapPin size={16} className="text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Địa điểm / Hình thức</h4>
                      <p className="text-slate-800 font-bold mt-0.5 text-xs">
                        {selectedApply.status_details?.interview_location || "Văn phòng chính hoặc Online qua Google Meet (Chi tiết trong email)"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FFFDF9] border border-amber-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MessageSquare size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Ghi chú tuyển dụng</h4>
                      <p className="text-slate-600 font-medium mt-1 leading-relaxed text-left whitespace-pre-line">
                        {selectedApply.status_details?.note || "Vui lòng chuẩn bị trang phục lịch sự và kiểm tra hòm thư cá nhân để làm bài test chuyên môn trước (nếu có)."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE 2: ĐỒNG Ý NHẬN VIỆC */}
              {selectedApply.status === 'accepted' && (
                <div className="space-y-3.5">
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <Briefcase size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Ngày bắt đầu Onboarding</h4>
                      <p className="text-slate-800 font-extrabold mt-0.5 text-xs">
                        {selectedApply.status_details?.onboarding_time 
                          ? new Date(selectedApply.status_details.onboarding_time).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })
                          : "Theo thông tin thư mời nhận việc (Offer Letter)"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MapPin size={16} className="text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Địa điểm trình diện</h4>
                      <p className="text-slate-800 font-bold mt-0.5 text-xs">
                        {selectedApply.status_details?.onboarding_location || "Văn phòng làm việc công ty"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FFFDF9] border border-amber-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MessageSquare size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Lưu ý chuẩn bị hồ sơ</h4>
                      <p className="text-slate-600 font-medium mt-1 leading-relaxed text-left whitespace-pre-line">
                        {selectedApply.status_details?.note || "Vui lòng chuẩn bị đầy đủ các văn bằng bản công chứng và CCCD để hoàn tất thủ tục ký kết hợp đồng lao động."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE 3: TỪ CHỐI HỒ SƠ */}
              {selectedApply.status === 'rejected' && (
                <div className="space-y-3.5 text-left">
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">Lý do từ chối hồ sơ</h4>
                      <p className="text-slate-700 font-medium mt-1 leading-relaxed whitespace-pre-line">
                        {selectedApply.status_details?.reject_reason || "Hồ sơ của bạn rất ấn tượng nhưng một vài tiêu chí công nghệ hiện tại chưa hoàn toàn khớp với định hướng dự án giai đoạn này."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MessageSquare size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Thư chia sẻ</h4>
                      <p className="text-slate-500 font-medium mt-1 leading-relaxed text-justify whitespace-pre-line">
                        {selectedApply.status_details?.note || "Thông tin của bạn đã được chuyển vào kho lưu trữ dữ liệu ứng viên tiềm năng của công ty. Chúng tôi sẽ chủ động liên hệ lại ngay khi có vị trí mới phù hợp hơn xuất hiện."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer nút Đóng */}
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedApply(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors shadow-sm active:scale-95 cursor-pointer"
              >
                Đóng lại
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}