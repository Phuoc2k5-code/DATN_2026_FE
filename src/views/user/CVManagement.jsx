import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Plus, Upload, AlertCircle, Monitor, HardDrive, RefreshCw, LogIn } from 'lucide-react';
import axios from 'axios';
import axiosInstance from 'axios'; // Đảm bảo sử dụng đúng thư viện axios gốc
import CVItem from '../../components/CVItem';
import CVUploadZone from '../../components/CVUploadZone';
import { handleDownloadAndSaveCV } from '../../utils/cvHandler';

const API_BASE_URL = 'http://localhost:8000/api';

export default function CVManagement() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // 💡 KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const countUploadedFiles = uploadedFiles.filter(file => file.type === 'uploaded').length;

  const fetchCVData = async () => {
    // 🚀 Nếu chưa đăng nhập thì không gọi API để tránh lỗi log console
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`${API_BASE_URL}/cv-management`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      setProfile(response.data.cv_online);
      setUploadedFiles(response.data.cv_files || []);
    } catch (error) {
      console.error("Không thể tải dữ liệu hồ sơ từ hệ thống:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVData();
  }, [isLoggedIn]);

  const handleCreateCV = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate('/cv-management/create-cv');
  };

  const handleUploadSuccess = (newFileData) => {
    fetchCVData();
  };

  const handleDownloadOnlineCV = async () => {
    await handleDownloadAndSaveCV(null, setIsDownloading);
  };

  const handleViewFile = (filePath) => {
    const fullUrl = filePath.startsWith('http')
        ? filePath
        : `http://localhost:8000${filePath}`;
    window.open(fullUrl, '_blank');
  };

  const handleDeleteFile = async (id) => {
    if (window.confirm('Hành động này sẽ ẩn file CV khỏi giao diện của bạn nhưng vẫn bảo lưu lịch sử hệ thống. Bạn có chắc chắn muốn xóa mềm tệp này?')) {
      try {
        const res = await axiosInstance.delete(`${API_BASE_URL}/cv-management/destroy-file/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (res.data.success || res.status === 200) {
          alert(res.data.message || 'Xóa mềm tệp tin thành công!');
          fetchCVData();
        }
      } catch (error) {
        console.error("Lỗi xóa file:", error);
        alert(error.response?.data?.message || 'Không thể xóa tệp tin vào lúc này!');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center gap-2">
        <RefreshCw className="animate-spin text-orange-500" size={20} />
        <span className="text-sm font-medium text-slate-600">Đang đồng bộ dữ liệu hệ thống...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full">

      {/* HEADER TRANG */}
      <div className="w-full bg-gradient-to-br from-orange-100/60 via-amber-50/40 to-white text-slate-800 px-4 sm:px-6 lg:px-8 py-10 border-b border-orange-100/70 shadow-sm">
        <div className="max-w-6xl mx-auto">

          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors mb-5 group w-fit">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Quay lại trang chủ
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100/80 border border-orange-200/50 rounded-2xl shadow-sm backdrop-blur-xs">
                <FileText size={22} className="text-orange-600 fill-orange-600/10" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Quản lý hồ sơ & CV
                </h1>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {isLoggedIn 
                    ? `Hỗ trợ tối đa 3 file tải lên từ thiết bị • Kho tệp hiện tại: ${countUploadedFiles}/3`
                    : "Vui lòng đăng nhập để sử dụng tính năng tải hồ sơ và quét AI đối sánh Job"
                  }
                </p>
              </div>
            </div>

            {/* KHU VỰC CÁC NÚT ĐẦU TRANG */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => isLoggedIn ? setShowUploadZone(!showUploadZone) : navigate('/login')}
                disabled={isLoggedIn && countUploadedFiles >= 3}
                className={`text-xs font-bold py-2.5 px-4 rounded-xl border shadow-xs transition-all duration-200 flex items-center gap-1.5 transform active:scale-95 ${
                  isLoggedIn && countUploadedFiles >= 3
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white/80 hover:bg-orange-50/50 text-slate-700 hover:text-orange-600 border-slate-200 hover:border-orange-200/80 hover:-translate-y-0.5 cursor-pointer'
                }`}
              >
                <Upload size={13} strokeWidth={2.5} />
                Tải CV từ máy {isLoggedIn && `(${countUploadedFiles}/3)`}
              </button>
              
              {showUploadZone && isLoggedIn && countUploadedFiles < 3 && (
                <CVUploadZone
                  onUploadSuccess={(data) => {
                    handleUploadSuccess(data);
                    setShowUploadZone(false);
                  }}
                  onClose={() => setShowUploadZone(false)}
                />
              )}

              <button
                onClick={handleCreateCV}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-orange-100 transition-all duration-200 flex items-center gap-1.5 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Plus size={14} strokeWidth={2.5} />
                Tạo CV trực tuyến
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KHU VỰC HIỂN THỊ DANH SÁCH */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">

        {/* 🚀 CASE 1: CHƯA ĐĂNG NHẬP (Hiện màn hình kích hoạt thay vì thông báo "Danh sách trống") */}
        {!isLoggedIn ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs max-w-xl mx-auto p-6">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
              <AlertCircle size={24} className="text-amber-500" />
            </div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Yêu cầu đăng nhập</h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              Vui lòng kết nối tài khoản ứng viên để bắt đầu khởi tạo hồ sơ trực tuyến, lưu trữ file đính kèm phục vụ việc kết nối ứng tuyển.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-5 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <LogIn size={13} /> Đăng nhập ngay
            </button>
          </div>
        ) : (!profile && uploadedFiles.length === 0) ? (
          /* CASE 2: ĐÃ ĐĂNG NHẬP NHƯNG DANH SÁCH TRỐNG THỰC SỰ */
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs max-w-xl mx-auto mt-8">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
              <AlertCircle size={24} className="text-amber-400" />
            </div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Danh sách trống</h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              Hệ thống chưa ghi nhận hồ sơ nào. Hãy điền thông tin CV Trực tuyến hoặc Tải lên bản PDF để quét AI ngay!
            </p>
          </div>
        ) : (
          /* CASE 3: ĐÃ ĐĂNG NHẬP VÀ CÓ DỮ LIỆU CHUẨN */
          <>
            {/* SECTION 1: HỒ SƠ TRỰC TUYẾN */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Monitor size={16} className="text-orange-500" />
                <h2 className="text-sm font-bold text-slate-700 tracking-tight uppercase">
                  Hồ sơ trực tuyến đang thiết lập
                </h2>
              </div>

              {!profile ? (
                <div className="bg-white p-5 border border-dashed border-slate-200 rounded-2xl flex items-center justify-between">
                  <p className="text-xs text-slate-400 italic">Bạn chưa tạo nội dung cho dữ liệu CV trực tuyến.</p>
                  <button onClick={handleCreateCV} className="text-xs font-bold text-orange-500 hover:underline cursor-pointer">Tạo ngay</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  <CVItem
                    cv={{
                      id: profile.id,
                      name: profile.full_name || 'Ứng viên hệ thống',
                      title: profile.title || 'Chưa cập nhật vị trí chuyên môn',
                      themeColor: 'bg-slate-900',
                      isNew: false
                    }}
                    onEdit={() => navigate(`/cv-management/edit-cv/${profile.id}`)}
                    changeTemplate={() => navigate(`/cv-management/preview-cv/${profile.id}`)}
                    onDownload={handleDownloadOnlineCV}
                    isDownloading={isDownloading}
                  />
                </div>
              )}
            </section>

            {/* SECTION 2: KHO TỆP TIN PDF */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <HardDrive size={16} className="text-amber-500" />
                <h2 className="text-sm font-bold text-slate-700 tracking-tight uppercase flex items-center gap-2 flex-wrap">
                  Kho tệp tin PDF ({uploadedFiles.length})
                  <span className="text-[10px] font-normal normal-case bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-100/50">
                    Bản mới nhất sẽ được AI ưu tiên sử dụng để đối sánh Job
                  </span>
                </h2>
              </div>

              {uploadedFiles.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">Chưa có tệp dữ liệu PDF nào trong kho lưu trữ.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={file.id} 
                      className="relative bg-white p-4 border border-slate-200/60 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[145px]"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-extrabold text-sm text-slate-800 truncate max-w-[160px]" title={file.file_name}>
                            {file.file_name}
                          </p>
                          {index === 0 && (
                            <span className="text-[9px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-200 shrink-0 animate-pulse">
                              AI Active
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5">
                          {file.type === 'uploaded' ? (
                            <span className="text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md">
                              📁 Bản gốc tải lên
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 rounded-md">
                              🤖 Hệ thống xuất (Apply)
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-400 mt-3">
                          Thời gian: {new Date(file.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          Đã đồng bộ
                        </span>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleViewFile(file.file_path)}
                            className="text-[11px] font-bold text-orange-500 hover:text-orange-600 transition-colors bg-transparent border-none cursor-pointer"
                          >
                            Xem File
                          </button>

                          {file.type === 'uploaded' ? (
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-[11px] font-bold text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              Xóa
                            </button>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-300 cursor-not-allowed select-none" title="Không thể xóa file lịch sử ứng tuyển">
                              Đóng băng
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}