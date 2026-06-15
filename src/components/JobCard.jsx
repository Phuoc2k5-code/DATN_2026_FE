import React, { useState, useRef, useEffect } from "react";
import { MapPin, Target, Bookmark, MoreVertical, AlertTriangle, Banknote } from "lucide-react";
import { useNavigate } from 'react-router-dom'; 
import ReportModal from './ReportModal'; 
import { toggleSaveJob } from "../utils/api";

export default function JobCard({ job, onRemoveSuccess }) {
  const navigate = useNavigate(); 
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  
  // 🎯 SỬA TẠI ĐÂY: Đồng bộ trạng thái lưu từ thuộc tính 'is_saved' của Laravel API gửi sang
  const [isSaved, setIsSaved] = useState(job.is_saved || false);
  
  const [isOpenReport, setIsOpenReport] = useState(false);

  // Theo dõi nếu prop dữ liệu `job` thay đổi từ phía cha thì cập nhật lại State cho đồng bộ
  useEffect(() => {
    setIsSaved(!!job.is_saved);
  }, [job.id, job.is_saved]);

  // Tự động đóng menu 3 chấm khi click ra ngoài vùng menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Điều hướng chính: Khi click vào bất kỳ vùng trống nào trên Card
  const handleCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  // Điều hướng riêng: Khi click vào tên công ty
  const handleCompanyClick = (e) => {
    e.stopPropagation(); 
    navigate(`/companies/${job.company?.id}`);
  };

  // 🎯 SỬA TẠI ĐÂY: Hàm xử lý lưu tin tuyển dụng async/await chuẩn chỉnh bảo mật
  const handleSaveJob = async (e) => {
    e.stopPropagation(); // Ngăn chặn hành vi lan truyền sự kiện click mở trang chi tiết
    try {
      // 1. Gọi API gửi lên Laravel (Sẽ chạy logic Toggle Thêm/Xóa)
      const response = await toggleSaveJob(job.id);
      
      // 2. Nếu API thành công, tiến hành đảo ngược state hiển thị màu nút trên UI
      setIsSaved(!isSaved); 
      
      if(onRemoveSuccess){
        onRemoveSuccess(job.id);
      }
      // 3. (Tùy chọn) Hiển thị thông báo Toast hoặc Alert cho người dùng biết
      // alert(response.message); 
    } catch (error) {
      console.error("Lỗi lưu bài viết:", error);
      // Nếu Backend trả về mã lỗi 401 (Chưa đăng nhập), báo lỗi ngay để ko bị nhảy màu nút bừa bãi
      alert("Vui lòng đăng nhập để thực hiện tính năng lưu tin!");
    } finally {
      setShowMenu(false); 
    }
  };

  const handleToggleMenu = (e) => {
    e.stopPropagation(); 
    setShowMenu(!showMenu);
  };

  const handleOpenReport = (e) => {
    e.stopPropagation(); 
    setIsOpenReport(true);
    setShowMenu(false);  
  };

  // Hàm định dạng số tiền có dấu chấm phân cách (Ví dụ: 15.000.000)
  const formatNumber = (num) => {
    if (!num) return null;
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  // Hàm xử lý định dạng hiển thị mức lương đồng bộ UI
  const formatSalary = () => {
    if (job.is_negotiable || (!job.salary_min && !job.salary_max)) {
      return "Thỏa thuận";
    }

    if (job.salary_min < 1000) {
      if (job.salary_min && job.salary_max) {
        return `${job.salary_min} - ${job.salary_max} triệu`;
      }
      return job.salary_min ? `Từ ${job.salary_min} triệu` : `Đến ${job.salary_max} triệu`;
    }

    if (job.salary_min && job.salary_max) {
      return `${formatNumber(job.salary_min)} - ${formatNumber(job.salary_max)} VNĐ`;
    }
    return job.salary_min ? `Từ ${formatNumber(job.salary_min)} VNĐ` : `Đến ${formatNumber(job.salary_max)} VNĐ`;
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="block no-underline group hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer text-left"
      >
        {/* CARD CHÍNH */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400/80 transition-all flex flex-col justify-between h-full min-h-[220px] relative overflow-hidden bg-gradient-to-b from-white to-slate-50/30">

          <div className="absolute top-0 left-0 w-0 h-[3px] bg-blue-500 group-hover:w-full transition-all duration-300" />

          {/* 1. CỤM THÔNG TIN TRÊN */}
          <div className="flex flex-col mb-auto">
            
            <div className="flex items-start justify-between gap-2">
              {/* LOGO DOANH NGHIỆP */}
              <div className="w-10 h-10 rounded-xl border border-slate-100 bg-white flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                {job.company?.logo_url ? (
                  <img 
                    src={job.company.logo_url} 
                    alt={job.company?.company_name} 
                    className="w-full h-full object-cover"                    
                  />
                ) : (
                  <div className="w-full h-full bg-blue-600 text-white font-black text-sm flex items-center justify-center uppercase">
                    {job.company?.company_name?.charAt(0) || "J"}
                  </div>
                )}
              </div>

              {/* Vùng bên phải chứa Tag, Nút Lưu tin, nút 3 chấm */}
              <div className="flex items-center gap-1.5">
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-2 py-0.5 text-[9px] font-bold text-blue-600 flex items-center gap-0.5 shadow-sm">
                  <Target size={10} className="text-blue-500 animate-pulse" />
                  Đang tuyển
                </div>

                <button
                  type="button"
                  onClick={handleSaveJob}
                  className={`p-1.5 rounded-lg border transition-all flex items-center justify-center shadow-2xs hover:scale-105 ${isSaved
                    ? 'bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100'
                    : 'bg-slate-50 border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark size={11} fill={isSaved ? "currentColor" : "none"} />
                </button>

                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={handleToggleMenu} 
                    className="w-7 h-7 rounded-lg border border-slate-200/60 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all focus:outline-none"
                  >
                    <MoreVertical size={13} />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200/80 rounded-xl shadow-xl py-1.5 z-40 text-left">
                      <button
                        type="button"
                        onClick={handleSaveJob} 
                        className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Bookmark size={13} className={isSaved ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
                        {isSaved ? "Hủy lưu công việc" : "Lưu tin tuyển dụng"}
                      </button>
                      <div className="h-px bg-slate-100 my-1"></div>
                      <button
                        type="button"
                        onClick={handleOpenReport} 
                        className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <AlertTriangle size={13} className="text-rose-500" />
                        Báo cáo vi phạm
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tiêu đề công việc */}
            <h3 className="font-extrabold text-slate-800 text-[13px] mt-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-[18px] tracking-tight">
              {job.title}
            </h3>
            
            {/* Tên công ty */}
            <p className="text-[12px] font-bold text-slate-400 hover:text-slate-600 transition-colors mt-1 line-clamp-1">
              <span 
                onClick={handleCompanyClick} 
                className="hover:underline cursor-pointer"
              >
                {job.company?.company_name || "Doanh nghiệp ẩn danh"}
              </span>
            </p>

            {/* Vùng thông tin địa điểm & Mức lương */}
            <div className="mt-3 space-y-1.5 text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-slate-400 shrink-0" />
                <span className="line-clamp-1">{job.location}</span>
              </div>
              
              <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100/70 px-2 py-0.5 rounded-md font-bold text-[11px]">
                <Banknote size={12} className="text-emerald-600 shrink-0" />
                {formatSalary()}
              </div>
            </div>

          </div>

          {/* 2. HỆ THỐNG SKILLS */}
          <div className="pt-2.5 mt-3 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
            {job.skills && job.skills.length > 0 ? (
              job.skills.map((skill, idx) => {
                const tagStyles = [
                  'bg-violet-50 text-violet-600 border-violet-100',
                  'bg-amber-50 text-amber-600 border-amber-100',
                  'bg-indigo-50 text-indigo-600 border-indigo-100',
                  'bg-sky-50 text-sky-600 border-sky-100'
                ];
                const currentStyle = tagStyles[idx % tagStyles.length];
                return (
                  <span
                    key={skill.id || idx}
                    onClick={(e) => {
                      e.stopPropagation(); 
                      navigate(`/api/jobs/search-filter?keyword=${skill.name}`); 
                    }}
                    className={`${currentStyle} text-[9px] font-bold px-2 py-0.5 rounded-md border shadow-2xs transition-transform duration-200 hover:scale-105 cursor-pointer`}
                  >
                    {skill.name}
                  </span>
                );
              })
            ) : (
              <span className="text-[9px] text-slate-400 italic">Không yêu cầu kĩ năng</span>
            )}
          </div>

        </div>
      </div>

      <ReportModal
        isOpen={isOpenReport}
        onClose={() => setIsOpenReport(false)}
        targetId={job.id}
        targetName={job.title}
        type="job"
      />
    </>
  );
}