import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // 🚀 Bước 1: Portal để giải quyết triệt để lỗi bị Header che
import { ArrowLeft, Clock, CheckCircle2, XCircle, Eye, Search, FileText, Calendar, MapPin, MessageSquare, X, Briefcase, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

export default function AppliedJobs() {
  const [appliedList, setAppliedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApply, setSelectedApply] = useState(null); 

  // 🚀 CALL API LẤY LỊCH SỬ ỨNG TUYỂN THỰC TẾ CỦA USER
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await axios.get('http://127.0.0.1:8000/api/applications-history', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (response.data.success) {
          setAppliedList(response.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi kết nối API lịch sử ứng tuyển:", err);
        setError("Không thể tải lịch sử ứng tuyển, vui lòng kiểm tra lại kết nối mạng hoặc token!");
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchAppliedJobs();
  }, []);

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

  // 🚀 HÀM ĐIỀU HƯỚNG HOẶC MỞ XEM FILE CV KHI NGƯỜI DÙNG BẤM VÀO
  const handleViewCv = (item) => {
    if (item.cv_type === 'online') {
      // Nếu nộp trực tuyến, chuyển hướng sang link CV profile trên hệ thống
      window.open(`/candidate/cv-online-preview`, '_blank');
    } else if (item.cv_type === 'pdf' && item.cv_file?.file_path) {
      // Nếu nộp file cứng PDF, mở đường dẫn lưu trữ file từ Backend
      const storageUrl = item.cv_file.file_path.startsWith('http') 
        ? item.cv_file.file_path 
        : `http://127.0.0.1:8000/storage/${item.cv_file.file_path}`;
      window.open(storageUrl, '_blank');
    } else {
      alert("Không tìm thấy tệp tin hoặc đường dẫn CV hợp lệ!");
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center font-sans px-4">
        <div className="text-center max-w-sm p-6 bg-white border border-rose-100 rounded-2xl shadow-xs">
          <XCircle size={28} className="text-rose-500 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-[10px] bg-slate-800 text-white px-3 py-1.5 rounded-xl font-bold">Tải lại trang</button>
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
                  Theo dõi trạng thái và lịch hẹn phỏng vấn từ nhà tuyển dụng
                </p>
              </div>
            </div>

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
          </div>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU LỊCH SỬ CHÍNH */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredList.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs max-w-xl mx-auto">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-blue-100">
              <FileText size={24} className="text-blue-500" />
            </div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Không tìm thấy dữ liệu</h3>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[720px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 w-[35%]">Vị trí & Công ty</th>
                    <th className="py-3 px-4 w-[15%]">Ngày nộp</th>
                    {/* 🚀 Đã đổi tiêu đề cột */}
                    <th className="py-3 px-4 w-[20%]">Hồ sơ ứng tuyển</th> 
                    <th className="py-3 px-4 w-[15%]">Trạng thái</th>
                    <th className="py-3 px-4 w-[15%] text-center">Chi tiết phía sau</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3.5 px-4">
                        <Link to={`/jobs/${item.job_id}`} className="block group-hover:text-blue-600 transition-colors no-underline">
                          <div className="font-extrabold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{item.job?.title}</div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5 underline decoration-transparent group-hover:decoration-slate-300">{item.job?.company?.name} (Xem tin tuyển dụng ↗)</div>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">{new Date(item.applied_at || item.created_at).toLocaleDateString('vi-VN')}</td>
                      
                      {/* 🚀 CỘT HÌNH THỨC CV ĐÃ ĐƯỢC ĐỔI SANG TÊN FILE + CHỨC NĂNG CLICK CLICK ĐỂ XEM */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <button
                          type="button"
                          onClick={() => handleViewCv(item)}
                          className="flex flex-col items-start gap-1 text-left w-full group/cv bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
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
                                📄 {item.cv_file?.file_name || "Tài liệu đính kèm.pdf"}
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
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-[10.5px] font-bold rounded-xl border shadow-2xs transition-all active:scale-95 ${
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

      {/* SỬ DỤNG CREATEPORTAL ĐỂ ĐẨY MODAL LÊN ĐẦU THẺ BODY (FIX LỖI CỐ ĐỊNH, KHÔNG BỊ CHE) */}
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
                className="p-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Nội dung Modal */}
            <div className="p-5 space-y-4 text-xs font-semibold text-slate-700 leading-relaxed overflow-y-auto flex-1 text-left">
              
              {/* TRƯỜNG HỢP 1: LỊCH HẸN PHỎNG VẤN (status === 'interviewing') */}
              {selectedApply.status === 'interviewing' && (
                <div className="space-y-3.5">
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <Calendar size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Thời gian phỏng vấn</h4>
                      <p className="text-slate-800 font-extrabold mt-0.5 text-xs">
                        {selectedApply.status_details?.interview_time 
                          ? new Date(selectedApply.status_details.interview_time).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })
                          : "14:30 - Thứ Năm, Tuần tới (Bộ phận HR sẽ gọi điện chốt lịch trực tiếp)"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MapPin size={16} className="text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Địa điểm / Hình thức</h4>
                      <p className="text-slate-800 font-bold mt-0.5 text-xs">
                        {selectedApply.status_details?.interview_location || "Văn phòng đại diện của Công ty (Chi tiết gửi kèm qua Email cá nhân)"}
                      </p>
                      <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded mt-1.5">
                        Mời phỏng vấn tuyển dụng
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FFFDF9] border border-amber-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MessageSquare size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Ghi chú và Người liên hệ</h4>
                      <p className="text-slate-600 font-medium mt-1 leading-relaxed text-left whitespace-pre-line">
                        {selectedApply.status_details?.note || "Vui lòng chuẩn bị trang phục lịch sự, mang theo laptop cá nhân (nếu có) và kiểm tra email để nhận bài test sơ loại trước buổi phỏng vấn."}
                      </p>
                      {selectedApply.status_details?.contact_person && (
                        <p className="text-[10px] text-slate-400 font-bold mt-2">Đại diện HR liên hệ: {selectedApply.status_details.contact_person}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TRƯỜNG HỢP 2: LỊCH NHẬN VIỆC / TRÚNG TUYỂN (status === 'accepted') */}
              {selectedApply.status === 'accepted' && (
                <div className="space-y-3.5">
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <Briefcase size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Thời gian nhận việc (Onboarding)</h4>
                      <p className="text-slate-800 font-extrabold mt-0.5 text-xs">
                        {selectedApply.status_details?.onboarding_time 
                          ? new Date(selectedApply.status_details.onboarding_time).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })
                          : "08:30 - Thứ Hai đầu tuần sau"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MapPin size={16} className="text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Địa điểm trình diện</h4>
                      <p className="text-slate-800 font-bold mt-0.5 text-xs">
                        {selectedApply.status_details?.onboarding_location || "Quầy lễ tân tầng G - Trụ sở văn phòng chính của công ty"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FFFDF9] border border-amber-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MessageSquare size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Yêu cầu hồ sơ nhận việc</h4>
                      <p className="text-slate-600 font-medium mt-1 leading-relaxed text-left whitespace-pre-line">
                        {selectedApply.status_details?.note || "Vui lòng mang theo CV bản cứng, CCCD sao y công chứng và các văn bằng liên quan để làm thủ tục ký hợp đồng thử việc."}
                      </p>
                      {selectedApply.status_details?.contact_person && (
                        <p className="text-[10px] text-slate-400 font-bold mt-2">Đại diện quản lý HR: {selectedApply.status_details.contact_person}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TRƯỜNG HỢP 3: LÝ DO TỪ CHỐI HỒ SƠ (status === 'rejected') */}
              {selectedApply.status === 'rejected' && (
                <div className="space-y-3.5 text-left">
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">Lý do từ chối hồ sơ</h4>
                      <p className="text-slate-700 font-medium mt-1 leading-relaxed whitespace-pre-line">
                        {selectedApply.status_details?.reject_reason || "Hồ sơ chưa đạt đủ một số tiêu chí về số năm kinh nghiệm hoặc kỹ năng chuyên môn tương thích với dự án hiện tại của công ty."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MessageSquare size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Thư chia sẻ từ phòng Nhân sự</h4>
                      <p className="text-slate-500 font-medium mt-1 leading-relaxed text-justify whitespace-pre-line">
                        {selectedApply.status_details?.note || "Cảm ơn bạn đã dành thời gian quan tâm đến vị trí tuyển dụng của công ty. Thông tin của bạn đã được lưu trữ trong hệ thống Talent Pool, chúng tôi sẽ chủ động liên hệ lại khi có dự án mới phù hợp hơn."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Nút đóng chân Modal */}
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedApply(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors shadow-sm active:scale-95"
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