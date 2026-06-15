import React, { useState, useEffect } from 'react';
import { Bookmark, ArrowLeft, Briefcase, Loader2, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Job from '../../components/JobCard'; 
import axios from 'axios';

export default function SavedJobs() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra trạng thái đăng nhập nhanh
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleFilterAfterDelete = (jobId) => {
    // Xóa ngầm bài viết vừa click ra khỏi danh sách hiển thị
    setSavedJobs(prev => prev.filter(item => item.job_id !== jobId));
  };

  const fetchSaveJobs = async () => {
    // 💡 SỬA LOGIC: Nếu không có token, KHÔNG gọi API để tránh lỗi 401 bẩn console
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.data.success) {
        setSavedJobs(response.data.data || []);
      } else {
        setError(response.data.message || 'Không thể lấy dữ liệu danh sách yêu thích.');
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách đã lưu:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError(err.response?.data?.message || 'Đã xảy ra lỗi kết nối với máy chủ.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSaveJobs();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full">
      
      {/* 🚀 HEADER TRANG */}
      <div className="w-full bg-gradient-to-br from-orange-100/60 via-amber-50/40 to-white text-slate-800 px-4 sm:px-6 lg:px-8 py-10 border-b border-orange-100/70 shadow-sm">
        <div className="max-w-6xl mx-auto">
          
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors mb-5 group w-fit">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
            Quay lại trang chủ
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100/80 border border-orange-200/50 rounded-2xl shadow-sm backdrop-blur-xs">
                <Bookmark size={22} className="text-orange-600 fill-orange-600/10" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Việc làm đã lưu
                </h1>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {isLoggedIn ? (
                    <>Bạn đang lưu <span className="text-orange-600 font-bold bg-orange-100/60 px-1.5 py-0.5 rounded border border-orange-200/40 mx-0.5">{savedJobs.length}</span> cơ hội nghề nghiệp tiềm năng</>
                  ) : (
                    "Đăng nhập để xem danh sách việc làm bạn đã lưu lưu trữ"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📦 KHU VỰC HIỂN THỊ DANH SÁCH VIỆC LÀM */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* 1. Trạng thái Chưa Đăng Nhập (Hiện Banner Empty State thân thiện) */}
        {!isLoggedIn ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs max-w-xl mx-auto p-6">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
              <Bookmark size={24} className="text-amber-400" />
            </div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Bạn chưa đăng nhập</h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              Vui lòng đăng nhập tài khoản để đồng bộ và xem lại toàn bộ các tin tuyển dụng bạn đã lưu trước đó.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-5 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <LogIn size={13} /> Đăng nhập ngay
            </button>
          </div>
        ) : loading ? (
          /* 2. Trạng thái Đang tải dữ liệu từ API */
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-xs font-medium text-slate-400">Đang đồng bộ việc làm của bạn...</p>
          </div>
        ) : error ? (
          /* 3. Trạng thái gặp lỗi hệ thống hoặc hết hạn Token */
          <div className="p-5 max-w-xl mx-auto bg-red-50 border border-red-200 rounded-2xl text-center">
            <p className="text-xs text-red-600 font-semibold">{error}</p>
            <button 
              onClick={fetchSaveJobs} 
              className="mt-3 text-xs bg-red-600 text-white px-4 py-1.5 rounded-xl hover:bg-red-700 transition font-bold"
            >
              Tải lại trang
            </button>
          </div>
        ) : savedJobs.length === 0 ? (
          /* 4. Trạng thái mảng rỗng (Đã đăng nhập nhưng chưa lưu bài nào) */
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs max-w-xl mx-auto">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
              <Bookmark size={24} className="text-amber-400" />
            </div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Danh sách trống</h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              Bạn chưa lưu tin tuyển dụng nào. Hãy lướt xem các tin tuyển dụng hot và bấm lưu lại nhé!
            </p>
            <Link 
              to="/" 
              className="mt-5 inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all"
            >
              <Briefcase size={13} /> Khám phá việc làm ngay
            </Link>
          </div>
        ) : (
          /* 5. Có dữ liệu hiển thị dạng Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {savedJobs.map((item) => {
              // Trích xuất object công việc an toàn
              const jobData = item.job ? item.job : item;
              
              // Tiêm trạng thái mặc định để icon Bookmark luôn sáng rực lên
              const finalJob = { ...jobData, is_saved: true };

              return (
                <Job 
                  key={item.id || item.job_id} 
                  job={finalJob} 
                  onRemoveSuccess={handleFilterAfterDelete}
                />
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}