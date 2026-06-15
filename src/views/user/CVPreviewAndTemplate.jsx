import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Layout, ShieldCheck, Download, Eye, Loader2 } from 'lucide-react';
import axios from 'axios';

const token = localStorage.getItem('token');

// Danh sách mẫu đồng bộ 100% với cơ sở dữ liệu của bạn
const TEMPLATE_DESIGNS = [
  { id: 1, name: 'Mẫu CV Hiện đại', desc: 'Thiết kế trẻ trung, năng động, tối ưu không gian hiển thị', tag: 'Hiện đại' },
  { id: 2, name: 'Mẫu CV Cổ điển', desc: 'Phong cách truyền thống, lịch sự, tập trung vào kinh nghiệm', tag: 'Cổ điển' },
  { id: 3, name: 'Mẫu CV Thanh lịch', desc: 'Bố cục cân đối, nhẹ nhàng, phù hợp khối văn phòng, nhân sự', tag: 'Thanh lịch' },
  { id: 4, name: 'Mẫu CV Sáng tạo', desc: 'Đột phá về bố cục, dòng thời gian, hợp ngành Marketing/Design', tag: 'Sáng tạo' },
  { id: 5, name: 'Mẫu CV Tối giản', desc: 'Phong cách Tech Minimalist, gọn gàng, phù hợp dân Kỹ thuật/IT', tag: 'Tối giản' },
];

export default function CVPreviewAndTemplate() {
  const navigate = useNavigate();
  
  // 1. Lấy id ứng viên từ thanh URL (Định nghĩa dạng :id trong file Route)
  const { id } = useParams();
  
  // State quản lý ID ứng viên thực tế, Mẫu đang kích hoạt và chuỗi HTML render từ Blade
  const [candidateId, setCandidateId] = useState(id || null);
  const [selectedTemplate, setSelectedTemplate] = useState(null); // Ban đầu để null để tránh găm cứng mẫu 1
  const [cvHtml, setCvHtml] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [loadingHtml, setLoadingHtml] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =================================================================
  // 🎯 LUỒNG KHỞI TẠO DUY NHẤT: Lấy cấu hình từ DB và nạp luôn HTML chuẩn mẫu đó
  // =================================================================
  useEffect(() => {
    const initCVConfig = async () => {
      try {
        setLoading(true);
        
        // Bước 1: Gọi API dạng JSON lấy thông tin meta-data của Candidate (Xem họ đang cài mẫu nào trong DB)
        const configRes = await axios.get('http://localhost:8000/api/cv-management/preview-cv', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json'
          }
        });
        
        let targetTemplateId = 1; // ID mặc định dự phòng nếu ứng viên chưa từng cài mẫu nào

        if (configRes.data?.success && configRes.data?.data) {
          const cvData = configRes.data.data;
          
          // Bù ID từ API vào nếu trên thanh URL rỗng
          if (cvData.id) {
            setCandidateId(cvData.id);
          }
          
          // Nếu trong DB đã có lưu trường cv_template_id cụ thể
          if (cvData.cv_template_id) {
            targetTemplateId = Number(cvData.cv_template_id);
          }
        }
        
        // Bước 2: Tìm object cấu hình tương ứng để sáng đèn menu bên trái
        const currentTpl = TEMPLATE_DESIGNS.find(t => t.id === targetTemplateId) || TEMPLATE_DESIGNS[0];
        setSelectedTemplate(currentTpl);
        
        // Bước 3: Gọi nạp trực tiếp mã HTML của ĐÚNG mẫu đó từ Blade View về (Nối cứng Query Params vào URL)
        setLoadingHtml(true);
        const htmlRes = await axios.get(`http://localhost:8000/api/cv-management/preview-cv?cv_template_id=${targetTemplateId}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'text/html'
          }
        });
        setCvHtml(htmlRes.data);

      } catch (error) {
        console.error("Lỗi đồng bộ cấu hình CV ban đầu:", error);
        // Trại ro nếu API sập hoàn toàn thì đưa về mẫu 1 phòng vệ
        setSelectedTemplate(TEMPLATE_DESIGNS[0]);
      } finally {
        setLoading(false);
        setLoadingHtml(false);
      }
    };

    initCVConfig();
    // 🚫 TUYỆT ĐỐI KHÔNG VIẾT THÊM BẤT KỲ CÁI useEffect NÀO KHÁC THEO DÕI [selectedTemplate] Ở ĐÂY NỮA NHA!
  }, []); 

  // =================================================================
  // 🎯 LUỒNG ĐỔI MẪU CHỦ ĐỘNG: Kích hoạt khi người dùng CLICK CHUỘT
  // =================================================================
  const handleTemplateClick = async (tpl) => {
    if (loadingHtml || !tpl?.id) return;
    
    setSelectedTemplate(tpl); // Đổi trạng thái hiển thị Active ở menu trái
    
    try {
      setLoadingHtml(true);
      // Ép cứng tham số ID mẫu vừa chọn vào chuỗi URL, triệt tiêu lỗi thất lạc params ở Backend
      const response = await axios.get(`http://localhost:8000/api/cv-management/preview-cv?cv_template_id=${tpl.id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'text/html'
        }
      });
      setCvHtml(response.data);
    } catch (error) {
      console.error("Lỗi khi chuyển đổi mẫu thiết kế:", error);
    } finally {
      setLoadingHtml(false);
    }
  };

  // =================================================================
  // 🎯 LUỒNG LƯU CHÍNH THỨC: Cập nhật mẫu vào Database khi bấm nút
  // =================================================================
  const handleApplyTemplate = async () => {
    if (!candidateId) {
      alert("Không tìm thấy mã số hồ sơ ứng viên hợp lệ để cập nhật.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await axios.post(`http://localhost:8000/api/cv-management/updateCvTemplate/${candidateId}`, {
        cv_template_id: selectedTemplate?.id
      }, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        },
      });

      if (response.data.success) {
        alert(response.data.message || `Áp dụng thành công Mẫu: ${selectedTemplate?.name}`);
        navigate('/cv-management'); // Điều hướng về trang quản lý chính
      }
    } catch (error) {
      if (error.response?.status === 405) {
        alert("Lỗi 405: Sai phương thức gọi API (Hãy kiểm tra routes/api.php đang để POST hay PUT)!");
      } else {
        alert(error.response?.data?.message || "Cập nhật mẫu CV thất bại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Màn hình loading đồng bộ dữ liệu lúc vừa vào trang
  if (loading || !selectedTemplate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF9] gap-3">
        <Loader2 className="animate-spin text-orange-500" size={32} />
        <p className="text-sm font-medium text-slate-500">Đang đồng bộ luồng cấu trúc dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased w-full flex flex-col">
      
      {/* 🚀 BAR TIÊU ĐỀ TRÊN CÙNG (TOPBAR) */}
      <div className="w-full bg-white border-b border-orange-100/70 px-4 sm:px-6 lg:px-8 py-4 shadow-xs shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/cv-management" className="p-2 hover:bg-slate-100 rounded-xl transition-colors group">
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

      {/* 📦 BỐ CỤC CHIA ĐÔI GIAO DIỆN */}
      <div className="grow w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8">
        
        {/* ======================= KHỐI TRÁI: DANH SÁCH LỰA CHỌN (1/3) ======================= */}
        <div className="w-full lg:w-[360px] space-y-5 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs">
            <h2 className="text-xs font-black text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <Sparkles size={13} className="text-orange-500" /> Chọn mẫu thiết kế
            </h2>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
              {TEMPLATE_DESIGNS.map((tpl) => {
                // Sử dụng toán tử ?. an toàn để không bao giờ bị dính crash màn hình trắng lỗi render thuộc tính id
                const isSelected = selectedTemplate?.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleTemplateClick(tpl)} // Đổi sang gọi hàm click chủ động
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
              <h4 className="text-xs font-bold text-amber-400">Xem trước trực tuyến</h4>
            </div>
            <p className="text-[10px] text-slate-300 leading-normal">
              Hệ thống đang nạp trực tiếp chuỗi HTML/CSS từ máy chủ Laravel thông qua giao thức Header Bearer bảo mật tuyệt đối.
            </p>
          </div>
        </div>

        {/* ======================= KHỐI PHẢI: KHUNG IFRAME LIVE PREVIEW (2/3) ======================= */}
        <div className="grow flex flex-col items-center w-full">
          
          <div className="w-full max-w-[760px] bg-slate-200/80 border border-b-0 border-slate-300/70 rounded-t-xl px-4 py-2 flex items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              <span className="text-[11px] ml-2 text-slate-600 font-semibold">{selectedTemplate?.name} - Live_Render.html</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>Tỷ lệ: 100%</span>
              <Download size={13} className="cursor-not-allowed text-slate-400" />
            </div>
          </div>

          <div className="w-full max-w-[760px] bg-white border border-slate-300/80 rounded-b-xl shadow-lg min-h-[850px] transition-all duration-300 overflow-hidden relative">
            
            {/* Hiển thị màn quay tròn Loading đè mờ khi đang biên dịch đổi mẫu CV mới */}
            {loadingHtml && (
              <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-2 z-10 transition-all">
                <Loader2 className="animate-spin text-orange-500" size={28} />
                <span className="text-xs font-semibold text-slate-500">Đang biên dịch thiết kế...</span>
              </div>
            )}

            {/* Khung iframe lấy thẳng biến cục bộ chuỗi HTML thô nhận về từ Axios đổ vào srcDoc */}
            <iframe
              id="cv-live-preview"
              title="CV Live Preview"
              srcDoc={cvHtml}
              className="w-full border-none block bg-white"
              style={{ minHeight: '850px', height: '100%' }}
            />
          </div>

        </div>

      </div>

    </div>
  );
}