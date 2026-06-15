import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, ChevronDown, Sparkles } from "lucide-react";
import axios from "axios";
import anh_banner from '../../assets/images/anh_banner.png';

export default function Banner({ searchParams, setSearchParams }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories");
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error("❌ Lỗi lấy danh sách ngành nghề:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSelectChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value.includes("Chọn")) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const keywordValue = formData.get("keyword-input")?.trim();

    const newParams = new URLSearchParams(searchParams);
    if (keywordValue) {
      newParams.set('keyword', keywordValue);
    } else {
      newParams.delete('keyword');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  return (
    /* 🔥 SỬA TẠI ĐÂY: Thêm md:pr-[35%] để ép toàn bộ nội dung bên trong (Text + Form) 
      chỉ được chiếm tối đa 65% diện tích bên trái, chừa hẳn 35% bên phải cho cái ảnh.
    */
    <div className="w-full bg-[#FBF4DC] rounded-3xl border border-amber-200/60 p-6 sm:p-10 md:pr-[35%] relative overflow-hidden shadow-sm flex flex-col justify-center min-h-[260px]">

      {/* KHỐI CHỨA ẢNH BANNER - Thêm pointer-events-none để chuột có thể xuyên qua khối này nếu bị chạm rìa */}
      <div className="absolute right-0 bottom-0 top-0 w-[32%] hidden md:flex items-center justify-center z-10 pointer-events-none">
        <img
          src={anh_banner}
          alt="VieclamPro AI Assistant"
          // Giới hạn lại max-h-[95%] để ảnh thụt xuống dưới một chút, không bị lấn vọt lên trên thanh tìm kiếm
          className="w-full h-auto max-h-[95%] object-contain object-bottom drop-shadow-md"
        />
      </div>

      {/* Tiêu đề lớn giữa Banner */}
      <div className="z-20 max-w-xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">
          Tìm công việc<br />mơ ước của bạn
        </h1>
        <p className="text-xs font-medium text-slate-600 mt-2 flex items-center gap-1">
          Sạch sẽ, nhanh chóng, thông minh <Sparkles size={12} className="text-amber-600" />
        </p>
      </div>

      {/* Thanh tìm kiếm phức hợp */}      
      {/* 🔥 SỬA TẠI ĐÂY: Đổi max-w-4xl thành max-w-full hoặc lg:max-w-3xl để thanh form nằm vừa vặn trong vùng 65% phía bên trái */}
      <form onSubmit={handleFormSubmit} className="bg-white p-2 rounded-xl sm:rounded-2xl shadow-md border border-amber-200/40 flex flex-col sm:flex-row items-center gap-2 mt-4 z-30 max-w-full lg:max-w-3xl">        
        
        {/* Ô NHẬP TỪ KHÓA */}
        <div className="relative flex-1 w-full border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0">
          <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
          <input
            type="text"
            name="keyword-input"
            placeholder="Nhập từ khóa..."
            defaultValue={searchParams.get('keyword') || ''} 
            className="w-full bg-transparent text-[11px] pl-8 pr-2 py-1 outline-none text-slate-700"
          />
        </div>

        {/* DROPDOWN ĐỊA ĐIỂM */}
        <div className="relative flex-1 w-full border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0">
          <MapPin size={14} className="absolute left-2.5 top-2 text-slate-400" />
          <select 
            value={searchParams.get('location') || ''}
            onChange={(e) => handleSelectChange('location', e.target.value)}
            className="w-full bg-transparent text-[11px] pl-8 pr-4 py-1 appearance-none outline-none text-slate-600 cursor-pointer"              
          >
            <option value="">Chọn địa điểm...</option>
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
          </select>
          <ChevronDown size={12} className="text-slate-400 absolute right-2 top-2 pointer-events-none" />
        </div>

        {/* DROPDOWN NGÀNH NGHỀ (ĐÃ ĐỘNG HÓA QUA API) */}
        <div className="relative flex-1 w-full pb-2 sm:pb-0">
          <Briefcase size={14} className="absolute left-2.5 top-2 text-slate-400" />
          <select 
            value={searchParams.get('category_id') || ''}
            onChange={(e) => handleSelectChange('category_id', e.target.value)}
            className="w-full bg-transparent text-[11px] pl-8 pr-4 py-1 appearance-none outline-none text-slate-600 cursor-pointer"
          >
            <option value="">Chọn ngành nghề...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="text-slate-400 absolute right-2 top-2 pointer-events-none" />
        </div>

        <button type="submit" className="w-full sm:w-auto px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all shrink-0">
          Tìm kiếm
        </button>
      </form>
    </div>
  );
}