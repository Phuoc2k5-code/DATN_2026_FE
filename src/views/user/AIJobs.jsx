import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, BrainCircuit, Target, Lightbulb } from 'lucide-react';
import Job from '../../components/JobCard'; // Component JobCard gốc
import SidebarRight from '../../layouts/layout_user/SidebarRight'; // Sidebar điều hướng

export default function AiJobs() {
  // 💡 DỮ LIỆU GIẢ LẬP DANH SÁCH VIỆC LÀM DO AI PHÂN TÍCH
  const [aiRecommendedJobs] = useState([
    {
      id: "job-ai-01",
      title: "Software Engineer (ReactJS / Node)",
      company: "Google Vietnam",
      location: "Quận 1, TP. HCM",
      salary: "25-35 Tr",
      logoBg: "bg-blue-600",
      tags: ["React", "NodeJS", "TypeScript"],
      matchScore: 98,
      aiReason: "Kỹ năng ReactJS & NodeJS trong hồ sơ của bạn trùng khớp hoàn toàn với yêu cầu hệ thống lõi của dự án này."
    },
    {
      id: "job-ai-02",
      title: "Frontend Developer (Tailwind & Next.js)",
      company: "FPT Software",
      location: "Quận 9, TP. HCM",
      salary: "20-30 Tr",
      logoBg: "bg-orange-600",
      tags: ["React", "Tailwind"],
      matchScore: 94,
      aiReason: "Kinh nghiệm làm giao diện Responsive bằng Tailwind CSS của bạn đạt điểm tối đa trên hệ thống quét."
    },
    {
      id: "job-ai-03",
      title: "UI/UX Designer (Product Team)",
      company: "VNG Group",
      location: "Quận 7, TP. HCM",
      salary: "15-22 Tr",
      logoBg: "bg-cyan-600",
      tags: ["Figma", "UI/UX"],
      matchScore: 89,
      aiReason: "Bạn có các sản phẩm thiết kế Figma trong danh mục Portfolio tương thích với định hướng sản phẩm giải trí."
    },
    {
      id: "job-ai-04",
      title: "Data Analyst (AI Optimization)",
      company: "Techcombank",
      location: "Quận 1, TP. HCM",
      salary: "22-32 Tr",
      logoBg: "bg-red-600",
      tags: ["Python", "SQL", "PowerBI"],
      matchScore: 85,
      aiReason: "Lịch sử tìm kiếm việc làm liên quan đến dữ liệu của bạn khớp 85% với mô tả công việc tối ưu hệ thống."
    }
  ]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full text-left relative">
      
      {/* 🏙️ BANNER CÔNG NGHỆ CHUYÊN BIỆT CHO TRANG AI - PHONG CÁCH NỀN SÁNG CAO CẤP */}
      <div className="w-full bg-gradient-to-br from-orange-100/80 via-amber-50/50 to-white text-slate-800 pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-orange-100/70 shadow-xs relative">
        <div className="max-w-[1550px] mx-auto">
          {/* Nút quay lại trang chủ */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors mb-5 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Quay về trang chủ việc làm
          </Link>

          {/* Tiêu đề trang công nghệ */}
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 animate-pulse">
              <BrainCircuit size={28} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Trung tâm Đề xuất Việc làm AI
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1 max-w-3xl">
                Thuật toán thông minh tự động phân tích CV và lịch sử tương tác để kết nối bạn với nhà tuyển dụng phù hợp nhất.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 📦 BỐ CỤC CHÍNH ĐÃ GIẢI PHÓNG DIỆN TÍCH */}
      <main className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 pr-20 sm:pr-24">
        <div className="w-full space-y-5">
          
          {/* Tiêu đề kết quả */}
          <div className="flex items-center justify-between border-b border-orange-100/50 pb-2.5">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
              <Target size={15} className="text-orange-600" /> Kết quả phân tích ({aiRecommendedJobs.length} việc làm tương thích)
            </h3>
            <span className="text-[11px] bg-orange-50 text-orange-600 font-bold px-2 py-0.5 rounded-full border border-orange-100">
              Độ chính xác cao
            </span>
          </div>

          {/* 💡 LƯỚI ĐỒN JOB: Tối ưu 4 cột tinh tế */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3">
            {aiRecommendedJobs.map((job) => (
              <div key={job.id} className="relative group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/60 shadow-xs hover:border-orange-300/80 hover:shadow-md transition-all duration-200">
                
                {/* 🎯 BADGE AI % MATCH: Đồng bộ sang tone Hổ phách/Cam sang trọng */}
                <div className="absolute top-3 left-14 z-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[9px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                  <Sparkles size={8} className="fill-white/20" />
                  <span>{job.matchScore}% Match</span>
                </div>

                {/* Thẻ Card gốc */}
                <div className="w-full">
                  <Job job={job} />
                </div>
                
                {/* 💡 LÝ DO AI ĐỀ XUẤT: Bo gọn gàng với tone Amber sang trọng */}
                <div className="mx-4 mb-4 mt-1 p-2.5 bg-amber-50/40 border border-amber-100/70 rounded-xl flex gap-1.5 items-start">
                  <Lightbulb size={13} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-600 leading-normal font-medium">
                    <strong className="text-amber-700">Lý do:</strong> {job.aiReason}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}