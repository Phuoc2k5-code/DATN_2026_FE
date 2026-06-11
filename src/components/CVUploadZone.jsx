import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, Trash2, CheckCircle2, Loader2, X } from 'lucide-react';

// Nhận thêm prop onClose từ component cha để đóng cửa sổ
export default function CVUploadZone({ onUploadSuccess, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx'];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      alert('Vui lòng chỉ tải lên định dạng file PDF hoặc Word (.doc, .docx)!');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Dung lượng file quá lớn! Vui lòng chọn file dưới 5MB.');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    e.target.value = ''; 
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('cv_file', selectedFile); 

      const response = await axios.post(
        'http://localhost:8000/api/cv-management/upload-cv', 
        formData,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert(response.data.message || 'Tải lên CV thành công!');
        setSelectedFile(null);
        
        if (typeof onUploadSuccess === 'function') {
          onUploadSuccess(response.data.data); 
        }
      }
    } catch (error) {
      console.error('Lỗi upload:', error);
      alert(error.response?.data?.message || 'Tải file lên thất bại.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    /* 🚀 LỚP NỀN MỜ PHÍA SAU (OVERLAY) */
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn"
      onClick={onClose} // Bấm ra vùng trống bên ngoài tự động đóng cửa sổ
    >
      <div 
        className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-5 shadow-xl space-y-4 relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()} // Chặn sự kiện đóng khi bấm vào bên trong cửa sổ
      >
        {/* Tiêu đề cửa sổ & Nút X */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Tải hồ sơ từ máy tính</h3>
            <p className="text-[11px] text-slate-400">Hệ thống chấp nhận file PDF hoặc Word dưới 5MB</p>
          </div>
          <button 
            disabled={isUploading}
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Khung kéo thả hoặc Preview file */}
        {!selectedFile ? (
          <label className="border-2 border-dashed border-slate-200 hover:border-orange-500 bg-slate-50/50 hover:bg-orange-50/10 rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group">
            <UploadCloud className="text-slate-400 group-hover:text-orange-500 group-hover:scale-105 transition-all" size={32} />
            <span className="text-xs font-bold text-slate-600">Bấm để chọn file CV mẫu</span>
            <span className="text-[10px] text-slate-400">Hệ thống chỉ hỗ trợ .pdf</span>
            <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50/40 border border-orange-100/70 rounded-xl">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="text-orange-500 shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate">{selectedFile.name}</p>
                  <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                disabled={isUploading} 
                onClick={() => setSelectedFile(null)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                disabled={isUploading}
                onClick={() => setSelectedFile(null)}
                className="flex-1 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 disabled:opacity-50"
              >
                Chọn file khác
              </button>
              <button
                disabled={isUploading}
                onClick={handleUploadSubmit}
                className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-sm disabled:opacity-70"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={13} /> Xác nhận tải lên
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}