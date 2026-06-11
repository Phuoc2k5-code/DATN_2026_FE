import React from 'react';

export default function ClassicCVTemplate({ candidateData }) {
  // Nếu chưa có data (gọi chạy thử độc lập), tự động lấy dữ liệu giả (Mock Data) để xem trước giao diện
  const data = candidateData || {
    full_name: "NGUYỄN MINH HOÀNG",
    title: "Chuyên Viên Phân Tích Dữ Liệu (Mẫu Cổ Điển)",
    birthday: "1999-05-15", // Để định dạng chuẩn y như DB để test tính năng format ngày tháng
    gender: "Nam",
    phone: "0912.345.678",
    email: "minhhoang.classic@gmail.com",
    address: "Hoàn Kiếm, Hà Nội",
    summary: "Tôi là một người kiên trì, tỉ mỉ và có tư duy logic tốt. Với hơn 3 năm kinh nghiệm trong lĩnh vực xử lý và tối ưu hóa hệ thống dữ liệu, tôi mong muốn được đồng hành cùng sự phát triển bền vững của quý doanh nghiệp.",
    objective: "Cống hiến năng lực phân tích để tối ưu hóa quy trình vận hành, đặt mục tiêu trở thành Trưởng nhóm nghiên cứu dữ liệu trong 2 năm tới.",
    experience_years: 3,
    project: [
      {
        project_name: "TẬP ĐOÀN CÔNG NGHỆ ĐA QUỐC GIA",
        duration: "06/2024 - Hiện tại",
        role: "Chuyên viên xử lý dữ liệu chính",
        description: "- Chịu trách nhiệm thiết kế và quản lý kiến trúc kho dữ liệu tập trung.\n- Tối ưu hóa các câu lệnh truy vấn phức tạp, giúp tăng 40% tốc độ truy xuất báo cáo.\n- Phối hợp với phòng ban vận hành để dự báo xu hướng thị trường hàng quý."
      }
    ],
    education: "Trường Đại học Bách Khoa Hà Nội (2017 - 2021)\nChuyên ngành: Hệ thống thông tin | Tốt nghiệp loại Giỏi (GPA: 3.4/4.0)",
    // Đã sửa Mock Data thành dạng cấu trúc mảng để test giao diện
    contact_reference: [
      {
        name: "Phùng Thế Anh",
        relationship: "Trưởng phòng Dữ liệu tại Công ty ABC",
        phone: "0909.123.456"
      }
    ],
    skills: [
      { name: "SQL Server", pivot: { level: "Chuyên gia" } },
      { name: "Python Data Science", pivot: { level: "Thành thạo" } },
      { name: "Power BI", pivot: { level: "Thành thạo" } },
      { name: "Excel Advanced", pivot: { level: "Thành thạo" } }
    ]
  };

  // Hàm hỗ trợ định dạng ngày sinh chuẩn Việt Nam
  const formatBirthday = (dateStr) => {
    if (!dateStr) return 'Chưa cập nhật';
    // Nếu là định dạng DD/MM/YYYY sẵn của mock cũ thì giữ nguyên
    if (dateStr.includes('/') && !dateStr.includes('T')) return dateStr;
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-xl p-10 sm:p-12 font-['Times_New_Roman',_Times,_serif] text-slate-900 antialiased border border-slate-200 min-h-[297mm] text-left">
      {/* 🏷️ 1. PHẦN ĐẦU CV (HEADER) - CĂN GIỮA TRANG CHUẨN CỔ ĐIỂN */}
      <div className="text-center space-y-2 pb-6 border-b-2 border-slate-800">
        <h1 className="text-3xl font-bold tracking-wide uppercase text-slate-900">{data.full_name}</h1>
        <p className="text-sm font-medium tracking-widest text-slate-600 uppercase">{data.title}</p>

        {/* Khối thông tin liên hệ dàn hàng ngang chia nhau bằng dấu gạch đứng */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-700 font-medium pt-1">
          <span>📅 {formatBirthday(data.birthday)} ({data.gender || 'Khác'})</span>
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
          <h3 className="text-sm font-bold uppercase tracking-normal text-slate-900 border-b border-slate-300 pb-1">
            Giới thiệu & Mục tiêu nghề nghiệp
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed space-y-2 text-justify">
            <p className="italic"><strong className="font-bold text-slate-900 not-italic">Giới thiệu: </strong>{data.summary}</p>
            <p className="italic"><strong className="font-bold text-slate-900 not-italic">Mục tiêu:</strong> {data.objective}</p>
            <p className="text-[11px] font-semibold text-slate-600">Tổng thời gian tích lũy kinh nghiệm thực chiến: {data.experience_years} năm.</p>
          </div>
        </div>

        {/* 💼 3. KINH NGHIỆM LÀM VIỆC & DỰ ÁN (PROJECT) */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-normal text-slate-900 border-b border-slate-300 pb-1">
            Kinh nghiệm làm việc & Dự án tiêu biểu
          </h3>
          <div className="pl-4 border-l-2 border-slate-200 space-y-4 mt-2">
            {(() => {
              let projectArray = [];
              try {
                projectArray = typeof data.project === 'string' ? JSON.parse(data.project) : data.project;
              } catch (e) {
                projectArray = [];
              }

              if (!Array.isArray(projectArray) || projectArray.length === 0) {
                return <p className="text-xs text-slate-400 italic">Chưa có thông tin dự án.</p>;
              }

              return projectArray.map((proj, idx) => (
                // Sửa thành text-left để tiêu đề không bao giờ bị dãn rộng khoảng cách chữ vô lý
                <div key={idx} className="text-xs space-y-1 text-left">
                  <div className="flex justify-between items-baseline font-bold text-slate-900 text-[13px] gap-4">
                    {/* Giới hạn max-width và bẻ chữ chống tràn lấn vỡ layout sang phần ngày tháng */}
                    <h4 className="break-words max-w-[75%]">
                      {proj.project_name ? proj.project_name.toUpperCase() : 'TÊN DỰ ÁN'}
                    </h4>
                    {proj.duration && (
                      <span className="text-[11px] font-normal italic shrink-0">({proj.duration})</span>
                    )}
                  </div>

                  {/* Vị trí chuyên môn chữ nghiêng tối giản lịch sự */}
                  {proj.role && (
                    <p className="text-[11px] text-slate-700 italic font-medium">Vị trí: {proj.role}</p>
                  )}

                  {/* Phần mô tả dự án - Chỉ căn justify tại đây giúp đoạn văn đều đặn đẹp mắt */}
                  {proj.description && (
                    <p className="text-slate-600 leading-relaxed mt-1 text-justify break-words whitespace-pre-line pl-1">
                      {proj.description}
                    </p>
                  )}
                </div>
              ));
            })()}
          </div>
        </div>

        {/* 🎓 4. HỌC VẤN & BẰNG CẤP (EDUCATION) */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-normal text-slate-900 border-b border-slate-300 pb-1">
            Học vấn & Bằng cấp
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line text-justify pl-1">
            {data.education}
          </div>
        </div>

        {/* 🛠️ 5. KỸ NĂNG CHUYÊN MÔN */}
        <div className="space-y-2">
          {/* FIX: Đã sửa tên tiêu đề đúng logic nghiệp vụ của mục */}
          <h3 className="text-sm font-bold uppercase tracking-normal text-slate-900 border-b border-slate-300 pb-1">
            Kỹ năng chuyên môn
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs text-slate-700 pl-4">
            {data.skills?.map((skill, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-1">
                <span className="font-medium flex items-center gap-1.5">
                  <span className="text-slate-400 text-[8px]">●</span> {skill.name} ({skill.pivot?.level || 'Cơ bản'})
                </span>               
              </div>
            ))}
          </div>
        </div>

        {/* 📞 6. NGƯỜI THAM CHIẾU (CONTACT_REFERENCE) */}
        {data.contact_reference && (
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-normal text-slate-900 border-b border-slate-300 pb-1 flex items-center gap-2">
              🤝 Người xác nhận thông tin (Reference)
            </h3>

            <div className="pl-1 space-y-3">
              {(() => {
                let referenceData = null;
                let isJson = false;

                try {
                  if (typeof data.contact_reference === 'string') {
                    if (data.contact_reference.trim().startsWith('{') || data.contact_reference.trim().startsWith('[')) {
                      referenceData = JSON.parse(data.contact_reference);
                      isJson = true;
                    }
                  } else {
                    referenceData = data.contact_reference;
                    isJson = true;
                  }
                } catch (e) {
                  isJson = false;
                }

                // Phòng hờ: Nếu là string thuần túy không phải JSON
                if (!isJson && typeof data.contact_reference === 'string') {
                  return <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{data.contact_reference}</p>;
                }

                // Trường hợp 1: Nếu là mảng (Array) nhiều người xác nhận từ dữ liệu JSON cấu trúc mới
                if (Array.isArray(referenceData) && referenceData.length > 0) {
                  return referenceData.map((ref, idx) => (
                    <div key={idx} className="text-xs text-slate-600 space-y-0.5 border-l-2 border-slate-300 pl-3 py-0.5">
                      <p className="font-bold text-slate-800 text-[13px]">{ref.name || 'Họ và tên'}</p>
                      {ref.relationship && <p className="text-amber-700 font-medium italic">Mối quan hệ: {ref.relationship}</p>}
                      {ref.phone && <p className="text-slate-500 font-sans">SĐT: {ref.phone}</p>}
                    </div>
                  ));
                }

                // Trường hợp 2: Nếu là một Object đơn lẻ (Single Object) từ JSON cấu trúc mới
                if (referenceData && typeof referenceData === 'object' && referenceData.name) {
                  return (
                    <div className="text-xs text-slate-600 space-y-0.5 border-l-2 border-slate-300 pl-3 py-0.5">
                      <p className="font-bold text-slate-800 text-[13px]">{referenceData.name}</p>
                      {referenceData.relationship && <p className="text-amber-700 font-medium italic">Mối quan hệ: {referenceData.relationship}</p>}
                      {referenceData.phone && <p className="text-slate-500 font-sans">SĐT: {referenceData.phone}</p>}
                    </div>
                  );
                }

                return <p className="text-xs text-slate-400 italic">Chưa có thông tin người xác nhận.</p>;
              })()}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}