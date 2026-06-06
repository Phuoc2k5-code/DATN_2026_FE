import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Layout, Palette, ShieldCheck, Download, Eye } from 'lucide-react';

// 1. DỮ LIỆU GIẢ LẬP CÁC MẪU CV (TEMPLATES)
const TEMPLATE_DESIGNS = [
  { id: 1, name: 'Minimalist Clean', desc: 'Thiết kế tối giản, tập trung vào trải nghiệm đọc', tag: 'Phổ biến' },
  { id: 2, name: 'Tech Modern', desc: 'Phong cách hiện đại, phù hợp khối ngành IT/Kỹ thuật', tag: 'Xu hướng' },
  { id: 3, name: 'Creative Elegant', desc: 'Đột phá không gian, thích hợp cho Marketing/Design', tag: 'Sáng tạo' },
];

// 2. BẢNG MÀU CHỦ ĐẠO (THEME COLORS)
const THEME_COLORS = [
  { id: 'slate', name: 'Xám Đậm', hex: '#334155', bgClass: 'bg-slate-700', textClass: 'text-slate-700', borderClass: 'border-slate-700' },
  { id: 'blue', name: 'Xanh Biển', hex: '#1e3a8a', bgClass: 'bg-blue-900', textClass: 'text-blue-900', borderClass: 'border-blue-900' },
  { id: 'emerald', name: 'Xanh Lá', hex: '#065f46', bgClass: 'bg-emerald-800', textClass: 'text-emerald-800', borderClass: 'border-emerald-800' },
  { id: 'orange', name: 'Cam Ấm', hex: '#ea580c', bgClass: 'bg-orange-600', textClass: 'text-orange-600', borderClass: 'border-orange-600' },
];

// 3. DỮ LIỆU PROFILE USER (Sẽ map vào khung Preview)
const MOCK_CV_DATA = {
  name: "NGUYỄN VĂN A",
  title: "Fullstack Software Engineer",
  info: { email: "anv.dev@gmail.com", phone: "0901.234.567", web: "github.com/anv-dev", address: "Quận 7, TP. Hồ Chí Minh" },
  summary: "Hơn 3 năm kinh nghiệm phát triển các hệ thống Web Application định hướng microservices. Đam mê tối ưu hóa hiệu năng ứng dụng, áp dụng AI vào quy trình tự động hóa và có tư duy thiết kế hệ thống chịu tải cao.",
  skills: ["ReactJS / Next.js", "NodeJS (Express / NestJS)", "Tailwind CSS & AntDesign", "Docker & Kubernetes", "MySQL, MongoDB, Redis"],
  experience: [
    { timeline: "2024 - Hiện tại", role: "Senior Fullstack Developer", company: "FPT Software", detail: "Chịu trách nhiệm kiến trúc module chấm điểm CV tự động bằng AI. Tối ưu hóa truy vấn DB giúp giảm 40% thời gian phản hồi của hệ thống." },
    { timeline: "2022 - 2024", role: "Junior Web Developer", company: "VNG Corporation", detail: "Phối hợp với đội ngũ UI/UX chuyển đổi giao diện sang chuẩn Responsive. Vận hành và bảo trì hệ thống quản lý tin tuyển dụng lớn." }
  ],
  education: [
    { timeline: "2018 - 2022", major: "Kỹ thuật phần mềm (Đồ án Xuất Sắc)", school: "Đại học Công nghệ Thông tin - ĐHQG TP.HCM" }
  ]
};

export default function CVPreviewAndTemplate() {
  const navigate = useNavigate();
  
  // State quản lý mẫu CV và màu sắc đang được người dùng click chọn
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATE_DESIGNS[0]);
  const [selectedColor, setSelectedColor] = useState(THEME_COLORS[1]); // Mặc định chọn màu Xanh Biển

  // Xử lý áp dụng mẫu thành công
  const handleApplyTemplate = () => {
    alert(`Áp dụng thành công Mẫu: ${selectedTemplate.name} với tông màu: ${selectedColor.name}`);
    navigate('/candidate/cv-management'); // Quay lại trang quản lý
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased w-full flex flex-col">
      
      {/* 🚀 BAR TIÊU ĐỀ TRÊN CÙNG (TOPBAR) */}
      <div className="w-full bg-white border-b border-orange-100/70 px-4 sm:px-6 lg:px-8 py-4 shadow-xs shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/candidate/cv-management" className="p-2 hover:bg-slate-100 rounded-xl transition-colors group">
              <ArrowLeft size={16} className="text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <h1 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Layout size={18} className="text-orange-500" />
                Giao diện Thiết kế & Xem trước CV
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Lựa chọn phong cách hiển thị hồ sơ cá nhân của bạn chuyên nghiệp nhất</p>
            </div>
          </div>
          
          <button
            onClick={handleApplyTemplate}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md shadow-orange-100 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1.5 self-end sm:self-auto"
          >
            <ShieldCheck size={14} /> Sử dụng mẫu này
          </button>
        </div>
      </div>

      {/* 📦 BỐ CỤC CHIA ĐÔI: BÊN TRÁI ĐIỀU KHIỂN - BÊN PHẢI PREVIEW */}
      <div className="grow w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8">
        
        {/* ======================= KHỐI TRÁI: SIDEBAR CẤU HÌNH (CHIẾM 1/3) ======================= */}
        <div className="w-full lg:w-[360px] space-y-5 shrink-0">
          
          {/* BƯỚC 1: CHỌN MẪU CV */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs">
            <h2 className="text-xs font-black text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <Sparkles size={13} className="text-orange-500" /> 1. Chọn mẫu CV mẫu
            </h2>
            <div className="space-y-3">
              {TEMPLATE_DESIGNS.map((tpl) => {
                const isSelected = selectedTemplate.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 relative group ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-50/30 shadow-xs' 
                        : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className={`text-xs font-bold ${isSelected ? 'text-orange-600' : 'text-slate-800'}`}>
                        {tpl.name}
                      </h3>
                      <span className={`text-[9px] px-1.5 py-0.5 font-bold rounded-sm ${
                        isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {tpl.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{tpl.desc}</p>
                    
                    {isSelected && (
                      <div className="absolute right-3 bottom-3 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                        <Check size={10} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* BƯỚC 2: CHỌN MÀU CHỦ ĐẠO */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs">
            <h2 className="text-xs font-black text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <Palette size={13} className="text-orange-500" /> 2. Tông màu chủ đạo
            </h2>
            <div className="grid grid-cols-4 gap-2.5">
              {THEME_COLORS.map((color) => {
                const isColorSelected = selectedColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`h-11 rounded-xl flex items-center justify-center relative transition-transform active:scale-95 border-2 ${color.bgClass} ${
                      isColorSelected ? 'border-orange-400 scale-105 shadow-sm' : 'border-transparent'
                    }`}
                    title={color.name}
                  >
                    {isColorSelected && (
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-xs">
                        <Check size={12} className={color.textClass} strokeWidth={4} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center font-medium">
              Màu hiện tại: <span className="text-slate-600 font-bold">{selectedColor.name}</span>
            </p>
          </div>

          {/* BOX TIỆN ÍCH PHỤ TRỢ */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
            <div className="flex items-center gap-2 mb-1.5">
              <Eye size={14} className="text-amber-400" />
              <h4 className="text-xs font-bold text-amber-400">Trình xem trước thông minh</h4>
            </div>
            <p className="text-[10px] text-slate-300 leading-normal">
              Dữ liệu hiển thị được đồng bộ trực tiếp từ thông tin Hồ sơ cá nhân của bạn. Thay đổi mẫu và màu sắc không làm mất nội dung dữ liệu gốc.
            </p>
          </div>

        </div>

        {/* ======================= KHỐI PHẢI: KHUNG XEM TRƯỚC CV (CHIẾM 2/3) ======================= */}
        <div className="grow flex flex-col items-center">
          
          {/* Header giả lập thanh công cụ của tệp tin */}
          <div className="w-full max-w-[760px] bg-slate-200/80 border border-b-0 border-slate-300/70 rounded-t-xl px-4 py-2 flex items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              <span className="text-[11px] ml-2 text-slate-600 font-semibold">{selectedTemplate.name} - Preview.pdf</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>Tỷ lệ: 100%</span>
              <Download size={13} className="cursor-not-allowed hover:text-slate-700" />
            </div>
          </div>

          {/* TẤM NHÀ GIẤY CV - THAY ĐỔI THEO TEMPLATE VÀ THEME COLOR ĐÃ CHỌN */}
          <div className="w-full max-w-[760px] bg-white border border-slate-300/80 rounded-b-xl shadow-lg min-h-[900px] p-8 sm:p-12 transition-all duration-300 overflow-hidden text-sm">
            
            {/* 🛑 THIẾT KẾ MẪU 1: MINIMALIST CLEAN */}
            {selectedTemplate.id === 1 && (
              <div className="space-y-6 text-slate-700">
                {/* Header thanh lịch */}
                <div className={`border-b-2 ${selectedColor.borderClass} pb-4`}>
                  <h1 className={`text-2xl sm:text-3xl font-black ${selectedColor.textClass} tracking-wide`}>{MOCK_CV_DATA.name}</h1>
                  <p className="text-xs font-bold text-slate-500 uppercase mt-0.5 tracking-wider">{MOCK_CV_DATA.title}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 font-medium mt-3">
                    <div>📧 {MOCK_CV_DATA.info.email}</div>
                    <div>📞 {MOCK_CV_DATA.info.phone}</div>
                    <div>🌐 {MOCK_CV_DATA.info.web}</div>
                    <div>📍 {MOCK_CV_DATA.info.address}</div>
                  </div>
                </div>
                {/* Tóm tắt */}
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-wider ${selectedColor.textClass} mb-1.5`}>Mục tiêu nghề nghiệp</h3>
                  <p className="text-xs leading-relaxed text-slate-500 font-medium text-justify">{MOCK_CV_DATA.summary}</p>
                </div>
                {/* Kinh nghiệm làm việc */}
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-wider ${selectedColor.textClass} mb-2`}>Kinh nghiệm làm việc</h3>
                  <div className="space-y-3.5">
                    {MOCK_CV_DATA.experience.map((exp, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <div className="w-32 text-[11px] font-bold text-slate-400 shrink-0">{exp.timeline}</div>
                        <div className="grow">
                          <h4 className="text-xs font-bold text-slate-800">{exp.role} <span className="font-medium text-slate-400">| {exp.company}</span></h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed text-justify">{exp.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Kỹ năng */}
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-wider ${selectedColor.textClass} mb-2`}>Kỹ năng chuyên môn</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {MOCK_CV_DATA.skills.map((skill, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-sm">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 🛑 THIẾT KẾ MẪU 2: TECH MODERN */}
            {selectedTemplate.id === 2 && (
              <div className="flex flex-col md:flex-row gap-6">
                {/* Cột trái (Sidebar màu nền đậm) */}
                <div className={`w-full md:w-56 ${selectedColor.bgClass} text-white p-5 rounded-xl space-y-5 shrink-0`}>
                  <div className="text-center md:text-left">
                    <h1 className="text-lg font-black tracking-wide">{MOCK_CV_DATA.name}</h1>
                    <p className="text-[10px] font-medium text-slate-200/80 mt-0.5">{MOCK_CV_DATA.title}</p>
                  </div>
                  <div className="space-y-2 text-[10px] text-slate-100/90 border-t border-white/20 pt-3">
                    <div className="truncate">📧 {MOCK_CV_DATA.info.email}</div>
                    <div>📞 {MOCK_CV_DATA.info.phone}</div>
                    <div className="truncate">🌐 {MOCK_CV_DATA.info.web}</div>
                    <div>📍 {MOCK_CV_DATA.info.address}</div>
                  </div>
                  <div className="space-y-1.5 border-t border-white/20 pt-3">
                    <h3 className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Kỹ năng</h3>
                    {MOCK_CV_DATA.skills.map((skill, i) => (
                      <div key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded-md">{skill}</div>
                    ))}
                  </div>
                </div>
                {/* Cột phải (Nội dung chính trắng sạch) */}
                <div className="grow space-y-5">
                  <div>
                    <h3 className={`text-xs font-bold border-b pb-1 mb-1.5 ${selectedColor.textClass} ${selectedColor.borderClass}`}>Giới thiệu chung</h3>
                    <p className="text-xs text-slate-500 leading-relaxed text-justify">{MOCK_CV_DATA.summary}</p>
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold border-b pb-1 mb-2 ${selectedColor.textClass} ${selectedColor.borderClass}`}>Quá trình làm việc</h3>
                    <div className="space-y-3.5">
                      {MOCK_CV_DATA.experience.map((exp, i) => (
                        <div key={i} className="space-y-0.5">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-slate-800">{exp.role}</h4>
                            <span className="text-[10px] font-medium text-slate-400">{exp.timeline}</span>
                          </div>
                          <p className={`text-[10px] font-bold ${selectedColor.textClass}`}>{exp.company}</p>
                          <p className="text-[11px] text-slate-500 mt-1 text-justify leading-relaxed">{exp.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🛑 THIẾT KẾ MẪU 3: CREATIVE ELEGANT */}
            {selectedTemplate.id === 3 && (
              <div className="space-y-5">
                {/* Khung điểm nhấn đặt biệt ở Header */}
                <div className={`p-6 rounded-2xl bg-slate-50 border-l-4 ${selectedColor.borderClass}`}>
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight">{MOCK_CV_DATA.name}</h1>
                  <p className={`text-xs font-bold uppercase ${selectedColor.textClass} mt-0.5`}>{MOCK_CV_DATA.title}</p>
                  <p className="text-xs text-slate-400 mt-2 italic leading-relaxed text-justify">"{MOCK_CV_DATA.summary}"</p>
                </div>
                {/* Grid 2 cột thông tin tương tác sáng tạo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <h3 className={`text-xs font-extrabold uppercase ${selectedColor.textClass}`}>Lịch sử công tác</h3>
                    <div className="relative border-l-2 border-slate-100 pl-4 space-y-4 ml-1">
                      {MOCK_CV_DATA.experience.map((exp, i) => (
                        <div key={i} className="relative group">
                          {/* Dấu chấm Timeline tương tác màu */}
                          <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-white transition-colors ${selectedColor.borderClass}`}></div>
                          <div className="text-[10px] font-bold text-slate-400">{exp.timeline}</div>
                          <h4 className="text-xs font-bold text-slate-800">{exp.role} - <span className="text-slate-500">{exp.company}</span></h4>
                          <p className="text-[11px] text-slate-500 mt-1 text-justify leading-relaxed">{exp.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className={`text-xs font-extrabold uppercase ${selectedColor.textClass} mb-2`}>Liên hệ</h3>
                      <div className="text-[11px] text-slate-500 space-y-1.5 font-medium">
                        <div>📞 {MOCK_CV_DATA.info.phone}</div>
                        <div className="truncate">📧 {MOCK_CV_DATA.info.email}</div>
                        <div className="truncate">🌐 {MOCK_CV_DATA.info.web}</div>
                        <div>📍 {MOCK_CV_DATA.info.address}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-xs font-extrabold uppercase ${selectedColor.textClass} mb-2`}>Học vấn</h3>
                      {MOCK_CV_DATA.education.map((edu, i) => (
                        <div key={i} className="text-[11px] text-slate-500 space-y-0.5">
                          <p className="font-bold text-slate-700">{edu.major}</p>
                          <p className="text-[10px]">{edu.school}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{edu.timeline}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}