import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import axios from 'axios'; // 🚀 BỔ SUNG: Import axios để gọi API

export default function ReportModal({
  isOpen,          // Trạng thái đóng/mở (true/false) từ trang cha truyền vào
  onClose,         // Hàm để đóng modal từ trang cha
  targetId,        // ID của đối tượng bị báo cáo (Job ID hoặc Company ID)
  targetName,      // Tên của đối tượng bị báo cáo (Tên công việc hoặc Tên công ty)
  type = 'job'     // Phân loại báo cáo: 'job' (mặc định) hoặc 'company'
}) {
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [loading, setLoading] = useState(false); // 🚀 BỔ SUNG: Trạng thái chờ khi gửi API

  // Nếu trạng thái đóng thì không render gì cả
  if (!isOpen) return null;

  // Danh sách lý do động tùy thuộc vào việc báo cáo Tin hay báo cáo Công ty
  const jobReasons = [
    "Thông tin tuyển dụng lừa đảo, giả mạo",
    "Địa chỉ hoặc thông tin công ty không có thật",
    "Yêu cầu đóng phí ứng tuyển, đặt cọc tiền",
    "Ngôn từ không phù hợp, phân biệt đối xử",
    "Lý do khác"
  ];

  const companyReasons = [
    "Công ty ma, không có hoạt động trên thực tế",
    "Mạo danh thương hiệu doanh nghiệp lớn khác",
    "Môi trường làm việc vi phạm pháp luật / giữ giấy tờ tùy thân",
    "Đăng tin spam, quấy rối ứng viên",
    "Lý do khác"
  ];

  const activeReasons = type === 'company' ? companyReasons : jobReasons;

  // 🚀 HÀM MỚI: Chuyển đổi chữ Tiếng Việt giao diện sang mã Tiếng Anh mà Backend yêu cầu
  const getReasonType = (textReason) => {
    switch (textReason) {
      case "Thông tin tuyển dụng lừa đảo, giả mạo":
      case "Yêu cầu đóng phí ứng tuyển, đặt cọc tiền":
        return 'fraud';
      case "Địa chỉ hoặc thông tin công ty không có thật":
        return 'wrong_info';
      case "Ngôn từ không phù hợp, phân biệt đối xử":
      case "Đăng tin spam, quấy rối ứng viên":
        return 'bad_behavior';
      case "Công ty ma, không có hoạt động trên thực tế":
      case "Mạo danh thương hiệu doanh nghiệp lớn khác":
        return 'fake_company';
      default:
        return 'other'; // "Lý do khác" hoặc các vi phạm môi trường làm việc
    }
  };

  // Xử lý gửi dữ liệu lên hệ thống
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 
    if (!token) {
      alert("Chức năng này yêu cầu đăng nhập. Vui lòng đăng nhập tài khoản ứng viên để tiếp tục!");
      setLoading(false);
      return;
    }
    if (!reportReason) {
      alert("Vui lòng chọn lý do cụ thể!");
      return;
    }

    setLoading(true);

    try {     
      
      // 2. Gom dữ liệu đúng định dạng gôm chung của Controller
      const payload = {
        id: targetId,
        type: type, // 'job' hoặc 'company'
        reason_type: getReasonType(reportReason), // Đã dịch sang tiếng Anh mã hóa
        description: reportDescription || null
      };

      // 3. Bắn Request lên Backend
      const response = await axios.post('http://localhost:8000/api/reports', payload, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (response.data && response.data.success) {
        alert(response.data.message || "Gửi báo cáo thành công!");
        
        // Reset dữ liệu và đóng bảng
        setReportReason('');
        setReportDescription('');
        onClose(); // Đóng modal
      }
    } catch (error) {
      console.error("Lỗi gửi báo cáo:", error);
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi hệ thống, vui lòng thử lại sau!";
      
      // Nếu có lỗi validate chi tiết từ Validator::make trả về
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0][0];
        alert(firstError);
      } else {
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center z-50 overflow-y-auto no-scrollbar p-4 py-8 sm:py-12 font-sans text-slate-800">
      <div className="fixed inset-0 -z-10" onClick={onClose} />
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-5 sm:p-6 my-auto animate-in zoom-in-95 duration-200 relative">        
        {/* HEADER MODAL */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Báo cáo {type === 'company' ? 'doanh nghiệp' : 'tin tuyển dụng'}
              </h3>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">Mã đối tượng: {targetId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
            disabled={loading}
          >
            <X size={16} />
          </button>
        </div>

        {/* FORM NỘI DUNG */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Banner Cảnh báo */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] font-semibold text-amber-800 leading-relaxed">
              Bạn có chắc chắn muốn gửi báo cáo vi phạm đối với <span className="font-extrabold text-slate-950">{targetName}</span>? Hệ thống sẽ kiểm duyệt nghiêm ngặt để bảo vệ quyền lợi cộng đồng.
            </p>
          </div>

          {/* Phần 1: Danh sách Lý do vi phạm */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Chọn lý do cụ thể *</label>
            <div className="grid grid-cols-1 gap-2">
              {activeReasons.map((reason, idx) => (
                <label key={idx} className="flex items-center gap-2.5 p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-700 transition-colors">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    disabled={loading}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Phần 2: Ô viết mô tả chi tiết lý do */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex justify-between">
              <span>Nội dung mô tả chi tiết</span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">(Không bắt buộc)</span>
            </label>
            <textarea
              rows="3"
              value={reportDescription}
              disabled={loading}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Cung cấp thêm thông tin hoặc bằng chứng cụ thể để ban quản trị xử lý nhanh hơn..."
              className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-400 leading-relaxed"
            ></textarea>
          </div>

          {/* FOOTER: Nút bấm */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? 'Đang gửi...' : 'Xác nhận & Gửi'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}