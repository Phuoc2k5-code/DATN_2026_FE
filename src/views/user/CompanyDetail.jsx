import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Globe, Users, Briefcase, 
  Building2, ShieldCheck, Award, Heart, ExternalLink,
  AlertTriangle, Loader2, AlertCircle
} from 'lucide-react';
import Job from '../../components/JobCard'; // Component JobCard của dự án
import ReportModal from '../../components/ReportModal'; // Component ReportModal dùng chung

export default function CompanyDetails() {
  const { id } = useParams(); // Lấy ID công ty từ URL (Ví dụ: /companies/1)

  // 🚀 QUAN TRỌNG: Quản lý trạng thái dữ liệu API và trạng thái giao diện sạch sẽ
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenReport, setIsOpenReport] = useState(false);

  // 🚀 HÀM GỌI API LẤY CHI TIẾT DOANH NGHIỆP TỪ LARAVEL
  const fetchCompanyData = async () => {
    setError(null);
    setLoading(true);
    try {
      // Gọi chính xác tới Route Backend Laravel mà anh em mình vừa thống nhất viết ở trên
      const response = await axios.get(`http://127.0.0.1:8000/api/companies/${id}`);
      if (response.data.success) {
        setCompanyData(response.data.data);
      } else {
        setError(response.data.message || 'Không thể lấy dữ liệu doanh nghiệp.');
      }
    } catch (err) {
      console.error("Error fetching company details:", err);
      setError(err.response?.data?.message || 'Đã xảy ra lỗi kết nối với máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  // 🚀 ĐỒNG BỘ: Gọi API và ép thanh cuộn lên đầu trang mỗi khi ID công ty thay đổi
  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      fetchCompanyData();
    }
  }, [id]);

  // HÀM TIỆN ÍCH: Biến chuỗi văn bản mô tả phúc lợi (đầu vào từ DB viết xuống dòng) thành mảng để map đẹp mắt
  const parseBenefitsToList = (text) => {
    if (!text) {
      // Nếu DB không có cột phúc lợi riêng, trả về mảng mặc định cho giao diện không bị trống
      return [
        { title: "Môi trường làm việc hiện đại", desc: "Không gian mở sáng tạo, kích thích tư duy phát triển tối đa." },
        { title: "Chế độ đãi ngộ cạnh tranh", desc: "Lương thưởng hấp dẫn tương xứng với năng lực thực tế." }
      ];
    }
    // Logic tách dòng tự động (nếu bro lưu chuỗi text dài từ Laravel)
    return text.split('\n').map((item, idx) => {
      const parts = item.split(':');
      return {
        title: parts[0]?.trim() || `Phúc lợi ${idx + 1}`,
        desc: parts[1]?.trim() || "Chi tiết chế độ đãi ngộ đang được áp dụng."
      };
    });
  };

  // HÀM XỬ LÝ MỞ MODAL BÁO CÁO (Chống nổi bọt)
  const handleOpenReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpenReport(true);
  };

  // TRẠNG THÁI 1: ĐANG TẢI DỮ LIỆU SẠCH SẼ
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-[#FFFDF9]">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Đang đồng bộ hồ sơ doanh nghiệp...</p>
      </div>
    );
  }

  // TRẠNG THÁI 2: XẢY RA SỰ CỐ TẢI TRANG (LỖI 404 HOẶC MẤT KẾT NỐI SERVER)
  if (error || !companyData) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 bg-white border border-slate-200 rounded-2xl text-center shadow-xs">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 mb-1">Xảy ra sự cố tải trang</h3>
        <p className="text-xs text-slate-500 mb-4">{error || "Hồ sơ công ty không tồn tại trên hệ thống."}</p>
        <Link to="/" className="inline-block text-xs font-bold bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition">
          Quay lại Trang Chủ
        </Link>
      </div>
    );
  }

  // 🚀 ĐỒNG BỘ MAPPING BIẾN TỪ LARAVEL JSON RESPONSE
  const companyName = companyData.company_name || 'Doanh nghiệp tuyển dụng';
  const logoBgColor = companyData.logoBg || 'bg-gradient-to-br from-orange-500 to-amber-600';
  const companyWebsite = companyData.website || 'https://vieclampro.vn';
  const companyLocation = companyData.location || 'Đang cập nhật địa chỉ';
  const companyAbout = companyData.description || 'Thông tin giới thiệu về doanh nghiệp đang được cập nhật.';
  const companyIndustry = companyData.industry || 'Chưa phân loại lĩnh vực';
  const companyScale = companyData.scale || 'Đang cập nhật quy mô';
  const companyFounded = companyData.founded_in || 'Đang cập nhật';
  
  // Tách mảng phúc lợi từ dữ liệu DB (hoặc dùng hàm tiện ích đã map sẵn ở trên)
  const benefitsList = parseBenefitsToList(companyData.benefits);
  // Danh sách các tin tuyển dụng của riêng công ty này (được Laravel eager load thông qua $company->jobs)
  const activeJobsList = companyData.jobs || [];

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full">
      
      {/* 🏙️ 1. BANNER & AVATAR CÔNG TY */}
      <div className="w-full bg-gradient-to-br from-orange-100/60 via-amber-50/40 to-white text-slate-800 pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-orange-100/70 shadow-sm relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Nút quay lại thông minh không reload */}
          <Link to={-1} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors mb-6 group w-fit">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
            Quay lại trang trước
          </Link>

          {/* Khối nhận diện thương hiệu lớn */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left">
            
            {/* Vùng bên trái: Thông tin thương hiệu */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 w-full md:w-auto">
              
              {/* Logo viết tắt chữ đầu lấy từ ký tự đầu tiên của tên công ty trên DB */}
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${logoBgColor} text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-md border-4 border-orange-100/50 shrink-0`}>
                {companyName.charAt(0)}
              </div>
              
              <div className="space-y-2 flex-1 w-full">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {companyName}
                  <ShieldCheck size={18} className="text-emerald-500 fill-emerald-50" title="Doanh nghiệp đã xác thực" />
                </h1>
                
                <p className="text-xs sm:text-sm italic text-slate-500 font-medium max-w-2xl mx-auto md:mx-0">
                  "{companyData.tagline || 'Kết nối cơ hội nghề nghiệp đột phá cùng VieclamPro.'}"
                </p>
                
                {/* Khối thông tin liên hệ */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 pt-1 text-[11px] text-slate-600 font-semibold">
                  <a href={companyWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-orange-600 transition-colors cursor-pointer">
                    <Globe size={13} className="text-slate-400" /> {companyWebsite}
                  </a>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" /> {companyLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Vùng bên phải: Nút Báo cáo doanh nghiệp */}
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
                {companyAbout}
              </p>
            </div>

            {/* Khối 2: Chế độ phúc lợi đãi ngộ */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Heart size={15} className="text-rose-500 fill-rose-500/10" /> Quyền lợi & Phúc lợi hấp dẫn
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {benefitsList.map((benefit, idx) => (
                  <div key={idx} className="p-3 border border-slate-100 bg-slate-50/40 rounded-xl space-y-0.5 text-left">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Award size={13} className="text-amber-500 shrink-0" /> {benefit.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-500 leading-relaxed pl-4">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Khối 3: Danh sách các việc làm đang gọi từ quan hệ DB Laravel */}
            <div className="space-y-3.5">
              <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5 px-1">
                <Briefcase size={15} className="text-blue-600" /> Vị trí đang tuyển dụng ({activeJobsList.length})
              </h3>
              
              {activeJobsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeJobsList.map((job) => (
                    // Truyền object job sạch gọi từ DB vào Component dùng chung của bro
                    <Job key={job.id} job={{
                      id: job.id,
                      title: job.title,
                      company: companyName, // Kế thừa tên công ty cha
                      location: job.location,
                      salary: job.is_negotiable ? 'Thỏa thuận' : `${parseInt(job.salary_min).toLocaleString()} - ${parseInt(job.salary_max).toLocaleString()} VNĐ`,
                      logoBg: logoBgColor,
                      tags: job.tags || ["Tuyển gấp"]
                    }} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white border border-dashed border-slate-200 rounded-2xl">
                  <p className="text-xs font-medium text-slate-400 italic">Hiện tại doanh nghiệp chưa mở thêm vị trí tuyển dụng mới.</p>
                </div>
              )}
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
                  <div className="text-slate-800 mt-0.5">{companyIndustry}</div>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Users size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Quy mô công ty</div>
                  <div className="text-slate-800 mt-0.5">{companyScale}</div>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Briefcase size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Năm thành lập</div>
                  <div className="text-slate-800 mt-0.5">{companyFounded}</div>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Địa chỉ trụ sở chính</div>
                  <div className="text-slate-800 mt-0.5 leading-relaxed">{companyLocation}</div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2"></div>

            {/* Nút bấm điều hướng Link ngoài */}
            <a 
              href={companyWebsite} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs group"
            >
              Ghé thăm Website công ty <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

        </div>
      </main>

      {/* 💡 CALL MODAL CHỐNG RELOAD */}
      <ReportModal
        isOpen={isOpenReport}
        onClose={() => setIsOpenReport(false)}
        type="company"
        targetId={companyData?.id || id}
        targetName={companyName}
      />

    </div>
  );
}