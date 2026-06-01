import { ChevronDown, MapPin, Briefcase, Star } from "lucide-react";
import { useState } from "react";
export default function SidebarLeft() {
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    return (
        <div className="w-[210px] bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm space-y-4 shrink-0 hidden md:block">
            <div className="flex items-center gap-1 border-b border-slate-100 pb-2">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Lọc tìm kiếm</h2>
            </div>

            {/* Địa điểm */}
            <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Địa điểm</label>
                <div className="relative">
                    <select className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 appearance-none outline-none focus:border-blue-500 cursor-pointer">
                        <option>Hà Nội (Cầu Giấy)</option>
                        <option>TP. Hồ Chí Minh</option>
                        <option>Đà Nẵng</option>
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
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                        className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-1.5 py-1 bg-slate-50 outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400 text-xs">—</span>
                    <input
                        type="number"
                        placeholder="Đến"
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                        className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-1.5 py-1 bg-slate-50 outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Loại hình */}
            <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Loại hình</label>
                <div className="space-y-1 mt-1 text-[11px] text-slate-600">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3 w-3" />
                        <span>Toàn thời gian</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3 w-3" />
                        <span>Bán thời gian</span>
                    </label>
                </div>
            </div>

            {/* Cấp bậc */}
            <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Cấp bậc</label>
                <div className="relative">
                    <select className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 appearance-none outline-none focus:border-blue-500 cursor-pointer">
                        <option>Nổi bật</option>
                        <option>Intern / Fresher</option>
                        <option>Junior</option>
                        <option>Senior</option>
                    </select>
                    <ChevronDown size={11} className="text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>
            </div>
        </div>
    )
}