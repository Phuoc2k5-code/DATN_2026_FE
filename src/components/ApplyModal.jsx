import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, Send, Database, Monitor } from 'lucide-react';

export default function ApplyModal({ 
  isOpen,          
  onClose,         
  jobTitle,        
  companyName,
  // 💡 MỚI: Danh sách CV đã có sẵn trên hệ thống của ứng viên này (Giả lập nhận từ Profile ứng viên)
  availableCVs = [
    { id: "cv-01", name: "CV_NguyenVanA_Frontend_Developer.pdf", updatedAt: "02/06/2026" },
    { id: "cv-02", name: "CV_NguyenVanA_ReactJS_Senior.pdf", updatedAt: "25/05/2026" }
  ]
}) {
  // Trạng thái hình thức nộp: 'system' (chọn từ hệ thống) hoặc 'upload' (tải từ máy)
  const [cvSource, setCvSource] = useState('system'); 
  
  // Lưu CV được chọn (Nếu từ hệ thống thì lưu Object CV, nếu tải lên thì lưu File Object)
  const [selectedCv, setSelectedCv] = useState(null); 
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Thay đổi phương thức chọn CV -> Reset lựa chọn cũ để tránh xung đột dữ liệu
  const handleChangeSource = (source) => {
    setCvSource(source);
    setSelectedCv(null); 
  };

  // Xử lý chọn file từ máy tính
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedCv(e.target.files[0]);
    }
  };

  // Xử lý kéo thả file từ máy tính
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedCv(e.dataTransfer.files[0]);
    }
  };

  // Xử lý nộp hồ sơ chung
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCv) {
      alert("Vui lòng chọn hoặc tải lên CV trước khi nộp hồ sơ!");
      return;
    }

    setIsSubmitting(true);

    // 💡 ĐỒNG BỘ BACKEND: Chuẩn hóa dữ liệu gửi đi dựa trên nguồn CV
    const submitData = {
      job: jobTitle,
      company: companyName,
      sourceType: cvSource, // 'system' hoặc 'upload'
      message: coverLetter,
      // Nếu chọn từ hệ thống thì gửi ID của CV đó, nếu tải lên thì gửi file vật lý (hoặc tên file)
      cvData: cvSource === 'system' ? selectedCv.id : selectedCv.name 
    };
    
    console.log("[Hệ thống Ứng tuyển] Đang xử lý hồ sơ:", submitData);

    // Giả lập hiệu ứng gửi API kết nối Database
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedCv(null);
        setCoverLetter('');
        setCvSource('system');
        onClose();
      }, 2000);
    }, 1500);
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

            {/* Form nộp hồ sơ */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {/* 💡 THAY ĐỔI LỚN: THANH CHUYỂN TAB CHỌN NGUỒN CV */}
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

              {/* VÙNG CHỨA NỘI DUNG THAY ĐỔI THEO TAB */}
              <div className="min-h-[110px]">
                
                {/* 📌 TRƯỜNG HỢP 1: CHỌN CV CÓ SẴN TRÊN HỆ THỐNG */}
                {cvSource === 'system' && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    {availableCVs.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {availableCVs.map((cv) => (
                          <label 
                            key={cv.id} 
                            className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                              selectedCv?.id === cv.id
                                ? 'border-blue-500 bg-blue-50/20 shadow-xs'
                                : 'border-slate-100 hover:bg-slate-50'
                            }`}
                          >
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
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 border border-slate-100 bg-slate-50/50 rounded-xl">
                        <p className="text-xs font-semibold text-slate-400">Bạn chưa lưu CV nào trên hệ thống.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 📌 TRƯỜNG HỢP 2: TẢI FILE TỪ MÁY TÍNH LÊN */}
                {cvSource === 'upload' && (
                  <div className="animate-in fade-in duration-200">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden" 
                    />

                    {!selectedCv ? (
                      <div 
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                        className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-xl p-5 text-center cursor-pointer transition-all group"
                      >
                        <UploadCloud size={24} className="text-slate-400 group-hover:text-blue-500 mx-auto mb-1.5 transition-colors" />
                        <p className="text-xs font-bold text-slate-700">Kéo thả CV vào đây hoặc <span className="text-blue-600 group-hover:underline">Chọn file</span></p>
                        <p className="text-[9.5px] text-slate-400 font-medium mt-0.5">Hỗ trợ định dạng: PDF, DOC, DOCX</p>
                      </div>
                    ) : (
                      <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                            <FileText size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 line-clamp-1 pr-2">{selectedCv.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              {selectedCv.size ? `${(selectedCv.size / (1024 * 1024)).toFixed(2)} MB` : 'Tệp tải lên'}
                            </p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setSelectedCv(null)}
                          className="p-1 rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* LỜI NHẮN CHO NHÀ TUYỂN DỤNG */}
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
          /* MÀN HÌNH CHÚC MỪNG THÀNH CÔNG */
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
    </div>
  );
}