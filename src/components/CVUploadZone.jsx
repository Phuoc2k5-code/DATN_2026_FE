import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, Trash2, CheckCircle2, Loader2, X, AlertCircle } from 'lucide-react';

export default function CVUploadZone({ onUploadSuccess, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Hàm kiểm tra file hợp lệ
  const validateAndSetFile = (file) => {
    if (!file) return;

    const allowedTypes = ['application/pdf'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['pdf'];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setErrorMessage('Vui lòng chỉ tải lên định dạng file PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Dung lượng file quá lớn! Vui lòng chọn file dưới 5MB.');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
  };

  // Xử lý khi chọn file qua nút bấm
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
    e.target.value = ''; 
  };

  // Xử lý sự kiện Kéo & Thả (Drag & Drop)
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setErrorMessage('');
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
        setSelectedFile(null);
        if (typeof onUploadSuccess === 'function') {
          onUploadSuccess(response.data.data); 
        }
      }
    } catch (error) {
      console.error('Lỗi upload:', error);
      setErrorMessage(error.response?.data?.message || 'Tải file lên thất bại. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage('');
  };

  return (
    /* LỚP NỀN MỜ PHÍA SAU (OVERLAY) */
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose} 
    >
      <div 
        className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl space-y-4 relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Tiêu đề cửa sổ & Nút X */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Tải hồ sơ từ máy tính</h3>
            <p className="text-[11px] text-slate-400">Hệ thống chấp nhận file PDF dưới 5MB</p>
          </div>
          <button 
            disabled={isUploading}
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* THÔNG BÁO LỖI NỘI BỘ (Thay thế alert) */}
        {errorMessage && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl animate-shake">
            <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
            <span className="text-[11px] font-medium text-red-600 leading-normal">{errorMessage}</span>
          </div>
        )}

        {/* Khung kéo thả hoặc Preview file */}
        {!selectedFile ? (
          <>
            <label 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 group relative
                ${isDragActive 
                  ? 'border-orange-500 bg-orange-50/20 scale-[0.99]' 
                  : 'border-slate-200 hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/10'
                }`}
            >
              <UploadCloud 
                className={`transition-all duration-300 ${isDragActive ? 'text-orange-500 scale-110' : 'text-slate-400 group-hover:text-orange-500 group-hover:scale-105'}`} 
                size={36} 
              />
              <span className="text-xs font-bold text-slate-600 text-center">
                {isDragActive ? "Thả file của bạn vào đây!" : "Kéo thả hoặc bấm để chọn file CV"}
              </span>
              <span className="text-[10px] text-slate-400">Hệ thống chỉ hỗ trợ .pdf</span>
              <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
            </label>

            {/* LƯU Ý QUAN TRỌNG */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-slate-700">
                <AlertCircle size={14} className="text-orange-500 shrink-0" />
                <span className="text-xs font-bold">Lưu ý quan trọng khi tải CV:</span>
              </div>
              <ul className="text-[11px] text-slate-500 space-y-1.5 pl-4 list-disc leading-relaxed">
                <li>
                  Chỉ chấp nhận file định dạng <strong className="text-slate-700">PDF</strong> có dung lượng <strong className="text-slate-700">dưới 5MB</strong>.
                </li>
                <li>
                  Để hệ thống AI phân tích chính xác, CV cần ghi rõ: <strong className="text-slate-700">Ngành nghề, kỹ năng chuyên môn</strong> và <strong className="text-slate-700">tiêu đề công việc</strong>.
                </li>
                <li>
                  Bạn chưa có mẫu chuẩn? Hãy tải và tham khảo ngay:{' '}
                  <a 
                    href="http://localhost:8000/CV_template.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-orange-500 hover:text-orange-600 font-semibold underline inline-flex items-center gap-0.5"
                  >
                    CV mẫu tại đây
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-orange-50/40 border border-orange-100/70 rounded-xl">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="text-orange-500 shrink-0" size={22} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate">{selectedFile.name}</p>
                  <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                disabled={isUploading} 
                onClick={handleRemoveFile}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                disabled={isUploading}
                onClick={handleRemoveFile}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50"
              >
                Chọn file khác
              </button>
              <button
                disabled={isUploading}
                onClick={handleUploadSubmit}
                className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-70"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} /> Xác nhận tải lên
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