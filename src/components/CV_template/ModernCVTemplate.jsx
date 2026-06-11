import React from 'react';

export default function ModernCVTemplate({ candidateData }) {
  // 🚀 ĐỒNG BỘ MOCK DATA SANG DẠNG MẢNG ĐỂ HIỂN THỊ XEM TRƯỚC MƯỢT MÀ, KHÔNG BỊ TRỐNG
  const data = candidateData || {
    full_name: "NGUYỄN VÀO XEM MẪU",
    title: "Lập trình viên Fullstack (Mẫu thử)",
    birthday: "2000-01-01",
    gender: "Nam",
    phone: "0987.654.321",
    email: "mau_cv_thu@gmail.com",
    address: "Quận 1, TP. Hồ Chí Minh",
    summary: "Tôi là một kỹ sư phần mềm có nền tảng vững chắc về cả Frontend lẫn Backend, với hơn 3 năm kinh nghiệm thực chiến phát triển hệ thống. Bản thân luôn hướng tới việc tối ưu hóa hiệu năng dòng code và tạo ra trải nghiệm người dùng cuối tốt nhất.",
    objective: "Trải nghiệm và kiểm tra tính năng xuất file, tối ưu hóa giao diện đồ án doanh nghiệp toàn diện.",
    experience_years: 3,
    project: [
      {
        project_name: "HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ ECOMMERCE",
        duration: "2024 - Hiện tại",
        role: "Fullstack Developer",
        description: "- Thiết kế cơ sở dữ liệu hệ thống, trực tiếp tối ưu các câu lệnh truy vấn phức tạp giảm tải 30% thời gian phản hồi server.\n- Xây dựng giao diện trang Dashboard quản trị tinh gọn, dễ thao tác sử dụng ReactJS và Tailwind CSS."
      },
      {
        project_name: "ỨNG DỤNG CHAT REALTIME NỘI BỘ",
        duration: "2023",
        role: "Backend Developer",
        description: "- Triển khai kết nối Socket.io xử lý đồng bộ luồng tin nhắn lập tức cho hơn 1000 người dùng hoạt động cùng thời điểm."
      }
    ],
    education: "Trường Đại học Công nghệ Thông tin - ĐHQG TP.HCM\nChuyên ngành: Kỹ thuật Phần mềm (2018 - 2022)",
    contact_reference: [
      {
        name: "Anh Phạm Minh Hoàng",
        relationship: "Technical Leader tại Tech Corp",
        phone: "0909.888.777"
      }
    ],
    skills: [
      { name: "ReactJS", pivot: { level: "Thành thạo" } },
      { name: "Tailwind CSS", pivot: { level: "Thành thạo" } },
      { name: "Laravel", pivot: { level: "Khá" } },
      { name: "NodeJS / Express", pivot: { level: "Khá" } }
    ]
  };

  const firstLetterName = data.full_name ? data.full_name.charAt(0) : 'CV';

  // Hàm hỗ trợ định dạng ngày sinh chuẩn Việt Nam
  const formatBirthday = (dateStr) => {
    if (!dateStr) return 'Chưa cập nhật';
    if (dateStr.includes('/') && !dateStr.includes('T')) return dateStr;
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-xl rounded-xl overflow-hidden font-sans text-slate-800 antialiased border border-slate-100 flex flex-col md:flex-row min-h-[297mm] text-left">
      
      {/* 🧭 CỘT TRÁI - KHỐI THÔNG TIN BÊN LỀ */}
      <div className="w-full md:w-1/3 bg-slate-900 text-slate-300 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Khối Avatar */}
          <div className="text-center md:text-left space-y-3 pb-4 border-b border-slate-700/50">
            <div className="w-28 h-28 mx-auto md:mx-0 rounded-full border-4 border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center">
              {data.avatar_url ? (
                <img src={`http://127.0.0.1:8000/${data.avatar_url}`} alt={data.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-orange-500">{firstLetterName}</span>
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold !text-white tracking-normal uppercase">{data.full_name}</h2>
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-normal">{data.title}</p>
            </div>
          </div>

          {/* Thông tin cá nhân liên hệ */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-normal text-orange-400 text-[11px]">Thông tin liên hệ</h3>
            <ul className="space-y-2.5 font-medium text-slate-300">
              <li className="flex items-center gap-2.5">📅 <span>{formatBirthday(data.birthday)} ({data.gender || 'Nam'})</span></li>
              <li className="flex items-center gap-2.5">📞 <span>{data.phone}</span></li>
              <li className="flex items-center gap-2.5">✉️ <span className="break-all">{data.email}</span></li>
              <li className="flex items-center gap-2.5">📍 <span>{data.address}</span></li>
            </ul>
          </div>

          {/* Kỹ năng chuyên môn */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-normal text-orange-400 text-[11px]">Kỹ năng chuyên môn</h3>
            <div className="flex flex-wrap gap-1.5">
              {data.skills?.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-800 text-slate-200 font-semibold rounded-md border border-slate-700/60 inline-flex items-center gap-1">
                  {skill.name} <span className="text-[10px] text-orange-400">({skill.pivot?.level || 'Cơ bản'})</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 🤝 KHU VỰC XÁC MINH (CONTACT REFERENCE) NẰM ĐÁY CỘT TRÁI */}
        {data.contact_reference && (
          <div className="space-y-2 pt-4 border-t border-slate-700/50 text-xs">
            <h3 className="font-bold uppercase tracking-normal text-orange-400 text-[11px]">Người xác nhận</h3>
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

              // Phòng hờ nếu admin nhập dạng văn bản chuỗi cũ tự do
              if (!isJson && typeof data.contact_reference === 'string') {
                return <p className="text-slate-400 italic whitespace-pre-line leading-relaxed text-[11px]">{data.contact_reference}</p>;
              }

              if (Array.isArray(referenceData) && referenceData.length > 0) {
                return referenceData.map((ref, idx) => (
                  <div key={idx} className="text-[11px] text-slate-300 space-y-0.5">
                    <p className="font-bold text-white">{ref.name}</p>
                    {ref.relationship && <p className="text-slate-400 italic text-[10px]">{ref.relationship}</p>}
                    {ref.phone && <p className="text-orange-400/90 font-sans">SĐT: {ref.phone}</p>}
                  </div>
                ));
              }

              if (referenceData && typeof referenceData === 'object' && referenceData.name) {
                return (
                  <div className="text-[11px] text-slate-300 space-y-0.5">
                    <p className="font-bold text-white">{referenceData.name}</p>
                    {referenceData.relationship && <p className="text-slate-400 italic text-[10px]">{referenceData.relationship}</p>}
                    {referenceData.phone && <p className="text-orange-400/90 font-sans">SĐT: {referenceData.phone}</p>}
                  </div>
                );
              }

              return <p className="text-slate-500 italic text-[11px]">Chưa có thông tin.</p>;
            })()}
          </div>
        )}
      </div>

      {/* 📝 CỘT PHẢI - NỘI DUNG CHÍNH CHI TIẾT */}
      <div className="w-full md:w-2/3 p-6 sm:p-8 space-y-6 bg-slate-50/30 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Khối Giới thiệu & Mục tiêu */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
            <div className="sm:col-span-2 space-y-2 text-left">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-normal">Giới thiệu & Mục tiêu</h4>
              <p className="text-[11px] font-medium text-slate-600 leading-relaxed text-justify break-words">{data.summary}</p>
              <p className="text-[11px] font-medium text-slate-500 italic border-t border-dashed border-slate-100 pt-1.5 break-words">
                <strong className="text-slate-700 font-bold not-italic">Mục tiêu chiến lược:</strong> {data.objective}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 flex flex-col items-center justify-center text-center border border-orange-100/50 shrink-0">
              <span className="text-2xl font-black text-orange-600">{data.experience_years}</span>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight mt-0.5">Năm kinh nghiệm</span>
            </div>
          </div>

          {/* Dự án thực hiện thực tế */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <span className="w-1.5 h-4 bg-blue-600 rounded-xs"></span> Dự án thực hiện
            </h3>
            
            {/* Sửa khung bọc từ text-justify thành text-left để tiêu đề luôn chuẩn chỉ */}
            <div className="pl-4 border-l-2 border-slate-200 space-y-4 text-left">
              {(() => {
                let projectArray = [];
                try {
                  projectArray = typeof data.project === 'string' ? JSON.parse(data.project) : data.project;
                } catch (e) {
                  projectArray = [];
                }

                // Nếu database trả về text chuỗi thô (mẫu dữ liệu cũ tự gõ), render an toàn chống lỗi crash
                if (!Array.isArray(projectArray) && typeof data.project === 'string') {
                  return <p className="text-xs text-slate-600 leading-relaxed text-justify whitespace-pre-line break-words">{data.project}</p>;
                }

                if (!Array.isArray(projectArray) || projectArray.length === 0) {
                  return <p className="text-xs text-slate-400 italic">Chưa có thông tin dự án.</p>;
                }

                return projectArray.map((proj, idx) => (
                  <div key={idx} className="text-xs font-medium text-slate-600 space-y-1">
                    <div className="flex justify-between items-baseline gap-4">
                      {/* Áp dụng max-width và break-words chống lỗi kéo dãn chữ ngang hàng */}
                      <h4 className="font-bold text-slate-900 text-[13px] break-words max-w-[75%]">
                        Dự án: {proj.project_name || 'Tên dự án'}
                      </h4>
                      {proj.duration && (
                        <span className="text-[10px] text-slate-400 italic shrink-0">({proj.duration})</span>
                      )}
                    </div>
                    {proj.role && (
                      <p className="text-[11px] text-orange-600 font-semibold uppercase tracking-wide">Vị trí: {proj.role}</p>
                    )}
                    {proj.description && (
                      // Chỉ áp dụng text-justify độc quyền tại đây giúp các dòng mô tả đều và đẹp
                      <p className="text-slate-500 leading-relaxed mt-1 text-justify break-words whitespace-pre-line pl-1">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ));
              })()}
            </div>
          </div>

        </div>

        {/* Khối Học vấn ép cố định dưới góc */}
        <div className="space-y-3 pt-4 border-t border-slate-200/60 text-left">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 pb-1">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-xs"></span> Học vấn & Bằng cấp
          </h3>
          <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200 break-words">
            {data.education}
          </p>
        </div>

      </div>

    </div>
  );
}