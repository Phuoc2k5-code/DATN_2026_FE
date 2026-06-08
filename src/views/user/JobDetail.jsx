import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom'; // 🚀 ĐÃ THÊM: useNavigate
import {
  MapPin, Briefcase, DollarSign, Calendar, Clock,
  UserCheck, Building2, Send, CheckCircle, ChevronRight,
  AlertCircle, AlertTriangle, Bookmark, Loader2
} from 'lucide-react';

import ApplyModal from '../../components/ApplyModal';
import ReportModal from '../../components/ReportModal';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // 🚀 ĐÃ THÊM: Khởi tạo hook điều hướng lịch sử trình duyệt
  
  // Khởi tạo giá trị mặc định là null (hoặc object rỗng) để xử lý bất đồng bộ an toàn
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [isSaved, setIsSaved] = useState(false);
  const [isOpenApply, setIsOpenApply] = useState(false);
  const [isOpenReport, setIsOpenReport] = useState(false);

  const fetchJobData = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/job-detail/${id}`);      
      if (response.data.success) {
        setJobData(response.data.data); 
      } else {
        setError(response.data.message || 'Không thể lấy dữ liệu.');
      }
    } catch (err) {
      console.error("Error fetching job detail:", err);
      setError(err.response?.data?.message || 'Đã xảy ra lỗi kết nối với máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  // Thêm mảng phụ thuộc [id] để chỉ gọi API duy nhất khi ID trên URL thay đổi
  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0); // Tự động cuộn lên đầu trang khi mở bài mới
      fetchJobData();
    }
  }, [id]);

  // HÀM TIỆN ÍCH: Biến chuỗi text dài từ DB Laravel (nhập xuống dòng) thành mảng để map ra giao diện
  const parseTextToList = (text) => {
    if (!text) return [];
    return text.split('\n').map(item => item.trim()).filter(item => item !== '');
  };

  // XỬ LÝ BẤM NÚT BÁO CÁO VI PHẠM
  const handleOpenReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpenReport(true);
  };

  // TRẠNG THÁI ĐANG TẢI DỮ LIỆU SẠCH SẼ
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-[#FFFDF9]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Đang đồng bộ thông tin tuyển dụng...</p>
      </div>
    );
  }

  // TRẠNG THÁI LỖI HOẶC KHÔNG TÌM THẤY TIN (LỖI 404 CỦA LARAVEL)
  if (error || !jobData) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 bg-white border border-slate-200 rounded-2xl text-center shadow-xs">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 mb-1">Xảy ra sự cố tải trang</h3>
        <p className="text-xs text-slate-500 mb-4">{error || "Tin tuyển dụng không tồn tại."}</p>
        <button 
          onClick={() => navigate('/')} 
          className="inline-block text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Quay lại Trang Chủ
        </button>
      </div>
    );
  }

  // ĐỒNG BỘ DỮ LIỆU TỪ LARAVEL DATABASE
  const companyName = jobData.company?.company_name || 'Doanh nghiệp tuyển dụng';
  const companyLogoBg = jobData.logoBg || 'bg-gradient-to-br from-blue-500 to-indigo-600';
  const descriptionList = parseTextToList(jobData.description);
  const requirementsList = parseTextToList(jobData.requirements);
  const benefitsList = parseTextToList(jobData.benefits);
  const salaryText = jobData.is_negotiable ? 'Thỏa thuận' : `${parseInt(jobData.salary_min).toLocaleString()} - ${parseInt(jobData.salary_max).toLocaleString()} VNĐ`;

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full overflow-x-hidden">
      {/* 🚀 ĐÃ THÊM: Nút Quay Lại Thông Minh ngay dưới Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <button
          onClick={() => navigate(-1)} // Quay ngược lại trang trước, giữ nguyên vị trí cuộn chuột và bộ lọc search
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <ChevronRight size={14} className="rotate-180 transform transition-transform group-hover:-translate-x-0.5" />
          Quay lại danh sách việc làm
        </button>
      </div>
      {/* BLOCK HEADER CÔNG VIỆC */}
      <div className="w-full bg-white border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${companyLogoBg} text-white font-black text-xl flex items-center justify-center shadow-md shrink-0`}>
              {companyName.charAt(0)}
            </div>
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {jobData.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                <RouterLink to={`/companies/${jobData.company?.id}`} className="text-blue-600 font-bold text-sm hover:underline cursor-pointer">
                  {companyName}
                </RouterLink>
                <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" /> {jobData.location}</span>
                <span className="flex items-center gap-1"><Clock size={13} className="text-slate-400" /> Bản tin mới</span>
              </div>
            </div>
          </div>

          {/* Các nút tương tác nhanh */}
          <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 shrink-0">
            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`flex-1 md:flex-none justify-center px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
                isSaved
                  ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Bookmark size={14} className={isSaved ? 'fill-amber-500 text-amber-500' : 'text-slate-400'} />
              <span>{isSaved ? 'Đã lưu việc' : 'Lưu tin'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenReport}
              className="flex-1 md:flex-none justify-center px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-600 flex items-center gap-1.5 transition-all hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600"
            >
              <AlertTriangle size={13} className="text-rose-500" />
              <span>{isOpenReport ? 'Đã báo cáo' : 'Báo cáo'}</span>
            </button>
            
            <ReportModal
              isOpen={isOpenReport}
              onClose={() => setIsOpenReport(false)}
              jobTitle={jobData.title}
              companyName={companyName}
              jobId={jobData.id}
            />    
          </div>
        </div>
      </div>

      {/* VÙNG NỘI DUNG CHÍNH */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">

          {/* CỘT TRÁI - CHI TIẾT JD */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">

              {/* Mục Mô tả */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-l-4 border-blue-600 pl-2.5 mb-3">
                  Mô tả công việc
                </h3>
                {descriptionList.length > 0 ? (
                  <ul className="space-y-2">
                    {descriptionList.map((item, idx) => (
                      <li key={idx} className="text-xs sm:text-[13px] text-slate-600 leading-relaxed flex items-start gap-2">
                        <span className="text-blue-500 mt-1 shrink-0">▪</span> {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">Chi tiết công việc đang được cập nhật...</p>
                )}
              </div>

              {/* Mục Yêu cầu */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-l-4 border-blue-600 pl-2.5 mb-3">
                  Yêu cầu ứng viên
                </h3>
                {requirementsList.length > 0 ? (
                  <ul className="space-y-2">
                    {requirementsList.map((item, idx) => (
                      <li key={idx} className="text-xs sm:text-[13px] text-slate-600 leading-relaxed flex items-start gap-2">
                        <span className="text-blue-500 mt-1 shrink-0">▪</span> {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">Yêu cầu ứng viên đang được cập nhật...</p>
                )}
              </div>

              {/* Mục Quyền lợi */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-l-4 border-blue-600 pl-2.5 mb-3">
                  Quyền lợi được hưởng
                </h3>
                {benefitsList.length > 0 ? (
                  <ul className="space-y-2">
                    {benefitsList.map((item, idx) => (
                      <li key={idx} className="text-xs sm:text-[13px] text-slate-600 leading-relaxed flex items-start gap-2">
                        <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">Quyền lợi đang được cập nhật...</p>
                )}
              </div>

              {/* HỆ THỐNG TAGS PHỤC VỤ AI MATCHING SCORE */}
              {jobData.skills && jobData.skills.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2.5">
                    Từ khóa liên quan kĩ năng
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {jobData.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="bg-blue-50/70 text-blue-600 border border-blue-100 text-[10.5px] font-bold px-2.5 py-1 rounded-lg shadow-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-xl flex items-start gap-2.5">
              <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                <strong>Khuyến cáo:</strong> VieclamPro không thu bất kỳ khoản phí nào của ứng viên khi nộp hồ sơ. Nếu nhận được yêu cầu đóng tiền cọc hoặc làm nhiệm vụ nạp tiền, vui lòng báo cáo ngay cho ban quản trị hệ thống.
              </p>
            </div>
          </div>

          {/* CỘT PHẢI - TỔNG QUAN */}
          <div className="space-y-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <button
                onClick={() => setIsOpenApply(true)}
                disabled={isOpenApply}
                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                  isOpenApply
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {isOpenApply ? <>Đã nộp hồ sơ thành công</> : <>Ứng tuyển ngay <Send size={13} className="animate-bounce" /></>}
              </button>
              
              <ApplyModal isOpen={isOpenApply} onClose={() => setIsOpenApply(false)} companyName={companyName} />

              <div className="h-px bg-slate-100 my-1"></div>

              <div className="space-y-3.5 text-xs font-semibold text-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 font-medium"><DollarSign size={14} /> Mức lương</div>
                  <div className="text-emerald-600 font-black">{salaryText}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 font-medium"><Briefcase size={14} /> Ngành nghề</div>
                  <div className="text-slate-700 text-[11px] truncate max-w-[150px]">{jobData.category?.name || 'Chưa phân loại'}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 font-medium"><UserCheck size={14} /> Cấp bậc</div>
                  <div className="text-slate-700">{jobData.level}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 font-medium"><Clock size={14} /> Hình thức</div>
                  <div className="text-slate-700">{jobData.type || 'Toàn thời gian'}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 font-medium"><Calendar size={14} /> Hạn nộp hồ sơ</div>
                  <div className="text-rose-600 font-bold">{jobData.expired_at || 'Đang cập nhật'}</div>
                </div>
              </div>
            </div>

            {/* BLOCK THÔNG TIN DOANH NGHIỆP */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Building2 size={14} className="text-blue-600" />
                <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-700">Thông tin công ty</h3>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">{companyName}</h4>
                <p className="text-[10px] text-slate-400 font-medium">Mã số thuế: {jobData.company?.tax_code || 'Đang cập nhật'}</p>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed text-justify">
                {jobData.company?.description || 'Thông tin công ty đang được cập nhật.'}
              </p>

              <div className="pt-2 border-t border-slate-50 text-[10.5px] text-slate-400 font-medium space-y-1">
                <span className="block font-bold text-slate-500 uppercase text-[8.5px]">Địa điểm làm việc</span>
                <p className="leading-tight text-slate-500">{jobData.location}</p>
              </div>

              <RouterLink to={`/companies/${jobData.company?.id}`} className="w-full mt-2 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10.5px] font-bold rounded-lg flex items-center justify-center gap-0.5 transition-colors">
                Xem trang công ty <ChevronRight size={12} />
              </RouterLink>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}