import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, BrainCircuit, Target, Lightbulb, Loader2, FileText, UserCheck, LogIn, Lock } from 'lucide-react';
import axios from 'axios'; 
import Job from '../../components/JobCard'; 

export default function AiJobs() {
  const navigate = useNavigate();

  // Trạng thái lưu trữ danh sách công việc từ API
  const [userCvList, setUserCvList] = useState([]);
  const [aiRecommendedJobs, setAiRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Trạng thái theo dõi CV đang chọn để phân tích
  const [selectedCv, setSelectedCv] = useState({ type: '', id: '' });

  // 💡 KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP CHÍNH XÁC
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Lấy danh sách CV của User
  const fetchUserCvList = async () => {
    if (!isLoggedIn) return; // Chưa đăng nhập thì không gọi

    try {
      const response = await axios.get('http://localhost:8000/api/user-cv-list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        setUserCvList(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách CV:", error);
      setUserCvList([{ id: 'auto', name: '✨ Tự động (Ưu tiên CV Online)', type: '', cvId: '' }]);
    }
  };

  // Hàm gọi API tính điểm từ Backend Controller
  const fetchAiRecommendations = async (type = '', id = '') => {
    if (!isLoggedIn) {
      setLoading(false);
      return; // Khóa không cho gọi API bừa bãi khi chưa có token
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await axios.get('http://localhost:8000/api/ai-recomment', {
        params: {
          type: type || null,
          id: id || null,
          _t: new Date().getTime()
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        const mappedJobs = response.data.data.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company?.name || "Nhà tuyển dụng",
          location: job.location || "Toàn quốc",
          salary: job.salary || "Thỏa thuận",
          logoBg: job.logo_bg || "bg-orange-600",
          tags: job.skills ? job.skills.map(s => s.name) : [],
          matchScore: Math.round(job.matching_score || 0),
          aiReason: job.ai_reason || "Phù hợp với định hướng nghề nghiệp của bạn."
        }));
        
        setAiRecommendedJobs(mappedJobs);
      }
    } catch (error) {
      console.error("Lỗi gọi AI gợi ý:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token'); // Token hết hạn hoặc fake -> xóa luôn
      }
      setErrorMsg(error.response?.data?.message || "Không thể kết nối đến máy chủ AI. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Đồng bộ chạy lần đầu khi mount component
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserCvList();
      fetchAiRecommendations();
    } else {
      setLoading(false); // Tắt loading để hiện màn hình mời đăng nhập
    }
  }, [isLoggedIn]);

  // Khi người dùng đổi CV từ bộ lọc dropdown
  const handleCvChange = (e) => {
    const selectedId = e.target.value;
    const findCv = userCvList.find(cv => cv.id === selectedId);
    
    if (findCv) {
      const newCvState = { type: findCv.type, id: findCv.cvId };
      setSelectedCv(newCvState);
      fetchAiRecommendations(findCv.type, findCv.cvId);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full text-left relative">
      
      {/* BANNER NỀN SÁNG CAO CẤP */}
      <div className="w-full bg-gradient-to-br from-orange-100/80 via-amber-50/50 to-white text-slate-800 pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-orange-100/70 shadow-xs relative">
        <div className="max-w-[1550px] mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors mb-5 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Quay về trang chủ việc làm
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
                <BrainCircuit size={28} className={loading && isLoggedIn ? "animate-spin" : ""} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Trung tâm Đề xuất Việc làm AI
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1 max-w-3xl">
                  Thuật toán tối ưu hóa "Vân tay kép" tự động kiểm tra trạng thái CV và Job mới để cập nhật thông minh, tiết kiệm tài nguyên.
                </p>
              </div>
            </div>

            {/* BỘ CHỌN NGUỒN HỒ SƠ PHÂN TÍCH */}
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-xs max-w-xs w-full">
              <FileText size={16} className="text-orange-500 shrink-0" />
              <div className="w-full">
                <label className="block text-[9px] uppercase font-bold text-slate-400">Nguồn phân tích</label>
                <select 
                  onChange={handleCvChange}
                  disabled={loading || !isLoggedIn}
                  className="w-full text-xs font-semibold text-slate-700 bg-transparent border-none outline-hidden p-0 cursor-pointer disabled:opacity-50"
                >
                  {!isLoggedIn ? (
                    <option>Chưa kết nối tài khoản</option>
                  ) : userCvList.length === 0 ? (
                    <option>✨ Tự động (Ưu tiên CV Online)</option>
                  ) : (
                    userCvList.map((cv) => (
                      <option key={cv.id} value={cv.id}>{cv.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BỐ CỤC CHÍNH */}
      <main className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="w-full space-y-5">
          
          {/* Tiêu đề thanh trạng thái kết quả */}
          <div className="flex items-center justify-between border-b border-orange-100/50 pb-2.5">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
              <Target size={15} className="text-orange-600" /> 
              Kết quả phân tích {isLoggedIn && !loading && `(${aiRecommendedJobs.length} việc làm tương thích)`}
            </h3>
            {loading ? (
              <span className="flex items-center gap-1 text-[11px] text-orange-600 font-bold px-2 py-0.5 rounded-full bg-orange-50 animate-pulse">
                <Loader2 size={12} className="animate-spin" /> Đang đồng bộ dữ liệu...
              </span>
            ) : isLoggedIn ? (
              <span className="text-[11px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                <UserCheck size={11} /> Đã tối ưu hóa Token
              </span>
            ) : (
              <span className="text-[11px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                <Lock size={11} /> Chế độ ẩn danh
              </span>
            )}
          </div>

          {/* 🚀 CASE 1: CHƯA ĐĂNG NHẬP (Hiển thị Banner mời gọi thay thế lỗi 401) */}
          {!isLoggedIn ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs max-w-xl mx-auto p-6 mt-6">
              <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100">
                <Sparkles size={24} className="text-orange-500 fill-orange-500/10" />
              </div>
              <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Kích hoạt AI Matching</h3>
              <p className="text-[11px] text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Đăng nhập tài khoản giúp hệ thống tự động trích xuất bộ kỹ năng từ CV, chạy thuật toán so khớp điểm phần trăm (%) và đưa ra lý do đề xuất việc làm chuẩn xác.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="mt-6 inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <LogIn size={13} /> Kết nối ứng viên ngay
              </button>
            </div>
          ) : (
            <>
              {/* GIAO DIỆN KHI XẢY RA LỖI (CHỈ HÀM KHI ĐÃ ĐĂNG NHẬP) */}
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                  <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
                  <button 
                    onClick={() => fetchAiRecommendations(selectedCv.type, selectedCv.id)} 
                    className="mt-2 text-xs font-bold text-red-700 underline hover:text-red-800 cursor-pointer"
                  >
                    Thử tải lại dữ liệu
                  </button>
                </div>
              )}

              {/* GIAO DIỆN LOADING SKELETON */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3 shadow-xs animate-pulse">
                      <div className="h-4 bg-slate-200 rounded-sm w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded-sm w-1/2"></div>
                      <div className="h-16 bg-slate-50 rounded-xl w-full"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* KHI KHÔNG CÓ VIỆC LÀM PHÙ HỢP */}
                  {aiRecommendedJobs.length === 0 && !errorMsg && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400 font-medium">Không tìm thấy công việc nào phù hợp với bộ kỹ năng trong CV hiện tại.</p>
                    </div>
                  )}

                  {/* HIỂN THỊ KẾT QUẢ DANH SÁCH JOB */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {aiRecommendedJobs.map((job) => (
                      <div key={job.id} className="relative group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/60 shadow-xs hover:border-orange-300/80 hover:shadow-md transition-all duration-200">
                        
                        {/* BADGE AI % MATCH */}
                        <div className="absolute top-3 left-14 z-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[9px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                          <Sparkles size={8} className="fill-white/20" />
                          <span>{job.matchScore}% Match</span>
                        </div>

                        {/* Component Thẻ Job gốc */}
                        <div className="w-full">
                          <Job job={job} />
                        </div>
                        
                        {/* LÝ DO ĐỀ XUẤT DO AI TRẢ VỀ */}
                        <div className="mx-4 mb-4 mt-1 p-2.5 bg-amber-50/40 border border-amber-100/70 rounded-xl flex gap-1.5 items-start">
                          <Lightbulb size={13} className="text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-600 leading-normal font-medium">
                            <strong className="text-amber-700">Lý do:</strong> {job.aiReason}
                          </p>
                        </div>

                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}