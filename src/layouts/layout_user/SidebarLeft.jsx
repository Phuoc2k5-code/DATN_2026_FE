import { ChevronDown, Star } from "lucide-react";

export default function SidebarLeft({ searchParams, setSearchParams, onApplyFilter }) {
  
  // Xử lý thay đổi Checkbox (Toàn thời gian / Bán thời gian)
  const handleCheckboxChange = (typeValue) => {
    let updatedTypes = [...searchParams.types];
    if (updatedTypes.includes(typeValue)) {
      updatedTypes = updatedTypes.filter(t => t !== typeValue); // Bỏ chọn
    } else {
      updatedTypes.push(typeValue); // Thêm vào mảng
    }
    setSearchParams({ ...searchParams, types: updatedTypes });
  };

  return (
    <div className="w-[210px] bg-yellow-300 border border-slate-200/80 rounded-2xl p-3 shadow-sm space-y-4 shrink-0 hidden md:block text-left">
      <div className="flex items-center gap-1 border-b border-slate-100 pb-2">
        <Star size={12} className="text-amber-500 fill-amber-500" />
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Lọc tìm kiếm</h2>
      </div>

      {/* Địa điểm (Đồng bộ đồng nhất nếu chọn ở cả header hoặc sidebar) */}
      <div>
        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Địa điểm</label>
        <div className="relative">
          <select 
            value={searchParams.location}
            onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
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

      {/* Mức lương */}
      <div>
        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Mức lương (Triệu)</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            placeholder="Từ"
            value={searchParams.salary_from}
            onChange={(e) => setSearchParams({ ...searchParams, salary_from: e.target.value })}
            className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-1.5 py-1 bg-slate-50 outline-none focus:border-blue-500"
          />
          <span className="text-slate-400 text-xs">—</span>
          <input
            type="number"
            placeholder="Đến"
            value={searchParams.salary_to}
            onChange={(e) => setSearchParams({ ...searchParams, salary_to: e.target.value })}
            className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-1.5 py-1 bg-slate-50 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Cấp bậc */}
      <div>
        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Cấp bậc</label>
        <div className="relative">
          <select 
            value={searchParams.level}
            onChange={(e) => setSearchParams({ ...searchParams, level: e.target.value })}
            className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 appearance-none outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="Nổi bật">Nổi bật</option>
            <option value="Intern / Fresher">Intern / Fresher</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
          <ChevronDown size={11} className="text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}