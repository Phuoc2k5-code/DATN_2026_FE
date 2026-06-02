import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Globe, Users, Briefcase, 
  Building2, ShieldCheck, Award, Heart, ExternalLink 
} from 'lucide-react';
import Job from '../../components/JobCard'; // 💡 Import component Job của các em để tái sử dụng

export default function CompanyDetails() {
  const { id } = useParams(); // Lấy ID công ty từ URL sau này (Ví dụ: /companies/google)

  // 💡 DỮ LIỆU GIẢ LẬP CHI TIẾT CÔNG TY (Chuẩn cấu trúc Đồ án)
  const [companyData] = useState({
    name: "Google Vietnam",
    slug: "google",
    logoBg: "bg-blue-600",
    industry: "Công nghệ thông tin / Phần mềm",
    scale: "500 - 1000 nhân viên",
    website: "https://google.com",
    location: "Quận 1, TP. Hồ Chí Minh",
    founded: "1998",
    tagline: "Organize the world's information and make it universally accessible and useful.",
    about: "Google là một tập đoàn công nghệ đa quốc gia của Mỹ, chuyên về các dịch vụ và sản phẩm liên quan đến Internet. Tại Việt Nam, chúng tôi tập trung xây dựng hệ sinh thái công nghệ, hỗ trợ chuyển đổi số và phát triển các giải pháp phần mềm tiên tiến nhất toàn cầu. Đến với Google, bạn sẽ được làm việc trong một môi trường sáng tạo không giới hạn, nơi mọi ý tưởng đột phá đều được tôn trọng và nuôi dưỡng.",
    benefits: [
      { title: "Chăm sóc sức khỏe toàn diện", desc: "Bảo hiểm sức khỏe quốc tế cao cấp cho nhân viên và người thân." },
      { title: "Môi trường làm việc chuẩn quốc tế", desc: "Văn phòng hiện đại, không gian mở, đầy đủ khu ăn uống, giải trí, gym." },
      { title: "Thưởng & Cổ phiếu hấp dẫn", desc: "Thưởng tháng 13++, thưởng hiệu suất định kỳ và cấp cổ phiếu ưu đãi (RSUs)." },
      { title: "Lộ trình thăng tiến rõ ràng", desc: "Tài trợ 100% chi phí học tập các chứng chỉ quốc tế và các khóa đào tạo chuyên sâu." }
    ],
    // Danh sách việc làm đang tuyển của riêng công ty này
    activeJobs: [
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
        id: "job-04",
        title: "Senior Backend Engineer (Go/Java)",
        company: "Google",
        location: "Quận 1, TP. HCM",
        salary: "40-60 Tr",
        logoBg: "bg-blue-600",
        tags: ["Golang", "Java", "Kubernetes"]
      }
    ]
  });

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full">
      
      {/* 🏙️ 1. BANNER & AVATAR CÔNG TY (XANH CÔNG NGHỆ HIỆN ĐẠI) */}
      <div className="w-full bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 shadow-inner relative">
        <div className="max-w-5xl mx-auto">
          {/* Nút quay lại */}
          <Link to={-1} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-6 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Quay lại trang trước
          </Link>

          {/* Khối nhận diện thương hiệu lớn */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
            {/* Logo viết tắt chữ đầu */}
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${companyData.logoBg} text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-2xl border-4 border-white/10 shrink-0`}>
              {companyData.name.charAt(0)}
            </div>
            
            <div className="space-y-1.5 flex-1">
              <h1 className="text-xl sm:text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
                {companyData.name}
                <ShieldCheck size={20} className="text-blue-400 fill-blue-400/10 shrink-0" title="Doanh nghiệp đã xác thực" />
              </h1>
              <p className="text-xs sm:text-sm italic text-slate-300 font-medium max-w-2xl">
                "{companyData.tagline}"
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 pt-2 text-[11px] text-slate-300 font-semibold">
                <span className="flex items-center gap-1"><Globe size={13} className="text-slate-400" /> {companyData.website}</span>
                <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" /> {companyData.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📦 2. KHU VỰC CHI TIẾT 2 CỘT BIỆT LẬP */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full">
          
          {/* CỘT TRÁI (BÊN RỘNG - Chiếm 2/3): NỘI DUNG GIỚI THIỆU & VIỆC LÀM */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Khối 1: Giới thiệu công ty */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Building2 size={15} className="text-blue-600" /> Giới thiệu doanh nghiệp
              </h3>
              <p className="text-xs font-medium text-slate-600 leading-relaxed text-justify whitespace-pre-line">
                {companyData.about}
              </p>
            </div>

            {/* Khối 2: Chế độ phúc lợi đại ngộ */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Heart size={15} className="text-rose-500 fill-rose-500/10" /> Quyền lợi & Phúc lợi hấp dẫn
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {companyData.benefits.map((benefit, idx) => (
                  <div key={idx} className="p-3 border border-slate-100 bg-slate-50/40 rounded-xl space-y-0.5 text-left">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Award size={13} className="text-amber-500 shrink-0" /> {benefit.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-500 leading-relaxed pl-4">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Khối 3: Danh sách việc làm đang mở tuyển */}
            <div className="space-y-3.5">
              <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5 px-1">
                <Briefcase size={15} className="text-blue-600" /> Vị trí đang tuyển dụng ({companyData.activeJobs.length})
              </h3>
              
              {/* Gọi trực tiếp Grid tái sử dụng component Job của các em */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {companyData.activeJobs.map((job) => (
                  <Job key={job.id} job={job} />
                ))}
              </div>
            </div>

          </div>

          {/* CỘT PHẢI (BÊN HẸP - Chiếm 1/3): THÔNG TIN TỔNG QUAN NHANH (SIDEBAR) */}
          <div className="md:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 shrink-0 text-left">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Thông tin tổng quan</h3>
            
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex gap-2.5 items-start">
                <Building2 size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Lĩnh vực hoạt động</div>
                  <div className="text-slate-800 mt-0.5">{companyData.industry}</div>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Users size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Quy mô công ty</div>
                  <div className="text-slate-800 mt-0.5">{companyData.scale}</div>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Briefcase size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Năm thành lập</div>
                  <div className="text-slate-800 mt-0.5">{companyData.founded}</div>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Địa chỉ trụ sở chính</div>
                  <div className="text-slate-800 mt-0.5 leading-relaxed">{companyData.location}</div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2"></div>

            {/* Nút bấm dẫn link ra website thật bên ngoài */}
            <a 
              href={companyData.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs group"
            >
              Ghé thăm Website công ty <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

        </div>
      </main>

    </div>
  );
}