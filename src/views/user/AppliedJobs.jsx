import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Eye, Search, FileText, Calendar, MapPin, MessageSquare, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AppliedJobs() {
  // 1. 💡 DỮ LIỆU GIẢ LẬP LỊCH SỬ ỨNG TUYỂN CÓ KÈM CHI TIẾT LỊCH HẸN / LÝ DO TỪ CHỐI
  const [appliedList, setAppliedList] = useState([
    {
      id: "apply-01",
      jobId: "job-01",
      title: "Software Engineer",
      company: "Google",
      appliedDate: "2026-05-28",
      cvName: "CV_NguyenVanPhuc_Backend.pdf",
      status: "pending",
      details: null // Đang chờ duyệt thì chưa có thông tin thêm
    },
    {
      id: "apply-02",
      jobId: "job-02",
      title: "Frontend Developer (ReactJS)",
      company: "FPT Software",
      appliedDate: "2026-05-20",
      cvName: "CV_NguyenVanPhuc_Frontend.pdf",
      status: "approved",
      // Chi tiết lịch hẹn phỏng vấn tuyển dụng
      details: {
        time: "14:30 - Thứ Năm, Ngày 11 Tháng 6 Năm 2026",
        location: "Phòng họp 402, Tòa nhà F-Town 3, Lô T2, Đường D1, Khu Công Nghệ Cao, Quận 9, TP. HCM",
        type: "Trực tiếp (Offline Interview)",
        note: "Bạn vui lòng mang theo laptop cá nhân để làm bài test thực hành Frontend trong vòng 30 phút và trang phục lịch sự nhé."
      }
    },
    {
      id: "apply-03",
      jobId: "job-03",
      title: "UI/UX Designer",
      company: "VNG Corporation",
      location: "Quận 7, TP. HCM",
      appliedDate: "2026-05-15",
      cvName: "CV_NguyenVanPhuc_Design.pdf",
      status: "rejected",
      // Chi tiết lý do từ chối hồ sơ
      details: {
        reason: "Hồ sơ của bạn rất ấn tượng, tuy nhiên số năm kinh nghiệm thực chiến với hệ thống Design System quy mô lớn của bạn chưa đạt mức tối thiểu (2 năm) mà dự án hiện tại của VNG đang yêu cầu gấp.",
        note: "Thông tin của bạn đã được lưu lại trong kho dữ liệu Talent Pool của chúng tôi. Ngay khi có vị trí cấp độ Junior hoặc các dự án phù hợp hơn trong tương lai, bộ phận Tuyển dụng sẽ chủ động liên hệ lại với bạn đầu tiên. Chúc bạn luôn giữ vững đam mê!"
      }
    }
  ]);

  // 2. Các trạng thái phục vụ bộ lọc và hiển thị Modal
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApply, setSelectedApply] = useState(null); // Lưu tin tuyển dụng đang được chọn để mở Modal lên

  // Bộ lọc tìm kiếm nhanh
  const filteredList = appliedList.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm render Badge trạng thái nhanh trên Table
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-2xs">
            <Clock size={11} className="animate-spin [animation-duration:3s]" /> Chờ duyệt
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-2xs">
            <CheckCircle2 size={11} /> Nhận lịch hẹn
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

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full relative">
      
      {/* 🚀 HEADER TRANG (ĐÃ ĐỒNG BỘ 100% VỚI TRANG CHỦ) */}
<div className="w-full bg-gradient-to-br from-orange-100/60 via-amber-50/40 to-white text-slate-800 px-4 sm:px-6 lg:px-8 py-10 border-b border-orange-100/70 shadow-sm">
  <div className="max-w-6xl mx-auto">
    
    {/* Nút quay lại - Đổi hover sang màu cam chủ đạo */}
    <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors mb-5 group w-fit">
      <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
      Quay lại trang chủ
    </Link>
    
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      
      {/* Khối tiêu đề và Icon */}
      <div className="flex items-center gap-4">
        {/* Box chứa Icon đổi sang màu nền cam nhạt và bo góc mềm mại rounded-2xl */}
        <div className="p-3 bg-orange-100/80 border border-orange-200/50 rounded-2xl shadow-sm backdrop-blur-xs">
          <FileText size={22} className="text-orange-600" />
        </div>
        <div>
          {/* Tiêu đề chính dùng font-extrabold và chuyển hẳn sang màu cam/hổ phách công nghệ */}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Lịch sử ứng tuyển
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Theo dõi trạng thái và lịch hẹn phỏng vấn từ nhà tuyển dụng
          </p>
        </div>
      </div>

      {/* Thanh tìm kiếm - Chuyển sang phong cách nền sáng, viền mịn, focus đổi màu cam */}
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

      {/* 📦 BẢNG DỮ LIỆU LỊCH SỬ CHÍNH */}
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
                    {/* 💡 CHIA ĐỘ RỘNG CỘT CÂN ĐỐI */}
                    <th className="py-3 px-4 w-[35%]">Vị trí & Công ty</th>
                    <th className="py-3 px-4 w-[15%]">Ngày nộp</th>
                    <th className="py-3 px-4 w-[20%]">CV đã nộp</th>
                    <th className="py-3 px-4 w-[15%]">Trạng thái</th>
                    <th className="py-3 px-4 w-[15%] text-center">Chi tiết phía sau</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* 💡 YÊU CẦU 1: Bấm vào tên công ty & vị trí thì hiện chi tiết tin tuyển dụng gốc */}
                      <td className="py-3.5 px-4">
                        <Link 
                          to={`/jobs/${item.jobId}`}
                          className="block group-hover:text-blue-600 transition-colors no-underline"
                        >
                          <div className="font-extrabold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5 underline decoration-transparent group-hover:decoration-slate-300">
                            {item.company} (Xem tin tuyển dụng ↗)
                          </div>
                        </Link>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {item.appliedDate}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 max-w-[150px] truncate">
                        <span className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 underline cursor-pointer decoration-slate-300">
                          <FileText size={12} className="text-slate-400" /> {item.cvName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* 💡 YÊU CẦU 2: Phía sau hiển thị nút bấm tương ứng để xem Lịch hẹn hoặc Lý do phản hồi */}
                      <td className="py-3.5 px-4 text-center">
                        {item.status === 'pending' ? (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg cursor-default">
                            Chờ phản hồi
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedApply(item)} // Kích hoạt gán data để mở Modal
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-[10.5px] font-bold rounded-xl border shadow-2xs transition-all active:scale-95 ${
                              item.status === 'approved'
                                ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200'
                            }`}
                          >
                            <Eye size={12} />
                            {item.status === 'approved' ? 'Xem lịch hẹn' : 'Xem lý do'}
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

      {/* 🔮 3. POPUP MODAL ĐẮT GIÁ - TỰ ĐỘNG HIỂN THỊ LỊCH HẸN HOẶC LÝ DO THEO TRẠNG THÁI */}
      {selectedApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          
          {/* Thân hộp thoại Modal */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header Modal đổi màu linh hoạt theo trạng thái tuyển dụng */}
            <div className={`p-4 text-white flex items-center justify-between ${
              selectedApply.status === 'approved' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-slate-800 to-rose-950'
            }`}>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                  Phản hồi từ {selectedApply.company}
                </span>
                <h2 className="text-sm font-black mt-1 tracking-tight">{selectedApply.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedApply(null)}
                className="p-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Nội dung chi tiết Modal */}
            <div className="p-5 space-y-4 text-xs font-semibold text-slate-700 leading-relaxed">
              
              {/* NẾU LÀ TRẠNG THÁI ĐÃ DUYỆT -> HIỂN THỊ LỊCH HẸN PHỎNG VẤN */}
              {selectedApply.status === 'approved' && (
                <div className="space-y-3.5">
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <Calendar size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Thời gian phỏng vấn</h4>
                      <p className="text-slate-800 font-extrabold mt-0.5 text-xs">{selectedApply.details.time}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MapPin size={16} className="text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Địa điểm / Hình thức</h4>
                      <p className="text-slate-800 font-bold mt-0.5 text-xs">{selectedApply.details.location}</p>
                      <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded mt-1.5">
                        {selectedApply.details.type}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FFFDF9] border border-amber-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MessageSquare size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Ghi chú từ Nhà tuyển dụng</h4>
                      <p className="text-slate-600 font-medium mt-1 leading-relaxed text-left whitespace-pre-line">{selectedApply.details.note}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* NẾU LÀ TRẠNG THÁI BỊ TỪ CHỐI -> HIỂN THỊ LÝ DO HỒ SƠ CHƯA PHÙ HỢP */}
              {selectedApply.status === 'rejected' && (
                <div className="space-y-3.5 text-left">
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">Lý do từ chối hồ sơ</h4>
                      <p className="text-slate-700 font-medium mt-1 leading-relaxed whitespace-pre-line">{selectedApply.details.reason}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex gap-2.5 items-start">
                    <MessageSquare size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Thư chia sẻ của HR tuyển dụng</h4>
                      <p className="text-slate-500 font-medium mt-1 leading-relaxed text-justify whitespace-pre-line">{selectedApply.details.note}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Nút đóng chân Modal */}
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApply(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Đóng lại
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}