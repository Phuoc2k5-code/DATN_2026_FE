import React, { useState } from 'react';
import { Bookmark, ArrowLeft, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import Job from '../../components/JobCard'; 

export default function SavedJobs() {
  // 💡 DỮ LIỆU GIẢ LẬP DANH SÁCH TIN ĐÃ LƯU (Cấu trúc chuẩn khớp hoàn toàn với component Job)
  const [savedJobs, setSavedJobs] = useState([
    {
      id: "job-01",
      title: "Software Engineer",
      company: "Google",
      location: "Quận 1, TP. HCM",
      salary: "25-35 Tr",
      logoBg: "bg-blue-600",
      tags: ["React", "NodeJS"]
    },
    {
      id: "job-02",
      title: "Frontend Developer (ReactJS)",
      company: "FPT Software",
      location: "Thủ Đức, TP. HCM",
      salary: "15-22 Tr",
      logoBg: "bg-orange-600",
      tags: ["React", "Tailwind", "Git"]
    },
    {
      id: "job-03",
      title: "UI/UX Designer",
      company: "VNG Corporation",
      location: "Quận 7, TP. HCM",
      salary: "Thỏa thuận",
      logoBg: "bg-cyan-600",
      tags: ["Figma", "Design System"]
    }
  ]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full">
      
      {/* 🚀 HEADER TRANG RIÊNG BIỆT (XANH CÔNG NGHỆ SANG TRỌNG) */}
      <div className="w-full bg-gradient-to-r from-slate-900 to-blue-900 text-white px-4 sm:px-6 lg:px-8 py-10 shadow-md">
        <div className="max-w-6xl mx-auto">
          {/* Nút quay lại trang chủ / trang trước nhanh */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors mb-4 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Quay lại trang chủ
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 border border-white/10 rounded-xl backdrop-blur-xs">
              <Bookmark size={22} className="text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                Việc làm đã lưu
              </h1>
              <p className="text-xs font-medium text-slate-300/90 mt-0.5">
                Bạn đang lưu <span className="text-amber-400 font-bold">{savedJobs.length}</span> cơ hội nghề nghiệp tiềm năng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 📦 KHU VỰC HIỂN THỊ DANH SÁCH VIỆC LÀM */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Kiểm tra nếu người dùng chưa lưu tin nào */}
        {savedJobs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs max-w-xl mx-auto">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
              <Bookmark size={24} className="text-amber-400" />
            </div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Danh sách trống</h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              Bạn chưa lưu tin tuyển dụng nào. Hãy lướt xem các tin tuyển dụng hot và bấm lưu lại nhé!
            </p>
            <Link 
              to="/jobs" 
              className="mt-5 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all"
            >
              <Briefcase size={13} /> Khám phá việc làm ngay
            </Link>
          </div>
        ) : (
          // 💡 SỬ DỤNG GRID ĐỂ TÁI SỬ DỤNG COMPONENT <JOB /> CỰC ĐẸP
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {savedJobs.map((job) => (
              <Job key={job.id} job={job} />
            ))}
          </div>
        )}
      </main>

    </div>
  );
}