import React, { useState } from 'react';
import CVItem from '../../components/CVItem';

const CVManagement = () => {
  // Dữ liệu danh sách CV ban đầu phối màu mô phỏng theo ảnh mockup
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
    const newId = Date.now();
    const newCV = {
      id: newId,
      name: 'Name Name',
      title: 'Software Manager',
      themeColor: 'bg-indigo-600',
      isNew: true
    };
    setCvList([newCV, ...cvList]);
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
        
        // Thêm file vừa tải lên vào danh sách hiển thị
        const newId = Date.now();
        const uploadedCV = {
          id: newId,
          name: file.name.split('.')[0], // Lấy tên file làm tên hiển thị luôn
          title: 'Hồ sơ đính kèm (.PDF)',
          themeColor: 'bg-slate-500',
          isNew: true
        };
        setCvList([uploadedCV, ...cvList]);
      }
    };
    fileInput.click();
  };

  // Điều hướng hoặc bật modal sửa CV
  const handleEditCV = (id) => {
    alert(`Đang mở trình chỉnh sửa cho hồ sơ ID: ${id}`);
  };

  // Xóa CV ra khỏi danh sách trạng thái
  const handleDeleteCV = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản CV này không?')) {
      setCvList(cvList.filter(cv => cv.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-slate-50/50 min-h-screen font-sans">
      
      <div className="flex flex-col bg-blue-300 text-white md:flex-row md:items-center md:justify-between gap-4 p-8 rounded-2xl shadow-md mb-8">         
  {/* KHỐI BÊN TRÁI: Tiêu đề & Đếm số lượng dòng thông báo */}
  <div className="text-left">
    {/* Đổi text-slate-800 thành text-white (hoặc text-slate-900 nếu muốn giống ảnh) */}
    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý CV</h1>
    {/* Đổi text-slate-500 thành text-blue-100 để chữ sáng và mịn hơn trên nền xanh */}
    <p className="text-white text-sm mt-2">
      Bạn đang có <span className="font-extrabold text-white bg-blue-600/40 px-2 py-0.5 rounded-md">{cvList.length} CV</span> đã tạo và tải lên hệ thống.
    </p>
  </div>

  {/* KHỐI BÊN PHẢI: Bộ đôi nút chức năng hành động nhanh */}
  <div className="flex items-center gap-3 shrink-0">
    {/* Nút Tạo CV Mới: Đổi sang màu xanh đậm hơn hẳn hoặc màu trắng để nổi bật */}
    <button
      onClick={handleCreateCV}
      className="bg-green-600 hover:bg-green-600 text-white text-xs font-bold py-3 px-5 rounded-xl shadow-md transition-all duration-200 flex items-center gap-1.5 transform hover:-translate-y-0.5"
    >
      <span className="text-sm">+</span> Tạo CV Mới
    </button>
    
    {/* Nút Tải CV từ máy lên: Dùng màu tím Indigo sáng tương phản tốt với nền xanh */}
    <button
      onClick={handleUploadCV}
      className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold py-3 px-5 rounded-xl shadow-md transition-all duration-200 flex items-center gap-1.5 transform hover:-translate-y-0.5"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      Tải CV Từ Máy Tính Lên
    </button>
  </div>
</div>

{/* LƯỚI DANH SÁCH HIỂN THỊ CÁC CV */}
{cvList.length === 0 ? (
  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
    {/* Đổi text-white thành text-slate-400 vì nền ở đây là bg-white */}
    <p className="text-slate-400 text-sm font-medium">Hệ thống trống. Hãy nhấn nút để bắt đầu thêm hồ sơ đầu tiên của bạn!</p>
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

    </div>
  );
};

export default CVManagement;