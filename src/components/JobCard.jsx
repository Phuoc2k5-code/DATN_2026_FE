import React, { useState, useRef, useEffect } from "react";
import { DollarSign, MapPin, Target, Bookmark, MoreVertical, AlertTriangle } from "lucide-react";
import { Link } from 'react-router-dom';
import ReportModal from './ReportModal'; // 💡 Đảm bảo các em đã import đúng component dùng chung

export default function Job({ job }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isOpenReport, setIsOpenReport] = useState(false);

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

  // 💡 XỬ LÝ CLICK LƯU TIN (CHỐNG TRÀN VÀ NỔI BỌT)
  const handleSaveJob = (e) => {
    e.preventDefault();  // Chặn thẻ <Link> chuyển trang
    e.stopPropagation();  // 🚀 CHỐNG NỔI BỌT: Không cho lan truyền sự kiện lên thẻ <Link> cha
    setIsSaved(!isSaved);

    if (!isSaved) {
      console.log(`Đã lưu công việc ID: ${job.id}`);
    } else {
      console.log(`Đã hủy lưu công việc ID: ${job.id}`);
    }
    setShowMenu(false); // Đóng menu sau khi thao tác
  };

  // 💡 XỬ LÝ BẤM NÚT 3 CHẤM (CHỐNG CHUYỂN TRANG)
  const handleToggleMenu = (e) => {
    e.preventDefault();  // Chặn chuyển trang
    e.stopPropagation();  // 🚀 CHỐNG NỔI BỌT: Giữ sự kiện click chỉ nằm tại nút 3 chấm này
    setShowMenu(!showMenu);
  };

  // 💡 XỬ LÝ BẤM NÚT BÁO CÁO VI PHẠM
  const handleOpenReport = (e) => {
    e.preventDefault();  // Chặn chuyển trang
    e.stopPropagation();  // 🚀 CHỐNG NỔI BỌT: Không cho click ăn vào thẻ Link cha
    setIsOpenReport(true);
    setShowMenu(false);  // Đóng menu 3 chấm lại
  };

  return (
    <>
      <Link
        to={`/jobs/${job.id}`}
        className="block no-underline group hover:-translate-y-1 transition-all duration-300"
      >
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400/80 transition-all flex flex-col justify-between min-h-[175px] relative overflow-hidden bg-gradient-to-b from-white to-slate-50/30">

          {/* Dải màu nhỏ ở góc khi hover */}
          <div className="absolute top-0 left-0 w-0 h-[3px] bg-blue-500 group-hover:w-full transition-all duration-300" />

          <div>
            {/* Hàng đầu tiên: Logo & Cụm Tag Trạng thái + Nút Lưu tin */}
            <div className="flex items-start justify-between gap-2">
              <div className={`w-8 h-8 rounded-xl ${job.logoBg || 'bg-blue-600'} text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/10 shrink-0`}>
                {job.company.charAt(0)}
              </div>

              {/* Vùng bên phải chứa Tag và Nút Lưu tin, nút 3 chấm nằm ngang hàng */}
              <div className="flex items-center gap-1.5">
                {/* TAG TARGET STATUS */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-2 py-0.5 text-[9px] font-bold text-blue-600 flex items-center gap-0.5 shadow-sm">
                  <Target size={10} className="text-blue-500 animate-pulse" />
                  Đang tuyển
                </div>

                {/* NÚT LƯU TIN NHANH */}
                <button
                  type="button"
                  onClick={handleSaveJob}
                  title={isSaved ? "Hủy lưu tin" : "Lưu tin tuyển dụng"}
                  className={`p-1.5 rounded-lg border transition-all flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 ${isSaved
                    ? 'bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100'
                    : 'bg-slate-50 border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark
                    size={11}
                    fill={isSaved ? "currentColor" : "none"}
                  />
                </button>

                {/* KHỐI NÚT 3 CHẤM TÙY CHỌN */}
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={handleToggleMenu} // 💡 Gọi hàm đã bọc e.stopPropagation
                    className="w-7 h-7 rounded-lg border border-slate-200/60 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all focus:outline-none"
                  >
                    <MoreVertical size={13} />
                  </button>

                  {/* DROPDOWN MENU CON */}
                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200/80 rounded-xl shadow-xl py-1.5 z-40 text-left animate-in fade-in slide-in-from-top-1">
                      <button
                        type="button"
                        onClick={handleSaveJob} // 💡 Đã bọc chống nổi bọt
                        className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        <Bookmark size={13} className={isSaved ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
                        {isSaved ? "Hủy lưu công việc" : "Lưu tin tuyển dụng"}
                      </button>
                      
                      <div className="h-px bg-slate-100 my-1"></div>
                      
                      <button
                        type="button"
                        onClick={handleOpenReport} // 💡 Đã bọc hàm xử lý riêng chống nổi bọt
                        className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                      >
                        <AlertTriangle size={13} className="text-rose-500" />
                        Báo cáo vi phạm
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Tiêu đề công việc & Tên công ty */}
            <h3 className="font-extrabold text-slate-800 text-[13px] mt-3 group-hover:text-blue-600 transition-colors line-clamp-1 tracking-tight">
              {job.title}
            </h3>
            
            {/* Tên công ty (Khi bấm vào tên công ty chuyển hướng sang /companies/:id) */}
            <p className="text-[12px] font-bold text-slate-500 hover:text-slate-700 transition-colors mt-0.5">
              <span 
                onClick={(e) => e.stopPropagation()} // 💡 Giúp thẻ con <Link> bên trong hoạt động đúng, không kích hoạt thẻ <Link> cha ngoài cùng
              >
                <Link to={`/companies/${job.companyId}`} className="hover:underline">
                  {job.company}
                </Link>
              </span>
            </p>

            {/* Vùng thông tin địa điểm & Mức lương */}
            <div className="mt-2.5 space-y-1 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-slate-400 shrink-0" />
                <span className="line-clamp-1 text-slate-500">{job.location}</span>
              </div>
              <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50/80 border border-emerald-100 px-1.5 py-0.5 rounded-md font-bold text-[10.5px]">
                <DollarSign size={11} className="text-emerald-600 shrink-0" />
                {job.salary}
              </div>
            </div>
          </div>

          {/* HỆ THỐNG TAGS KĨ NĂNG */}
          <div className="mt-3.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
            {job.tags.map((tag, idx) => {
              const tagStyles = [
                'bg-violet-50 text-violet-600 border-violet-100',
                'bg-amber-50 text-amber-600 border-amber-100',
                'bg-indigo-50 text-indigo-600 border-indigo-100',
                'bg-sky-50 text-sky-600 border-sky-100'
              ];
              const currentStyle = tagStyles[idx % tagStyles.length];
              return (
                <span
                  key={idx}
                  className={`${currentStyle} text-[9px] font-bold px-2 py-0.5 rounded-md border shadow-2xs transition-transform group-hover:scale-105`}
                >
                  {tag}
                </span>
              );
            })}
          </div>

        </div>
      </Link>

      {/* 🔮 ĐẶT MODAL Ở NGOÀI THẺ LINK: Giải pháp tối ưu nhất để Modal không dính các event điều hướng của Link cha */}
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