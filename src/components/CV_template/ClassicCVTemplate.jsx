import React from 'react';

export default function ClassicCVTemplate({ candidateData }) {
  // Nếu chưa có data (gọi chạy thử độc lập), tự động lấy dữ liệu giả (Mock Data) để xem trước giao diện
  const data = candidateData || {
    full_name: "NGUYỄN MINH HOÀNG",
    title: "Chuyên Viên Phân Tích Dữ Liệu (Mẫu Cổ Điển)",
    birthday: "15/05/1999",
    gender: "Nam",
    phone: "0912.345.678",
    email: "minhhoang.classic@gmail.com",
    address: "Hoàn Kiếm, Hà Nội",
    summary: "Tôi là một người kiên trì, tỉ mỉ và có tư duy logic tốt. Với hơn 3 năm kinh nghiệm trong lĩnh vực xử lý và tối ưu hóa hệ thống dữ liệu, tôi mong muốn được đồng hành cùng sự phát triển bền vững của quý doanh nghiệp.",
    objective: "Cống hiến năng lực phân tích để tối ưu hóa quy trình vận hành, đặt mục tiêu trở thành Trưởng nhóm nghiên cứu dữ liệu trong 2 năm tới.",
    experience_years: 3,
    project: "[06/2024 - Hiện tại] TẬP ĐOÀN CÔNG NGHỆ ĐA QUỐC GIA\n- Chịu trách nhiệm thiết kế và quản lý kiến trúc kho dữ liệu tập trung.\n- Tối ưu hóa các câu lệnh truy vấn phức tạp, giúp tăng 40% tốc độ truy xuất báo cáo.\n- Phối hợp với phòng ban vận hành để dự báo xu hướng thị trường hàng quý.",
    education: "Trường Đại học Bách Khoa Hà Nội (2017 - 2021)\nChuyên ngành: Hệ thống thông tin | Tốt nghiệp loại Giỏi (GPA: 3.4/4.0)",
    contact_reference: "Phùng Thế Anh - Trưởng phòng Dữ liệu tại Công ty ABC (SĐT: 0909.123.456)",
    skills: [
      { name: "SQL Server", pivot: { level: "Chuyên gia" } },
      { name: "Python Data Science", pivot: { level: "Thành thạo" } },
      { name: "Power BI", pivot: { level: "Thành thạo" } },
      { name: "Excel Advanced", pivot: { level: "Thành thạo" } }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-xl p-10 sm:p-12 font-serif text-slate-900 antialiased border border-slate-200 min-h-[297mm] text-left">
      
      {/* 🏷️ 1. PHẦN ĐẦU CV (HEADER) - CĂN GIỮA TRANG CHUẨN CỔ ĐIỂN */}
      <div className="text-center space-y-2 pb-6 border-b-2 border-slate-800">
        <h1 className="text-3xl font-bold tracking-wide uppercase text-slate-900">{data.full_name}</h1>
        <p className="text-sm font-medium tracking-widest text-slate-600 uppercase">{data.title}</p>
        
        {/* Khối thông tin liên hệ dàn hàng ngang chia nhau bằng dấu gạch đứng */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-700 font-medium pt-1">
          <span>📅 {data.birthday} ({data.gender})</span>
          <span className="text-slate-300">|</span>
          <span>📞 {data.phone}</span>
          <span className="text-slate-300">|</span>
          <span>✉️ {data.email}</span>
          <span className="text-slate-300">|</span>
          <span>📍 {data.address}</span>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        
        {/* 📝 2. TÓM TẮT & MỤC TIÊU */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            Giới thiệu & Mục tiêu nghề nghiệp
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed space-y-2 text-justify">
            <p className="indent-6">{data.summary}</p>
            <p className="italic"><strong className="font-bold text-slate-900 not-italic">Mục tiêu:</strong> {data.objective}</p>
            <p className="text-[11px] font-semibold text-slate-600">Tổng thời gian tích lũy kinh nghiệm thực chiến: {data.experience_years} năm.</p>
          </div>
        </div>

        {/* 💼 3. KINH NGHIỆM LÀM VIỆC & DỰ ÁN (PROJECT) */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            Kinh nghiệm làm việc & Dự án tiêu biểu
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line text-justify pl-1">
            {data.project}
          </div>
        </div>

        {/* 🎓 4. HỌC VẤN & BẰNG CẤP (EDUCATION) */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            Học vấn & Bằng cấp
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line text-justify pl-1">
            {data.education}
          </div>
        </div>

        {/* 🛠️ 5. KỸ NĂNG CHUYÊN MÔN (Có hiển thị cột LEVEL) */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            Kỹ năng chuyên môn
          </h3>
          {/* Mẫu cổ điển sẽ liệt kê dạng danh sách dòng hoặc dấu chấm tròn thanh lịch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs text-slate-700 pl-4 list-disc">
            {data.skills?.map((skill, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-1">
                <span className="font-medium flex items-center gap-1.5">
                  <span className="text-slate-400 text-[8px]">●</span> {skill.name}
                </span>
                <span className="text-[11px] italic text-slate-500 font-semibold">
                  Mức độ: {skill.pivot?.level || 'Cơ bản'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 📞 6. NGƯỜI THAM CHIẾU (CONTACT_REFERENCE) */}
        {data.contact_reference && (
          <div className="space-y-2 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Người xác nhận thông tin (Reference)
            </h3>
            <p className="text-xs text-slate-600 italic leading-relaxed whitespace-pre-line pl-1">
              {data.contact_reference}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}