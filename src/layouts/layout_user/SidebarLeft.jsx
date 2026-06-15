import { ChevronDown, Star } from "lucide-react";

export default function SidebarLeft({ searchParams, setSearchParams }) {

  // 1. Hàm Xử lý dùng chung cho Text Input và Dropdown Select
  const handleFilterChange = (key, value) => {
    // Tạo bản sao mới từ URLSearchParams hiện tại
    const newParams = new URLSearchParams(searchParams);

    // Nếu giá trị trống hoặc chọn mặc định "Nổi bật" thì xóa luôn key đó cho URL sạch đẹp
    if (!value || value === "" || value === "Nổi bật") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    newParams.delete('page'); // Cứ thay đổi bộ lọc là tự động đẩy về trang 1
    setSearchParams(newParams);
  };

  // 2. Hàm Xử lý riêng cho Checkbox (Lọc nhiều loại hình: Toàn thời gian, Bán thời gian, ...)
  const handleCheckboxChange = (typeValue) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Lấy chuỗi hiện tại trên URL (ví dụ: "Fulltime,Parttime") rồi biến nó thành mảng
    const currentTypesAttr = newParams.get('types');
    let currentTypes = currentTypesAttr ? currentTypesAttr.split(',') : [];

    if (currentTypes.includes(typeValue)) {
      // Nếu đã có rồi -> Người dùng vừa bỏ tích -> Xóa khỏi mảng
      currentTypes = currentTypes.filter(t => t !== typeValue);
    } else {
      // Nếu chưa có -> Người dùng vừa tích chọn -> Thêm vào mảng
      currentTypes.push(typeValue);
    }

    // Nếu mảng loại hình còn phần tử thì nối lại bằng dấu phẩy biến thành chuỗi, nếu rỗng thì xóa luôn key
    if (currentTypes.length > 0) {
      newParams.set('types', currentTypes.join(','));
    } else {
      newParams.delete('types');
    }

    newParams.delete('page'); // Reset về trang 1
    setSearchParams(newParams);
  };

  // Tiện tay chuẩn bị mảng để check xem checkbox nào đang được chọn trên URL
  const activeTypes = searchParams.get('types') ? searchParams.get('types').split(',') : [];

  return (
    <div className="w-[210px] bg-yellow-300 border border-slate-200/80 rounded-2xl p-3 shadow-sm space-y-4 shrink-0 hidden md:block text-left">
      
      {/* Tiêu đề Sidebar */}
      <div className="flex items-center gap-1 border-b border-slate-100 pb-2">
        <Star size={12} className="text-amber-500 fill-amber-500" />
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Lọc tìm kiếm</h2>
      </div>

      {/* Bộ Lọc Địa điểm */}
      <div>
        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Địa điểm</label>
        <div className="relative">
          <select 
            value={searchParams.get('location') || ""}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 appearance-none outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">Chọn địa điểm...</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>
          <ChevronDown size={11} className="text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Bộ Lọc Mức lương */}
      <div>
        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Mức lương (Triệu)</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            placeholder="Từ"
            value={searchParams.get('salary_from') || ""}
            onChange={(e) => handleFilterChange('salary_from', e.target.value)}
            className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-1.5 py-1 bg-slate-50 outline-none focus:border-blue-500"
          />
          <span className="text-slate-400 text-xs">—</span>
          <input
            type="number"
            placeholder="Đến"
            value={searchParams.get('salary_to') || ""}
            onChange={(e) => handleFilterChange('salary_to', e.target.value)}
            className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-1.5 py-1 bg-slate-50 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Bộ Lọc Cấp bậc (Đã chuẩn hóa Tiếng Anh - Tiếng Việt DB) */}
      <div>
        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Cấp bậc</label>
        <div className="relative">
          <select 
            value={searchParams.get('level') || "Nổi bật"}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 appearance-none outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="Nổi bật">Nổi bật</option>
            <option value="Thực tập sinh">Intern / Fresher</option>
            <option value="Nhân viên">Junior</option>
            <option value="Quản lý">Manager</option>
            <option value="Trưởng phòng">Senior / Leader</option>
          </select>
          <ChevronDown size={11} className="text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>

    </div>
  );
}