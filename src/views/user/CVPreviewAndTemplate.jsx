import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Layout, ShieldCheck, Download, Eye, Loader2 } from 'lucide-react';
import axios from 'axios'; // Import axios để gọi API

// =========================================================================
// 🛑 IMPORT CÁC COMPONENT MẪU CV THẬT
// =========================================================================
import ModernCVTemplate from '../../components/CV_template/ModernCVTemplate';
import ClassicCVTemplate from '../../components/CV_template/ClassicCVTemplate';
import ElegantCVTemplate from '../../components/CV_template/ElegantCVTemplate';
import CreativeCVTemplate from '../../components/CV_template/CreativeCVTemplate';
import TechMinimalistTemplate from '../../components/CV_template/TechMinimalistTemplate';

const TEMPLATE_COMPONENTS = {
  1: ModernCVTemplate,
  2: ClassicCVTemplate,
  3: ElegantCVTemplate,
  4: CreativeCVTemplate,
  5: TechMinimalistTemplate,
};

const token = localStorage.getItem('token');

const TEMPLATE_DESIGNS = [
  { id: 1, name: 'Mẫu CV Hiện đại', desc: 'Thiết kế trẻ trung, năng động, tối ưu không gian hiển thị', tag: 'Hiện đại' },
  { id: 2, name: 'Mẫu CV Cổ điển', desc: 'Phong cách truyền thống, lịch sự, tập trung vào kinh nghiệm', tag: 'Cổ điển' },
  { id: 3, name: 'Mẫu CV Thanh lịch', desc: 'Bố cục cân đối, nhẹ nhàng, phù hợp khối văn phòng, nhân sự', tag: 'Thanh lịch' },
  { id: 4, name: 'Mẫu CV Sáng tạo', desc: 'Đột phá về bố cục, dòng thời gian, hợp ngành Marketing/Design', tag: 'Sáng tạo' },
  { id: 5, name: 'Mẫu CV Tối giản', desc: 'Phong cách Tech Minimalist, gọn gàng, phù hợp dân Kỹ thuật/IT', tag: 'Tối giản' },
];

export default function CVPreviewAndTemplate() {
  const navigate = useNavigate();
  
  // Các state quản lý dữ liệu ứng viên, trạng thái tải và ID mẫu CV
  const [candidateData, setCandidateData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATE_DESIGNS[0]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Dùng useEffect để tự động gọi API lấy dữ liệu thật khi vào trang
  useEffect(() => {
    const fetchCVData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/cv-management/getDataCV',{
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json'
          }
        }); // Thay đổi đường dẫn đúng với cấu hình Route của bạn
        
        if (response.data.success && response.data.data) {
          const fetchedData = response.data.data;
          setCandidateData(fetchedData);
          console.log(response.data.data)
          // Nếu ứng viên đã có cv_template_id trong DB, tự động chọn mẫu đó trên UI
          if (fetchedData.cv_template_id) {
            const currentTpl = TEMPLATE_DESIGNS.find(t => t.id === fetchedData.cv_template_id);
            if (currentTpl) setSelectedTemplate(currentTpl);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu ứng viên:", error);
        alert("Không thể tải thông tin hồ sơ. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchCVData();
  }, []);

  // 2. Hàm xử lý API cập nhật cv_template_id khi nhấn "Sử dụng mẫu này"
  const handleApplyTemplate = async () => {
    if (!candidateData?.id) {
      alert("Không tìm thấy thông tin hồ sơ để cập nhật.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Gọi API POST truyền kèm ID của Candidate trên url và template_id trong body
      const response = await axios.post(`http://localhost:8000/api/cv-management/updateCvTemplate/${candidateData.id}`, {
        cv_template_id: selectedTemplate.id}, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json'
        },
      });

      if (response.data.success) {
        alert(response.data.message || `Áp dụng thành công Mẫu: ${selectedTemplate.name}`);
        navigate('/candidate/cv-management'); // Điều hướng về trang quản lý hồ sơ
      }
    } catch (error) {
      // Báo lỗi tường tận để dễ debug
    if (error.response?.status === 405) {
      alert("Lỗi 405: Sai phương thức gọi API (Hãy kiểm tra lại trong routes/api.php đang để POST hay PUT)!");
    } else if (error.response?.status === 401) {
      alert("Lỗi 401: Phiên đăng nhập hết hạn hoặc Token không hợp lệ!");
    } else {
      alert(error.response?.data?.message || "Cập nhật mẫu CV thất bại.");
    }
      setIsSubmitting(false);
    }
  };

  // Xác định component mẫu sẽ hiển thị trong khung Preview
  const ActiveTemplateComponent = TEMPLATE_COMPONENTS[selectedTemplate.id];

  // Giao diện chờ trong lúc API đang tải dữ liệu ban đầu
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF9] gap-3">
        <Loader2 className="animate-spin text-orange-500" size={32} />
        <p className="text-sm font-medium text-slate-500">Đang tải cấu trúc dữ liệu hồ sơ...</p>
      </div>
    );
  }

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
                Giao diện Chọn Mẫu CV
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Lựa chọn phong cách hiển thị hồ sơ cá nhân của bạn chuyên nghiệp nhất</p>
            </div>
          </div>
          
          <button
            onClick={handleApplyTemplate}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-400 disabled:to-slate-400 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md shadow-orange-100 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1.5 self-end sm:self-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Đang xử lý...
              </>
            ) : (
              <>
                <ShieldCheck size={14} /> Sử dụng mẫu này
              </>
            )}
          </button>
        </div>
      </div>

      {/* 📦 BỐ CỤC CHIA ĐÔI */}
      <div className="grow w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8">
        
        {/* ======================= KHỐI TRÁI: DANH SÁCH MẪU CV (1/3) ======================= */}
        <div className="w-full lg:w-[360px] space-y-5 shrink-0">
          
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs">
            <h2 className="text-xs font-black text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <Sparkles size={13} className="text-orange-500" /> Chọn mẫu thiết kế
            </h2>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
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

          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1.5">
              <Eye size={14} className="text-amber-400" />
              <h4 className="text-xs font-bold text-amber-400">Xem trước trực tiếp</h4>
            </div>
            <p className="text-[10px] text-slate-300 leading-normal">
              Dữ liệu của ứng viên <span className="text-orange-400 font-bold">{candidateData?.user?.name || ''}</span> đang được đồng bộ trực tiếp vào các giao diện mẫu.
            </p>
          </div>

        </div>

        {/* ======================= KHỐI PHẢI: KHUNG XEM TRƯỚC (2/3) ======================= */}
        <div className="grow flex flex-col items-center w-full">
          
          <div className="w-full max-w-[760px] bg-slate-200/80 border border-b-0 border-slate-300/70 rounded-t-xl px-4 py-2 flex items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              <span className="text-[11px] ml-2 text-slate-600 font-semibold">{selectedTemplate.name} - Live_Preview.pdf</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>Tỷ lệ: 100%</span>
              <Download size={13} className="cursor-not-allowed" />
            </div>
          </div>

          <div className="w-full max-w-[760px] bg-white border border-slate-300/80 rounded-b-xl shadow-lg min-h-[900px] p-8 sm:p-12 transition-all duration-300 overflow-hidden text-sm">
            
            {ActiveTemplateComponent ? (
              // Truyền trực tiếp dữ liệu thật 'candidateData' lấy từ API thay vì dùng dữ liệu Mock lúc trước
              <ActiveTemplateComponent candidateData={candidateData} />
            ) : (
              <div className="text-center py-20 text-slate-400">
                Không tìm thấy file giao diện của mẫu hồ sơ này.
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}