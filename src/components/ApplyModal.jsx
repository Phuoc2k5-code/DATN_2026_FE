import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 🚀 Nhập thư viện gọi API thực tế
import { X, FileText, CheckCircle2, Send, Database, Monitor, Eye } from 'lucide-react'; 
import CVUploadZone from './CVUploadZone'; 

export default function ApplyModal({ 
  isOpen,          
  onClose,         
  jobTitle,        
  companyName,
  jobId,
  availableCVs = [],
  onApplySuccess,
  onUploadNewCv
}) {
  const [cvSource, setCvSource] = useState('system'); 
  const [selectedCv, setSelectedCv] = useState(null); 
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [myCVs, setMyCVs] = useState([]);
  const [isOpenUploadPopup, setIsOpenUploadPopup] = useState(false);

  useEffect(() => {
    setMyCVs(availableCVs);
    if (availableCVs.length > 0) {
      setSelectedCv(availableCVs[0]); 
    } else {
      setSelectedCv(null);
    }
  }, [availableCVs]);

  if (!isOpen) return null;

  const handleChangeSource = (source) => {
    setCvSource(source);
    if (source === 'upload') {
      setIsOpenUploadPopup(true);
    }
  };

  const handleCloseUploadPopup = () => {
    setIsOpenUploadPopup(false);
    setCvSource('system');
  };

  const handleUploadSuccess = (newCvData) => {
      const formattedCV = {
        id: newCvData.id,
        name: `📁 ${newCvData.name || newCvData.file_name || "CV_Mới_Tải_Lên.pdf"}`,
        file_url: newCvData.file_path ? `http://127.0.0.1:8000/${newCvData.file_path}` : '#',
        updatedAt: new Date().toLocaleDateString('vi-VN'),
        isOnline: false
      };
      console.log(formattedCV)
      // 1. Cập nhật state nội bộ để hiển thị tích chọn luôn trong modal
      setMyCVs([formattedCV, ...myCVs]);
      setSelectedCv(formattedCV); 
      setIsOpenUploadPopup(false); 
      setCvSource('system'); 

      // 2. 🔥 QUAN TRỌNG NHẤT: Báo cho Component cha biết để cập nhật state tổng!
      if (onUploadNewCv) {
        onUploadNewCv(formattedCV);
      }
    };

  // 🚀 HÀM GỌI API CHÍNH THỨC SANG LARAVEL BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCv) {
      alert("Vui lòng chọn hoặc tải lên CV trước khi nộp hồ sơ!");
      return;
    }


    setIsSubmitting(true);

    const submitData = {
      job_id: jobId,             
      cv_file_id: selectedCv.id, 
      description: coverLetter,
    };
    
    console.log("[Hệ thống Ứng tuyển] Gửi dữ liệu đơn lên BE:", submitData);

    try {
      // Gọi Post API truyền payload dữ liệu sang Laravel
      const response = await axios.post('http://127.0.0.1:8000/api/quick-apply', submitData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setIsSubmitting(false);
        setIsSuccess(true);
      
        
        // Đợi 2 giây giữ màn hình thông báo rồi reset form và đóng modal
        setTimeout(() => {
            if (onApplySuccess) {
          onApplySuccess(); // 🚀 2. Kích hoạt hàm này để báo cho JobDetail đổi trạng thái nút!
       }
          setIsSuccess(false);
          setCoverLetter('');
          setCvSource('system');
          onClose(); 
        }, 2000);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Lỗi nộp đơn ứng tuyển:", error);
      const msg = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!";
      alert(`⚠️ Ứng tuyển thất bại: ${msg}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center z-50 overflow-y-auto no-scrollbar p-4 py-8 sm:py-12 font-sans text-slate-800">
      <div className="fixed inset-0 -z-10" onClick={!isSubmitting ? onClose : undefined} />

      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-5 sm:p-6 my-auto animate-in zoom-in-95 duration-200 relative overflow-hidden">
        
        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Ứng tuyển công việc</h3>
                <p className="text-[11px] font-bold text-blue-600 mt-0.5 line-clamp-1">
                  {jobTitle} • <span className="text-slate-500">{companyName}</span>
                </p>
              </div>
              <button 
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {/* THANH CHUYỂN TAB */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Phương thức nộp CV *</label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/40">
                  <button
                    type="button"
                    onClick={() => handleChangeSource('system')}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      cvSource === 'system'
                        ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/50'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                    }`}
                  >
                    <Database size={13} />
                    CV trên hệ thống
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeSource('upload')}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      cvSource === 'upload'
                        ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/50'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                    }`}
                  >
                    <Monitor size={13} />
                    Tải CV từ máy tính
                  </button>
                </div>
              </div>

              {/* VÙNG NỘI DUNG THEO TAB */}
              <div className="min-h-[110px]">
                {cvSource === 'system' && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    {myCVs.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {myCVs.map((cv) => (
                          <div 
                            key={cv.id} 
                            className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                              selectedCv?.id === cv.id
                                ? 'border-blue-500 bg-blue-50/20 shadow-xs'
                                : 'border-slate-100 hover:bg-slate-50'
                            }`}
                          >
                            <label className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 pr-2">
                              <input 
                                type="radio" 
                                name="systemCV" 
                                checked={selectedCv?.id === cv.id}
                                onChange={() => setSelectedCv(cv)}
                                className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500"
                              />
                              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                <FileText size={14} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-800 line-clamp-1">{cv.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Cập nhật ngày: {cv.updatedAt}</p>
                              </div>
                            </label>

                            {cv.file_url && (
                              <a 
                                href={cv.file_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-1.5 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-lg text-slate-400 transition-colors shrink-0"
                                title="Xem trước CV"
                              >
                                <Eye size={13} />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 border border-slate-100 bg-slate-50/50 rounded-xl">
                        <p className="text-xs font-semibold text-slate-400">Bạn chưa có CV nào trên hệ thống.</p>
                      </div>
                    )}
                  </div>
                )}

                {cvSource === 'upload' && (
                  <div className="text-center py-6 text-slate-400 text-xs font-medium animate-pulse">
                    Đang mở cửa sổ tải file...
                  </div>
                )}
              </div>

              {/* LỜI NHẮN */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex justify-between">
                  <span>Lời nhắn gửi nhà tuyển dụng</span>
                  <span className="text-[10px] text-slate-400 lowercase font-normal">(Không bắt buộc)</span>
                </label>
                <textarea 
                  rows="3"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Giới thiệu ngắn gọn về thế mạnh nổi bật của bạn..."
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-400 leading-relaxed"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {/* Nhóm nút bấm */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-5">
                <button 
                  type="button" 
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang nộp...</span>
                    </>
                  ) : (
                    <>
                      <Send size={12} />
                      <span>Nộp hồ sơ ngay</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </>
        ) : (
          /* THÀNH CÔNG */
          <div className="py-8 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-3.5 shadow-sm">
              <CheckCircle2 size={24} className="animate-bounce" />
            </div>
            <h3 className="text-base font-black text-slate-900">Ứng tuyển thành công!</h3>
            <p className="text-xs font-medium text-slate-500 max-w-xs mt-1.5 leading-relaxed">
              Hồ sơ của bạn đã được chuyển tới nhà tuyển dụng <span className="font-bold text-slate-800">{companyName}</span> thành công!
            </p>
          </div>
        )}

      </div>

      {isOpenUploadPopup && (
        <CVUploadZone 
          onUploadSuccess={handleUploadSuccess} 
          onClose={handleCloseUploadPopup} 
        />
      )}
    </div>
  );
}