import { DollarSign, MapPin, Target } from "lucide-react";
import { Link } from 'react-router-dom';

export default function Job({ job }) {
    return (
        <Link 
            to={`/jobs/${job.id}`} 
            className="block no-underline group hover:-translate-y-1 transition-all duration-300"
        >
            <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400/80 transition-all flex flex-col justify-between min-h-[175px] relative overflow-hidden bg-gradient-to-b from-white to-slate-50/30">
                
                {/* 💡 ĐIỂM NHẤN CHUYÊN NGHIỆP: Thêm một dải màu nhỏ ở góc khi hover */}
                <div className="absolute top-0 left-0 w-0 h-[3px] bg-blue-500 group-hover:w-full transition-all duration-300" />

                <div>
                    {/* Hàng đầu tiên: Logo & Tag Target */}
                    <div className="flex items-start justify-between gap-2">
                        <div className={`w-8 h-8 rounded-xl ${job.logoBg || 'bg-blue-600'} text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/10 shrink-0`}>
                            {job.company.charAt(0)}
                        </div>
                        
                        {/* 🌟 LÀM NỔI BẬT TAG TARGET: Phối màu xanh dương nhạt công nghệ */}
                        <div className="bg-blue-50 border border-blue-100 rounded-lg px-2 py-0.5 text-[9px] font-bold text-blue-600 flex items-center gap-0.5 shadow-sm">
                            <Target size={10} className="text-blue-500 animate-pulse" />
                            Đang tuyển
                        </div>
                    </div>

                    {/* Tiêu đề công việc & Tên công ty */}
                    <h3 className="font-extrabold text-slate-800 text-[13px] mt-3 group-hover:text-blue-600 transition-colors line-clamp-1 tracking-tight">
                        {job.title}
                    </h3>
                    <p className="text-[10.5px] font-bold text-slate-500 hover:text-slate-700 transition-colors mt-0.5">{job.company}</p>

                    {/* Vùng thông tin địa điểm & Mức lương */}
                    <div className="mt-2.5 space-y-1 text-[11px] text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-slate-400 shrink-0" /> 
                            <span className="line-clamp-1 text-slate-500">{job.location}</span>
                        </div>
                        
                        {/* 💰 LÀM NỔI BẬT LƯƠNG: Dùng nền xanh lục nhạt cực sang */}
                        <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50/80 border border-emerald-100 px-1.5 py-0.5 rounded-md font-bold text-[10.5px]">
                            <DollarSign size={11} className="text-emerald-600 shrink-0" /> 
                            {job.salary}
                        </div>
                    </div>
                </div>

                {/* 🏷️ HỆ THỐNG TAGS SẮC MÀU PHÂN LOẠI KĨ NĂNG */}
                <div className="mt-3.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                    {job.tags.map((tag, idx) => {
                        // Mẹo nhỏ: Đổi màu ngẫu nhiên hoặc xen kẽ cho các tag bớt nhàm chán
                        const tagStyles = [
                            'bg-violet-50 text-violet-600 border-violet-100',
                            'bg-amber-50 text-amber-600 border-amber-100',
                            'bg-indigo-50 text-indigo-600 border-indigo-100',
                            'bg-sky-50 text-sky-600 border-sky-100'
                        ];
                        const currentStyle = tagStyles[idx % tagStyles.length];

                        return (
                            <span 
                                key={idx} 
                                className={`${currentStyle} text-[9px] font-bold px-2 py-0.5 rounded-md border shadow-2xs transition-transform group-hover:scale-105`}
                            >
                                {tag}
                            </span>
                        );
                    })}
                </div>
            </div>
        </Link>
    );
}