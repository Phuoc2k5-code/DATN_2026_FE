import React, { useState } from 'react';
import {
  MapPin, Briefcase, DollarSign, Calendar, Clock,
  UserCheck, Building2, Share2, Bookmark, Send,
  CheckCircle, ChevronRight, Sparkles, AlertCircle,
  Link
} from 'lucide-react';

import { Link as RouterLink } from 'react-router-dom'; // 💡 Đổi tên Link để tránh trùng với Link của lucide-react

export default function JobDetail() {
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Dữ liệu giả lập cho một tin tuyển dụng chi tiết
  const jobData = {
    title: 'Senior Frontend Developer (ReactJS / Tailwind)',
    company: 'FPT Software',
    companyId: 'fpt-software',
    logoBg: 'bg-orange-600',
    location: 'Quận 9, TP. Hồ Chí Minh',
    salary: '22 - 35 Triệu',
    experience: '3 - 5 năm kinh nghiệm',
    level: 'Senior',
    type: 'Toàn thời gian',
    postedDate: '2 ngày trước',
    deadline: '30/06/2026',
    industry: 'Công nghệ thông tin / Phần mềm',
    skills: ['ReactJS', 'Tailwind CSS', 'TypeScript', 'Next.js', 'RESTful API'],
    description: [
      'Phát triển và tối ưu hóa các tính năng giao diện người dùng (Frontend) cho hệ thống Web Application quy mô lớn.',
      'Phối hợp chặt chẽ với đội ngũ UI/UX Designer để chuyển đổi các bản thiết kế Figma thành mã nguồn chạy ổn định, mượt mà.',
      'Tối ưu hóa hiệu năng tải trang (Performance), đảm bảo tính tương thích tốt trên nhiều trình duyệt và thiết bị di động.',
      'Nghiên cứu và áp dụng các công nghệ mới để cải tiến quy trình phát triển sản phẩm.'
    ],
    requirements: [
      'Có tối thiểu 3 năm kinh nghiệm lập trình chuyên sâu với ReactJS.',
      'Thành thạo cấu trúc CSS Frameworks đặc biệt là Tailwind CSS hoặc Styled Components.',
      'Có tư duy tốt về Component Lifecycle, State Management (Redux Toolkit, Context API).',
      'Đã từng có kinh nghiệm làm việc với Next.js và TypeScript là một lợi thế lớn.',
      'Kỹ năng làm việc nhóm tốt, có khả năng đọc hiểu tài liệu kỹ thuật bằng tiếng Anh.'
    ],
    benefits: [
      'Mức lương cạnh tranh theo năng lực (xét tăng lương 2 lần/năm).',
      'Thưởng tháng lương thứ 13 + thưởng hiệu quả công việc cuối năm theo doanh thu dự án.',
      'Gói bảo hiểm sức khỏe FPT Care dành riêng cho nhân viên và người thân.',
      'Môi trường làm việc trẻ trung, năng động, có lộ trình thăng tiến rõ ràng lên Tech Lead / Software Architect.',
      'Được tham gia các khóa đào tạo công nghệ, chứng chỉ quốc tế miễn phí do công ty tài trợ.'
    ],
    companyInfo: {
      scale: '15,000+ nhân viên',
      address: 'Tòa nhà F-Town, Lô T2, Đường D1, Khu Công Nghệ Cao, Quận 9, TP. HCM',
      about: 'FPT Software là công ty thành viên của Tập đoàn FPT, nhà cung cấp dịch vụ công nghệ và chuyển đổi số hàng đầu khu vực, đối tác chiến lược của nhiều tập đoàn lớn trên toàn cầu.'
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full overflow-x-hidden">
      {/* 2. BLOCK HEADER CÔNG VIỆC (NỀN TRẮNG TRÀN NGANG, ĐỔ BÓNG NHẸ) */}
      <div className="w-full bg-white border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${jobData.logoBg} text-white font-black text-xl flex items-center justify-center shadow-md shrink-0`}>
              {jobData.company.charAt(0)}
            </div>
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {jobData.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                <span className="text-blue-600 font-bold text-sm hover:underline cursor-pointer">{jobData.company}</span>
                <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" /> {jobData.location}</span>
                <span className="flex items-center gap-1"><Clock size={13} className="text-slate-400" /> {jobData.postedDate}</span>
              </div>
            </div>
          </div>

          {/* Các nút tương tác nhanh */}
          <div className="flex items-center gap-2.5 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 shrink-0">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`flex-1 md:flex-none justify-center px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Bookmark size={14} className={isSaved ? 'fill-amber-500' : ''} />
              {isSaved ? 'Đã lưu việc' : 'Lưu tin'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. VÙNG NỘI DUNG CHÍNH (CHIA BIỆT LẬP 2 CỘT NẰM TRONG KHUNG GOM GIỮA MAX-W-7XL) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">

          {/* CỘT TRÁI (70%) - THÔNG TIN CHI TIẾT JD */}
          <div className="lg:col-span-2 space-y-5">

            {/* Box nội dung JD */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">

              {/* Mục Mô tả */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-l-4 border-blue-600 pl-2.5 mb-3">
                  Mô tả công việc
                </h3>
                <ul className="space-y-2">
                  {jobData.description.map((item, idx) => (
                    <li key={idx} className="text-xs sm:text-[13px] text-slate-600 leading-relaxed flex items-start gap-2">
                      <span className="text-blue-500 mt-1 shrink-0">▪</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mục Yêu cầu */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-l-4 border-blue-600 pl-2.5 mb-3">
                  Yêu cầu ứng viên
                </h3>
                <ul className="space-y-2">
                  {jobData.requirements.map((item, idx) => (
                    <li key={idx} className="text-xs sm:text-[13px] text-slate-600 leading-relaxed flex items-start gap-2">
                      <span className="text-blue-500 mt-1 shrink-0">▪</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mục Quyền lợi */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-l-4 border-blue-600 pl-2.5 mb-3">
                  Quyền lợi được hưởng
                </h3>
                <ul className="space-y-2">
                  {jobData.benefits.map((item, idx) => (
                    <li key={idx} className="text-xs sm:text-[13px] text-slate-600 leading-relaxed flex items-start gap-2">
                      <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* HỆ THỐNG TAGS PHỤC VỤ AI MATCHING SCORE */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2.5">
                  Từ khóa liên quan kĩ năng
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {jobData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50/70 text-blue-600 border border-blue-100 text-[10.5px] font-bold px-2.5 py-1 rounded-lg shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Lưu ý nhỏ tránh lừa đảo */}
            <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-xl flex items-start gap-2.5">
              <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                <strong>Khuyến cáo:</strong> VieclamPro không thu bất kỳ khoản phí nào của ứng viên khi nộp hồ sơ. Nếu nhận được yêu cầu đóng tiền cọc hoặc làm nhiệm vụ nạp tiền, vui lòng báo cáo ngay cho ban quản trị hệ thống.
              </p>
            </div>
          </div>

          {/* CỘT PHẢI (30%) - THÔNG TIN TỔNG QUAN & ACTION BUTTON */}
          <div className="space-y-5">

            {/* BOX 1: THÔNG TIN CHUNG & NÚT APPLY */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">

              {/* Nút Ứng tuyển lớn độc chiếm đầu bảng */}
              <button
                onClick={() => setHasApplied(true)}
                disabled={hasApplied}
                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${hasApplied
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                  }`}
              >
                {hasApplied ? (
                  <>Đã nộp hồ sơ thành công</>
                ) : (
                  <>Ứng tuyển ngay <Send size={13} className="animate-bounce" /></>
                )}
              </button>

              <div className="h-px bg-slate-100 my-1"></div>

              {/* Thông số kỹ thuật của tin tuyển dụng */}
              <div className="space-y-3.5 text-xs font-semibold text-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 font-medium"><DollarSign size={14} /> Mức lương</div>
                  <div className="text-emerald-600 font-black">{jobData.salary}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 font-medium"><Briefcase size={14} /> Ngành nghề</div>
                  <div className="text-slate-700 text-[11px] truncate max-w-[150px]" title={jobData.industry}>{jobData.industry}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 font-medium"><UserCheck size={14} /> Cấp bậc</div>
                  <div className="text-slate-700">{jobData.level}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 font-medium"><Clock size={14} /> Hình thức</div>
                  <div className="text-slate-700">{jobData.type}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 font-medium"><Calendar size={14} /> Hạn nộp hồ sơ</div>
                  <div className="text-rose-600 font-bold">{jobData.deadline}</div>
                </div>
              </div>
            </div>

            {/* BOX 2: THÔNG TIN DOANH NGHIỆP */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Building2 size={14} className="text-blue-600" />
                <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-700">Thông tin công ty</h3>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">{jobData.company}</h4>
                <p className="text-[10px] text-slate-400 font-medium">Quy mô: {jobData.companyInfo.scale}</p>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed text-justify">
                {jobData.companyInfo.about}
              </p>

              <div className="pt-2 border-t border-slate-50 text-[10.5px] text-slate-400 font-medium space-y-1">
                <span className="block font-bold text-slate-500 uppercase text-[8.5px]">Địa điểm làm việc</span>
                <p className="leading-tight text-slate-500">{jobData.companyInfo.address}</p>
              </div>
              
              <RouterLink to={`/companies/${jobData.companyId}`} className="w-full mt-2 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10.5px] font-bold rounded-lg flex items-center justify-center gap-0.5 transition-colors">
                Xem trang công ty <ChevronRight size={12} />
              </RouterLink>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}