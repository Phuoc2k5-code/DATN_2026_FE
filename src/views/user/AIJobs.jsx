import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, BrainCircuit, Target, Lightbulb, Loader2, FileText, UserCheck, LogIn, Lock } from 'lucide-react';
import axios from 'axios';
import Job from '../../components/JobCard';

export default function AiJobs() {
  const navigate = useNavigate();

  const [userCvList, setUserCvList] = useState([]);
  const [aiRecommendedJobs, setAiRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // 🌟 KHỞI TẠO STATE BAN ĐẦU: Lấy lại vết từ localStorage nếu có, nếu không thì để trống (chạy Tự động)
  const [selectedCv, setSelectedCv] = useState(() => {
    const savedType = localStorage.getItem('last_ai_cv_type');
    const savedId = localStorage.getItem('last_ai_cv_id');
    return {
      type: savedType || '',
      id: savedId || ''
    };
  });

  const abortControllerRef = useRef(null);
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Lấy danh sách CV làm nguồn chọn cho Dropdown
  const fetchUserCvList = async () => {
    if (!isLoggedIn) return;
    try {
      const response = await axios.get('http://localhost:8000/api/user-cv-list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        setUserCvList(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi danh sách CV:", error);
    }
  };

  // Hàm gọi API tính điểm AI thông minh
  const fetchAiRecommendations = async (type = '', id = '') => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

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
        },
        signal: abortControllerRef.current.signal
      });

      if (response.data && response.data.success) {
        // 🌟 BƯỚC FIX: Giữ nguyên object gốc và bổ sung các trường format tương thích với Component JobCard cũ nếu cần
        const mappedJobs = response.data.data.map(job => ({
          ...job, // Truyền TOÀN BỘ object gốc sang (gồm id, title, location, salary_min, salary_max, company, skills, category)
          company: {
            ...job.company,
            name: job.company?.company_name || "Nhà tuyển dụng", // Dự phòng nếu JobCard gọi job.company.name
            company_name: job.company?.company_name || "Nhà tuyển dụng" // Dự phòng nếu JobCard gọi job.company.company_name
          },
          location: job.location || "Toàn quốc",
          salary: job.is_negotiable
            ? "Thỏa thuận"
            : `${(job.salary_min / 1000000).toFixed(0)}tr - ${(job.salary_max / 1000000).toFixed(0)}tr`, // Format lương triệu đồng cho đẹp giao diện
          logoBg: job.logo_bg || "bg-orange-600",
          tags: job.skills ? job.skills.map(s => s.name) : [],
          matchScore: Math.round(job.matching_score || 0),
          aiReason: job.ai_reason || "Phù hợp với định hướng nghề nghiệp."
        }));

        setAiRecommendedJobs(mappedJobs);

        // 🌟 BƯỚC QUAN TRỌNG: Lấy dữ liệu thực tế Backend vừa chạy gán ngược lại cho FE
        const realType = response.data.analyzed_type;
        const realId = response.data.analyzed_id;

        if (realType && realId) {
          // Ghi nhớ vào State để Dropdown sáng đúng vị trí
          setSelectedCv({ type: realType, id: String(realId) });
          // Ghi nhớ vào localStorage máy người dùng để tắt máy bật lại vẫn còn
          localStorage.setItem('last_ai_cv_type', realType);
          localStorage.setItem('last_ai_cv_id', String(realId));
        }

        setLoading(false);
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error("Lỗi AI gợi ý:", error);
      setErrorMsg(error.response?.data?.message || "Hệ thống AI gặp sự cố. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserCvList();
      // Chạy với dữ liệu đã khôi phục từ localStorage (nếu có) hoặc chạy auto
      fetchAiRecommendations(selectedCv.type, selectedCv.id);
    } else {
      setLoading(false);
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isLoggedIn]);

  // Khi người dùng chủ động chọn đổi CV khác trên giao diện
  const handleCvChange = (e) => {
    const combinedValue = e.target.value; // Giá trị dạng "type_id"
    if (!combinedValue) return;

    const [type, cvId] = combinedValue.split('_');

    setSelectedCv({ type, id: cvId });
    fetchAiRecommendations(type, cvId); // Gửi thẳng ID mới lên để BE bắt buộc phân tích cái mới
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 antialiased pb-16 w-full text-left">
      <div className="w-full bg-gradient-to-br from-orange-100/80 via-amber-50/50 to-white pt-8 pb-12 px-4 border-b border-orange-100/70 shadow-xs">
        <div className="max-w-[1550px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md">
              <BrainCircuit size={28} className={loading ? "animate-spin" : ""} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Trung tâm Đề xuất Việc làm AI
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Thuật toán bảo lưu trạng thái thông minh qua cơ chế Đồng bộ Định danh từ Client-side.
              </p>
            </div>
          </div>

          {/* BỘ LỌC CHỌN NGUỒN CV */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs max-w-xs w-full">
            <FileText size={16} className="text-orange-500 shrink-0" />
            <div className="w-full">
              <label className="block text-[9px] uppercase font-bold text-slate-400">Nguồn phân tích</label>
              <select
                // 🌟 ĐỒNG BỘ VALUE ĐỂ DROP DOWN LUÔN SÁNG ĐÚNG CV ĐANG XEM
                value={selectedCv.type && selectedCv.id ? `${selectedCv.type}_${selectedCv.id}` : ''}
                onChange={handleCvChange}
                disabled={loading || !isLoggedIn}
                className="w-full text-xs font-semibold text-slate-700 bg-transparent border-none outline-hidden p-0 cursor-pointer"
              >
                {!isLoggedIn ? (
                  <option value="">Chưa kết nối tài khoản</option>
                ) : userCvList.length === 0 ? (
                  <option value="">✨ Đang xác định hồ sơ phù hợp...</option>
                ) : (
                  userCvList.map((cv) => (
                    // value kết hợp "type_cvId" để dễ cắt chuỗi xử lý
                    <option key={cv.id} value={`${cv.type}_${cv.cvId}`}>{cv.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* HIỂN THỊ KẾT QUẢ TIN TUYỂN DỤNG */}
      <main className="max-w-[1550px] mx-auto px-4 mt-8">
        <div className="w-full space-y-5">
          <div className="flex items-center justify-between border-b border-orange-100/50 pb-2.5">
            <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-1.5">
              <Target size={15} className="text-orange-600" /> Kết quả phân tích
            </h3>
            {loading && (
              <span className="flex items-center gap-1 text-[11px] text-orange-600 font-bold px-2 py-0.5 rounded-full bg-orange-50 animate-pulse">
                <Loader2 size={12} className="animate-spin" /> Đang tính toán điểm so khớp bằng AI...
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center text-xs text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded-sm w-3/4"></div>
                  <div className="h-16 bg-slate-50 rounded-xl w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {aiRecommendedJobs.map((job) => (
                <div key={job.id} className="relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/60 shadow-xs hover:border-orange-300 transition-all duration-200">
                  <div className="absolute top-3 left-14 z-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[9px] px-2 py-0.5 rounded-md">
                    <Sparkles size={8} /> <span>{job.matchScore}% Match</span>
                  </div>
                  <div className="w-full"><Job job={job} /></div>
                  <div className="mx-4 mb-4 mt-1 p-2.5 bg-amber-50/40 border border-amber-100/70 rounded-xl flex gap-1.5 items-start">
                    <Lightbulb size={13} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-600 leading-normal font-medium">
                      <strong className="text-amber-700">Lý do:</strong> {job.aiReason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}