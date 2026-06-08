import { Search, MapPin, Briefcase, ChevronDown, Sparkles } from "lucide-react";
import anh_banner from '../../assets/images/anh_banner.png';

export default function Banner({ searchParams, setSearchParams }) {
  
  // 1. Xử lý khi người dùng NHẤP NÚT "TÌM KIẾM" (Dành riêng cho ô gõ Keyword)
  const handleTriggerSearch = (e) => {
    e.preventDefault();
    // Lấy giá trị từ ô input text trong form
    const formData = new FormData(e.target);
    const keywordValue = formData.get("keyword-input")?.trim();

    const newParams = new URLSearchParams(searchParams);
    if (keywordValue) {
      newParams.set('keyword', keywordValue);
    } else {
      newParams.delete('keyword'); // Nếu ô trống thì xóa bớt param keyword đi
    }
    newParams.delete('page'); // Reset về trang 1 khi tìm kiếm từ khóa mới
    setSearchParams(newParams);
  };

  // 2. Xử lý khi thay đổi Dropdown Ngành nghề (Chọn cái ăn luôn, chọn lại xóa luôn)
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);

    // Nếu người dùng chọn placeholder "Chọn ngành nghề..." hoặc để trống
    if (!value || value.includes('Chọn ngành nghề')) {
      newParams.delete('category_id'); 
    } else {
      newParams.set('category_id', value); 
    }
    
    newParams.delete('page'); 
    setSearchParams(newParams); 
  };

  // 3. Tương tự cho Địa điểm (Chọn cái ăn luôn)
  const handleLocationChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);

    if (!value || value.includes('Chọn địa điểm')) {
      newParams.delete('location');
    } else {
      newParams.set('location', value);
    }
    
    newParams.delete('page');
    setSearchParams(newParams);
  };

  return (
    <div className="w-full bg-[#FBF4DC] rounded-3xl border border-amber-200/60 p-6 sm:p-10 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[260px]">

      {/* KHỐI CHỨA ẢNH BANNER */}
      <div className="absolute right-4 bottom-0 top-0 w-[32%] hidden md:flex items-center justify-center z-[40]">
        <img
          src={anh_banner}
          alt="VieclamPro AI Assistant"
          className="w-full h-auto max-h-[110%] object-contain mb-8 shadow-none drop-shadow-md"
        />
      </div>

      {/* Tiêu đề lớn giữa Banner */}
      <div className="max-w-2xl z-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">
          Tìm công việc<br />mơ ước của bạn
        </h1>
        <p className="text-xs font-medium text-slate-600 mt-2 flex items-center gap-1">
          Sạch sẽ, nhanh chóng, thông minh <Sparkles size={12} className="text-amber-600" />
        </p>
      </div>

      {/* Thanh tìm kiếm phức hợp */}      
      <form onSubmit={handleTriggerSearch} className="bg-white p-2 rounded-xl sm:rounded-2xl shadow-md border border-amber-200/40 flex flex-col sm:flex-row items-center gap-2 mt-8 z-10 max-w-4xl">
        
        {/* Ô NHẬP TỪ KHÓA (Dùng defaultValue lấy từ URL params để không bị mất chữ khi load lại trang) */}
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
            value={searchParams.get('location') || 'Chọn địa điểm...'}
            onChange={handleLocationChange} // 🔥 ĐÃ SỬA: Gọi đúng hàm xử lý URL
            className="w-full bg-transparent text-[11px] pl-8 pr-4 py-1 appearance-none outline-none text-slate-600 cursor-pointer"              
          >
            <option>Chọn địa điểm...</option>
            <option>TP. Hồ Chí Minh</option>
            <option>Hà Nội</option>
          </select>
          <ChevronDown size={12} className="text-slate-400 absolute right-2 top-2 pointer-events-none" />
        </div>

        {/* DROPDOWN NGÀNH NGHỀ */}
        <div className="relative flex-1 w-full pb-2 sm:pb-0">
          <Briefcase size={14} className="absolute left-2.5 top-2 text-slate-400" />
          <select 
            value={searchParams.get('category_id') || 'Chọn ngành nghề...'}
            onChange={handleCategoryChange} // 🔥 ĐÃ SỬA: Gọi đúng hàm xử lý URL
            className="w-full bg-transparent text-[11px] pl-8 pr-4 py-1 appearance-none outline-none text-slate-600 cursor-pointer"
          >
            <option>Chọn ngành nghề...</option>
            {/* LƯU Ý: Value ở option này nên là ID số tương ứng dưới DB của bro, ví dụ value="1", value="2" */}
            <option value="Công nghệ thông tin">Công nghệ thông tin</option>
            <option value="Marketing">Marketing</option>
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