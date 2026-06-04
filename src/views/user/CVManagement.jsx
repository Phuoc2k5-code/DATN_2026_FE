import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Plus, Upload, AlertCircle } from 'lucide-react';
import CVItem from '../../components/CVItem'; // Component này giữ nguyên logic hiển thị của nhóm

export default function CVManagement(){
  const navigate = useNavigate();
  
  // Dữ liệu danh sách CV ban đầu (Cấu trúc giữ nguyên theo code gốc của hai bạn)
  const [cvList, setCvList] = useState([
    { id: 1, name: 'Nguyễn Văn A', title: 'Software Manager', themeColor: 'bg-blue-900', isNew: false },
    { id: 2, name: 'Trần Thị B', title: 'Software Manager', themeColor: 'bg-slate-700', isNew: false },
    { id: 3, name: 'Lê Văn C', title: 'Software Manager', themeColor: 'bg-slate-600', isNew: true },
    { id: 4, name: 'Phạm Minh D', title: 'Software Manager', themeColor: 'bg-indigo-900', isNew: false },
    { id: 5, name: 'Hoàng Ngọc E', title: 'Software Manager', themeColor: 'bg-amber-800/80', isNew: false },
    { id: 6, name: 'Đỗ Tiến F', title: 'Software Manager', themeColor: 'bg-teal-800', isNew: false },
  ]);

  // Xử lý sự kiện tạo CV trực tuyến mới
  const handleCreateCV = () => {
    navigate('/create-cv');
  };

  // Xử lý sự kiện kích hoạt mở file và tải CV từ thiết bị máy tính lên
  const handleUploadCV = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Đã chọn file thành công: ${file.name}`);
        
        const newId = Date.now();
        const uploadedCV = {
          id: newId,
          name: file.name.split('.')[0],
          title: 'Hồ sơ đính kèm (.PDF)',
          themeColor: 'bg-slate-500',
          isNew: true
        };
        setCvList([uploadedCV, ...cvList]);
      }
    };
    fileInput.click();
  };

  const handleEditCV = (id) => {
    alert(`Đang mở trình chỉnh sửa cho hồ sơ ID: ${id}`);
  };

  const handleDeleteCV = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản CV này không?')) {
      setCvList(cvList.filter(cv => cv.id !== id));
    }
  };

  return (
    // 💡 ĐỒNG BỘ: Đổi nền trang thành màu ấm #FFFDF9 giống SavedJobs để tạo cảm giác đồng bộ hệ thống
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full">
      
      {/* 🚀 HEADER TRANG ĐỒNG BỘ CHUẨN ĐEN - XANH CÔNG NGHỆ (GRADIENT) */}
      {/* 🚀 HEADER TRANG QUẢN LÝ HỒ SƠ & CV (ĐỒNG BỘ CHUẨN TÔNG CAM - SÁNG GIỐNG TRANG LỊCH SỬ) */}
<div className="w-full bg-gradient-to-br from-orange-100/60 via-amber-50/40 to-white text-slate-800 px-4 sm:px-6 lg:px-8 py-10 border-b border-orange-100/70 shadow-sm">
  <div className="max-w-6xl mx-auto">
    
    {/* Nút quay lại trang chủ đồng bộ hiệu ứng chuyển dịch trái */}
    <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors mb-5 group w-fit">
      <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
      Quay lại trang chủ
    </Link>
    
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      {/* Khối bên trái: Tiêu đề và biểu tượng nội dung */}
      <div className="flex items-center gap-4">
        {/* Box chứa Icon đồng bộ màu nền cam nhạt và bo góc mềm mại rounded-2xl */}
        <div className="p-3 bg-orange-100/80 border border-orange-200/50 rounded-2xl shadow-sm backdrop-blur-xs">
          <FileText size={22} className="text-orange-600 fill-orange-600/10" />
        </div>
        <div>
          {/* Tiêu đề chính dùng font-extrabold và đổ màu gradient cam/hổ phách */}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Quản lý hồ sơ & CV
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Bạn đang có <span className="text-orange-600 font-bold bg-orange-100/70 px-1.5 py-0.5 rounded-md border border-orange-200/40">{cvList.length}</span> hồ sơ phục vụ cho quy trình ứng tuyển thông minh
          </p>
        </div>
      </div>

      {/* Khối bên phải: Cặp nút hành động đồng điệu kích thước, độ bo góc, dùng gradient cam ấm */}
      {/* Khối bên phải: Cặp nút hành động phối màu thông minh (Primary & Secondary) */}
<div className="flex items-center gap-3 shrink-0">
  
  {/* NÚT PHỤ (Secondary): Tải CV từ máy - Tông trắng phối viền mảnh, chữ slate sâu, rất sang */}
  <button
    onClick={handleUploadCV}
    className="bg-white/80 hover:bg-orange-50/50 text-slate-700 hover:text-orange-600 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-200 hover:border-orange-200/80 shadow-xs transition-all duration-200 flex items-center gap-1.5 transform hover:-translate-y-0.5 active:scale-95"
  >
    <Upload size={13} strokeWidth={2.5} className="text-slate-500 group-hover:text-orange-500" /> 
    Tải CV từ máy tính
  </button>

  {/* NÚT CHÍNH (Primary): Tạo CV trực tuyến - Giữ gradient Cam Hổ Phách để làm điểm nhấn tối cao */}
  <button
    onClick={handleCreateCV}
    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-orange-100 transition-all duration-200 flex items-center gap-1.5 transform hover:-translate-y-0.5 active:scale-95"
  >
    <Plus size={14} strokeWidth={2.5} /> 
    Tạo CV trực tuyến
  </button>

</div>
    </div>

  </div>
</div>

      {/* 📦 KHU VỰC HIỂN THỊ DANH SÁCH CV TRÊN GRID LAYER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {cvList.length === 0 ? (
          // ĐỒNG BỘ: Khung rỗng (Empty State) bo góc tròn lớn, đổ bóng mờ, icon hổ phách dịu mắt giống trang SavedJobs
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs max-w-xl mx-auto">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
              <AlertCircle size={24} className="text-amber-400" />
            </div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Danh sách trống</h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              Hệ thống chưa ghi nhận hồ sơ nào. Hãy bấm nút tạo mới hoặc tải lên bản PDF để trải nghiệm tính năng chấm điểm CV bằng AI!
            </p>
          </div>
        ) : (
          // 💡 ĐỒNG BỘ: Sử dụng cấu hình responsive grid 1-2-3 cột và khoảng cách `gap-5` chuẩn chỉnh giống SavedJobs
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {cvList.map((cv) => (
              <CVItem
                key={cv.id}
                cv={cv}
                onEdit={handleEditCV}
                onDelete={handleDeleteCV}
              />
            ))}
          </div>
        )}
      </main>

    </div>
  );
};

