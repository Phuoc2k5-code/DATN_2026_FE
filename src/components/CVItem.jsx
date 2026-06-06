import React from 'react';
import { Trash2, FileEdit, LayoutTemplate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CVItem = ({ cv, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-[320px] justify-between relative">
      
      {/* Khung layout mô phỏng cấu trúc CV thực tế */}
      <div className="flex gap-4 items-start flex-1">
        {/* Cột trái: Giả lập thanh màu thông tin cá nhân của CV */}
        <div className={`w-1/3 h-full rounded-xl ${cv.themeColor} p-3 flex flex-col items-center gap-3 shrink-0`}>
          <div className="w-12 h-12 rounded-full bg-slate-200/80 border border-white overflow-hidden shrink-0">
            {/* Icon Avatar giả lập */}
            <svg className="w-full h-full text-slate-400 pt-2" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="w-full space-y-1.5">
            <div className="w-full h-1 bg-white/40 rounded"></div>
            <div className="w-4/5 h-1 bg-white/40 rounded"></div>
            <div className="w-5/6 h-1 bg-white/40 rounded"></div>
          </div>
        </div>

        {/* Cột phải: Thông tin tên tuổi, vị trí và các dòng gạch ngang mô tả */}
        <div className="flex-1 pt-1">
          <h3 className="text-base font-bold text-slate-800 tracking-tight truncate">{cv.name}</h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">{cv.title}</p>
          
          <div className="mt-4 space-y-2">
            <div className="w-full h-1.5 bg-slate-200 rounded"></div>
            <div className="w-full h-1.5 bg-slate-100 rounded"></div>
            <div className="w-11/12 h-1.5 bg-slate-100 rounded"></div>
            <div className="w-4/5 h-1.5 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>

      {/* Badge điểm nhấn "CV Mới Tạo" nằm góc trên bên phải nếu có */}
      {cv.isNew && (
        <span className="absolute top-3 right-3 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
          CV Mới Tạo
        </span>
      )}

      {/* Bộ ba nút: Sửa, Đổi mẫu, và Xóa nằm sát đáy thẻ */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
        {/* Nút 1: Sửa nội dung */}
        <button
          onClick={() => navigate(`/edit-cv/${cv.id}`)}
          className="flex-1 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[11px] font-bold py-2 px-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 active:scale-95 transform duration-150"
          title="Chỉnh sửa nội dung thông tin CV"
        >
          <FileEdit size={13} className="text-slate-500" />
          Sửa nội dung
        </button>

        {/* Nút 2 mới bổ sung: Đổi mẫu thiết kế riêng cho CV này */}
        <button
          onClick={() => navigate(`/candidate/preview-cv/${cv.id}`)}
          className="flex-1 bg-orange-50 hover:bg-orange-100/70 text-orange-600 text-[11px] font-bold py-2 px-2.5 rounded-xl border border-orange-100/60 transition-colors flex items-center justify-center gap-1 active:scale-95 transform duration-150"
          title="Thay đổi giao diện và mẫu thiết kế CV"
        >
          <LayoutTemplate size={13} className="text-orange-500" />
          Đổi mẫu
        </button>

        {/* Nút 3: Xóa CV */}
        <button
          onClick={() => onDelete(cv.id)}
          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl border border-red-100 transition-colors flex items-center justify-center active:scale-95 transform duration-150"
          title="Xóa hồ sơ này"
        >
          <Trash2 size={14} />
        </button>
      </div>

    </div>
  );
};

export default CVItem;