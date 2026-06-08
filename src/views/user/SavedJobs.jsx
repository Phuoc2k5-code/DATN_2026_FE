import React, { useState, useEffect } from 'react';
import { Bookmark, ArrowLeft, Briefcase, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Job from '../../components/JobCard'; 
import axios from 'axios';

export default function SavedJobs() {
  // 💡 Khởi tạo mặc định là mảng rỗng [] để tránh lỗi sập trang khi chưa có dữ liệu (.length)
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Sửa chuẩn lại tên State

  const handleFilterAfterDelete = (jobId) => {
    // Xóa ngầm bài viết vừa click ra khỏi State của trang này
    const updatedList = savedJobs.filter(item => item.job_id !== jobId);
    setSavedJobs(updatedList);
  };

  const fetchSaveJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Thêm await để đợi axios trả kết quả về thực tế
      const response = await axios.get('http://localhost:8000/api/wishlist', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        }
      });
      
      if (response.data.success) {
        setSavedJobs(response.data.data);
      } else {
        setError(response.data.message || 'Không thể lấy dữ liệu.');
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách đã lưu:", err);
      setError(err.response?.data?.message || 'Đã xảy ra lỗi kết nối với máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  // 🚀 QUAN TRỌNG: Tự động chạy hàm gọi dữ liệu khi người dùng vừa truy cập vào trang này
  useEffect(() => {
    fetchSaveJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full">
      
      {/* 🚀 HEADER TRANG RIÊNG BIỆT */}
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
                  Bạn đang lưu <span className="text-orange-600 font-bold bg-orange-100/60 px-1.5 py-0.5 rounded border border-orange-200/40 mx-0.5">{savedJobs.length}</span> cơ hội nghề nghiệp tiềm năng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📦 KHU VỰC HIỂN THỊ DANH SÁCH VIỆC LÀM */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* 1. Trạng thái Đang tải dữ liệu từ API */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-xs font-medium text-slate-400">Đang đồng bộ việc làm của bạn...</p>
          </div>
        ) : error ? (
          /* 2. Trạng thái gặp lỗi (Hết hạn token, Server sập...) */
          <div className="p-4 max-w-xl mx-auto bg-red-50 border border-red-200 rounded-2xl text-center">
            <p className="text-xs text-red-600 font-semibold">{error}</p>
            <button 
              onClick={fetchSaveJobs} 
              className="mt-2.5 text-xs bg-red-600 text-white px-3 py-1.5 rounded-xl hover:bg-red-700 transition"
            >
              Tải lại trang
            </button>
          </div>
        ) : savedJobs.length === 0 ? (
          /* 3. Trạng thái mảng trống (Chưa lưu tin nào) */
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
          /* 4. Có dữ liệu hiển thị dạng Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {savedJobs.map((item) => {
              // Ép biến an toàn: Nếu Backend trả về object dạng { id, user_id, job: { ... } } 
              // thì bóc tách lấy object job con ra để đẩy vào JobCard
              const jobData = item.job ? item.job : item;
              
              // Tự động tiêm thêm trạng thái is_saved = true để nút bookmark bên trong Card sáng lên
              const finalJob = { ...jobData, is_saved: true };

              return (
                <Job key={item.id} job={finalJob} onRemoveSuccess={handleFilterAfterDelete}/>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}