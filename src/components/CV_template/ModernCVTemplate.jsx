import React from 'react';

// Đặt giá trị mặc định (Mock Data) cho candidateData nếu prop này bị bỏ trống
export default function ModernCVTemplate({ candidateData }) {
  
  // 🚀 NẾU KHÔNG CÓ DATA TRUYỀN VÀO, TỰ ĐỘNG LẤY DATA GIẢ ĐỂ HIỂN THỊ XEM TRƯỚC
  const data = candidateData || {
    full_name: "NGUYỄN VÀO XEM MẪU",
    title: "Lập trình viên Fullstack (Mẫu thử)",
    birthday: "01/01/2000",
    gender: "Nam",
    phone: "0987654321",
    email: "mau_cv_thu@gmail.com",
    address: "Quận 1, TP. Hồ Chí Minh",
    summary: "Đây là dữ liệu hiển thị mẫu dùng để kiểm tra giao diện template. Khi tích hợp thật, đoạn chữ này sẽ được thay thế bằng thông tin giới thiệu bản thân của chính ứng viên.",
    objective: "Trải nghiệm và kiểm tra tính năng xuất file, tối ưu hóa giao diện đồ án.",
    experience_years: 3,
    project: "- Dự án mẫu A: Xây dựng hệ thống ecommerce.\n- Dự án mẫu B: Thiết kế ứng dụng chat realtime.",
    education: "Trường Đại học Công nghệ Thông tin - Chuyên ngành Kỹ thuật Phần mềm (2018 - 2022)",
    skills: [
      { name: "ReactJS", pivot: { level: "Thành thạo" } },
      { name: "Tailwind CSS", pivot: { level: "Thành thạo" } },
      { name: "Laravel", pivot: { level: "Khá" } }
    ]
  };

  const firstLetterName = data.full_name ? data.full_name.charAt(0) : 'CV';

  return (
    // Thay toàn bộ chữ "candidateData" bên dưới thành chữ "data"
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-xl rounded-xl overflow-hidden font-sans text-slate-800 antialiased border border-slate-100 flex flex-col md:flex-row min-h-[297mm] text-left">
      
      {/* 🧭 CỘT TRÁI */}
      <div className="w-full md:w-1/3 bg-slate-900 text-slate-300 p-6 sm:p-8 space-y-6 flex flex-col">
        <div className="text-center md:text-left space-y-3 pb-4 border-b border-slate-700/50">
          <div className="w-28 h-28 mx-auto md:mx-0 rounded-full border-4 border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center">
            {data.avatar_url ? (
              <img src={data.avatar_url} alt={data.full_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-orange-500">{firstLetterName}</span>
            )}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white tracking-tight">{data.full_name}</h2>
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">{data.title}</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-orange-400 text-[11px]">Thông tin liên hệ</h3>
          <ul className="space-y-2.5 font-medium">
            <li className="flex items-center gap-2.5">📅 {data.birthday} ({data.gender})</li>
            <li className="flex items-center gap-2.5">📞 {data.phone}</li>
            <li className="flex items-center gap-2.5">✉️ {data.email}</li>
            <li className="flex items-center gap-2.5">📍 {data.address}</li>
          </ul>
        </div>

        <div className="space-y-3 text-xs flex-1">
          <h3 className="font-bold uppercase tracking-wider text-orange-400 text-[11px]">Kỹ năng chuyên môn</h3>
          <div className="flex flex-wrap gap-1.5">
            {data.skills?.map((skill, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-800 text-slate-200 font-semibold rounded-md border border-slate-700/60">
                {skill.name} <span className="text-[10px] text-orange-400">({skill.pivot?.level || 'Cơ bản'})</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 📝 CỘT PHẢI */}
      <div className="w-full md:w-2/3 p-6 sm:p-8 space-y-6 bg-slate-50/30">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
          <div className="sm:col-span-2 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Giới thiệu & Mục tiêu</h4>
            <p className="text-[11px] font-medium text-slate-600 leading-relaxed whitespace-pre-line">{data.summary}</p>
            <p className="text-[11px] font-medium text-slate-500 italic border-t border-dashed border-slate-100 pt-1.5">
              <strong className="text-slate-700 font-bold">Mục tiêu:</strong> {data.objective}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 flex flex-col items-center justify-center text-center border border-orange-100/50">
            <span className="text-2xl font-black text-orange-600">{data.experience_years}</span>
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight mt-0.5">Năm kinh nghiệm</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-1.5 h-4 bg-blue-600 rounded-xs"></span> Dự án thực hiện
          </h3>
          <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200">{data.project}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-xs"></span> Học vấn & Bằng cấp
          </h3>
          <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200">{data.education}</p>
        </div>
      </div>

    </div>
  );
}