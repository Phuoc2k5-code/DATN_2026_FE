import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Globe, Users, Briefcase, 
  Building2, ShieldCheck, Award, Heart, ExternalLink,
  AlertTriangle 
} from 'lucide-react';
import Job from '../../components/JobCard'; // Component JobCard của dự án
import ReportModal from '../../components/ReportModal'; // Component ReportModal dùng chung

export default function CompanyDetails() {
  const { id } = useParams(); // Lấy ID hoặc Slug công ty từ URL (Ví dụ: /companies/google)

  // 💡 QUAN TRỌNG: Quản lý trạng thái đóng/mở Modal báo cáo doanh nghiệp
  const [isOpenReport, setIsOpenReport] = useState(false);

  // 💡 DỮ LIỆU GIẢ LẬP CHI TIẾT CÔNG TY (Đầy đủ cấu trúc để hiển thị giao diện)
  const [companyData] = useState({
    id: "com-google-2026", // ID dùng để truyền vào hệ thống báo cáo vi phạm
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

  // 💡 HÀM XỬ LÝ MỞ MODAL BÁO CÁO (Chống nổi bọt và chặn chuyển hướng mặc định)
  const handleOpenReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpenReport(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full">
      
      {/* 🏙️ 1. BANNER & AVATAR CÔNG TY (XANH CÔNG NGHỆ HIỆN ĐẠI + NÚT BÁO CÁO ĐỐI TRỌNG GÓC PHẢI) */}
      <div className="w-full bg-gradient-to-br from-orange-100/60 via-amber-50/40 to-white text-slate-800 pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-orange-100/70 shadow-sm relative">
  <div className="max-w-6xl mx-auto">
    
    {/* Nút quay lại - Đổi hover sang màu cam chủ đạo và font font-semibold đồng bộ hệ thống */}
    <Link to={-1} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors mb-6 group w-fit">
      <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
      Quay lại trang trước
    </Link>

    {/* Khối nhận diện thương hiệu lớn */}
    <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left">
      
      {/* Vùng bên trái: Thông tin thương hiệu */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-5 w-full md:w-auto">
        
        {/* Logo viết tắt chữ đầu - Chuyển sang viền cam nhạt, đổ bóng mềm mại */}
        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${companyData.logoBg} text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-md border-4 border-orange-100/50 shrink-0`}>
          {companyData.name.charAt(0)}
        </div>
        
        <div className="space-y-2 flex-1 w-full">
          {/* Tên công ty chuyển sang Gradient Cam - Hổ phách cao cấp */}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {companyData.name}
            {/* Icon xác thực chuyển sang tông xanh ngọc/emerald dịu mắt, hợp trên nền sáng */}
            <ShieldCheck size={18} className="text-emerald-500 fill-emerald-50" title="Doanh nghiệp đã xác thực" />
          </h1>
          
          {/* Câu tagline đổi sang text-slate-500 để tăng độ tương phản trên nền sáng */}
          <p className="text-xs sm:text-sm italic text-slate-500 font-medium max-w-2xl mx-auto md:mx-0">
            "{companyData.tagline}"
          </p>
          
          {/* Khối thông tin liên hệ: Website, Địa điểm */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 pt-1 text-[11px] text-slate-600 font-semibold">
            <span className="flex items-center gap-1 hover:text-orange-600 transition-colors cursor-pointer">
              <Globe size={13} className="text-slate-400" /> {companyData.website}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-slate-400" /> {companyData.location}
            </span>
          </div>
        </div>
      </div>

      {/* Vùng bên phải: Nút Báo cáo doanh nghiệp - Thiết kế lại tinh tế, không bị quá chói nhưng vẫn nổi bật khi hover */}
      <div className="w-full md:w-auto pt-2 md:pt-0 shrink-0">
        <button
          type="button"
          onClick={handleOpenReport}
          className="w-full md:w-auto justify-center px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
        >
          <AlertTriangle size={13} className="text-slate-400 group-hover:text-rose-500" />
          <span>Báo cáo doanh nghiệp</span>
        </button>
      </div>

    </div>
  </div>
</div>

      {/* 📦 2. KHU VỰC CHI TIẾT CHIA BIỆT LẬP 2 CỘT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full">
          
          {/* CỘT TRÁI (BÊN RỘNG - Chiếm 2/3): NỘI DUNG GIỚI THIỆU & DANH SÁCH VIỆC LÀM */}
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
              
              {/* Vùng Render Grid việc làm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {companyData.activeJobs.map((job) => (
                  <Job key={job.id} job={job} />
                ))}
              </div>
            </div>

          </div>

          {/* CỘT PHẢI (BÊN HẸP - Chiếm 1/3): THÔNG TIN TỔNG QUAN SIDEBAR */}
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

            {/* Nút bấm điều hướng Link ngoài */}
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

      {/* 💡 CALL MODAL CHỐNG RELOAD: Đặt tách biệt ở cuối file */}
      {/* Gửi type="company" để phân loại logic lưu trữ/lý do tố cáo doanh nghiệp ma ở phía Backend */}
      <ReportModal
        isOpen={isOpenReport}
        onClose={() => setIsOpenReport(false)}
        type="company"
        targetId={companyData.id || id}
        targetName={companyData.name}
      />

    </div>
  );
}