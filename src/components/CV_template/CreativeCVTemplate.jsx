import React from 'react';

export default function CreativeCVTemplate({ candidateData }) {
  // Đồng bộ hóa Mock Data sang định dạng mảng cấu trúc để chạy thử độc lập mượt mà
  const data = candidateData || {
    full_name: "HOÀNG NGUYỄN LÂM PHONG",
    title: "Creative Marketing Specialist",
    birthday: "2000-08-12",
    gender: "Nam",
    phone: "0933.111.222",
    email: "lamphong.creative@gmail.com",
    address: "Bình Thạnh, TP. Hồ Chí Minh",
    summary: "Là một người đam mê sáng tạo, luôn tìm kiếm những góc nhìn mới lạ để giải quyết bài toán thương hiệu. Với 2 năm kinh nghiệm thực chiến, tôi tự tin có thể tối ưu hóa nội dung chiến dịch và mang lại sự tăng trưởng đột phá trên các nền tảng số.",
    objective: "Trở thành một Campaign Manager dẫn dắt các chiến dịch truyền thông sáng tạo lớn cho các nhãn hàng F&B hàng đầu.",
    experience_years: 2,
    project: [
      {
        project_name: "AGENCY TRUYỀN THÔNG X-MEDIA",
        duration: "01/2024 - Hiện tại",
        role: "Creative Content",
        description: "- Lên ý tưởng và triển khai chiến dịch Social Media cho nhãn hàng 'Chill Beer', đạt hơn 1M lượt tiếp cận tự nhiên trong 1 tháng.\n- Quản lý ngân sách quảng cáo 200 triệu/tháng, tối ưu hóa chi phí trên mỗi chuyển đổi (CPA) giảm 25%.\n- Biên tập nội dung, kịch bản video ngắn xu hướng đạt trung bình 500k views/video."
      },
      {
        project_name: "THỰC TẬP SINH NỘI DUNG TẠI EMPIRE GROUP",
        duration: "2023",
        role: "Intern Content Creator",
        description: "- Hỗ trợ xây dựng kế hoạch nội dung hàng tuần trên Fanpage và Tiktok."
      }
    ],
    education: "Trường Đại học Kinh tế TP.HCM (UEH) | 2018 - 2022\nChuyên ngành: Truyền thông đa phương tiện - GPA: 3.1 / 4.0",
    contact_reference: [
      {
        name: "Nguyễn Tú Oanh",
        relationship: "Trưởng phòng Account tại X-Media",
        phone: "0988.777.666"
      }
    ],
    skills: [
      { name: "Content Strategy", pivot: { level: "Chuyên gia" } },
      { name: "Facebook/Tiktok Ads", pivot: { level: "Thành thạo" } },
      { name: "Video Editing (Capcut/Premiere)", pivot: { level: "Khá" } },
      { name: "Data Analysis (GA4)", pivot: { level: "Cơ bản" } }
    ]
  };

  const initialName = data.full_name ? data.full_name.charAt(0) : "C";

  // Hàm định dạng ngày sinh
  const formatBirthday = (dateStr) => {
    if (!dateStr) return 'Chưa cập nhật';
    if (dateStr.includes('/') && !dateStr.includes('T')) return dateStr;
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-2xl rounded-3xl overflow-hidden font-sans text-slate-800 antialiased border border-slate-100 min-h-[297mm] text-left flex flex-col md:flex-row">

      {/* 💥 CỘT SIDEBAR TRÁI - KHỐI MÀU NỔI BẬT */}
      <div className="w-full md:w-5/12 bg-indigo-950 text-indigo-100 p-8 flex flex-col justify-between space-y-8">
        <div>
          {/* Avatar Phá Cách */}
          <div className="relative w-28 h-28 mx-auto md:mx-0 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl rotate-3 overflow-hidden shadow-lg flex items-center justify-center mb-6">
            <div className="-rotate-3 w-full h-full flex items-center justify-center">
              {data.avatar_url ? (
                <img src={`http://127.0.0.1:8000/${data.avatar_url}`} alt={data.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-black text-white">{initialName}</span>
              )}
            </div>
          </div>

          {/* Tên & Vị trí ứng tuyển */}
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-black !text-white tracking-normal leading-tight uppercase">{data.full_name}</h2>
            <p className="inline-block px-3 py-1 bg-amber-400 text-indigo-950 text-[10px] font-black rounded-lg uppercase tracking-wider">
              {data.title}
            </p>
          </div>

          {/* Thông tin liên hệ */}
          <div className="mt-8 space-y-4 text-xs">
            <h3 className="text-xs font-black uppercase tracking-normal text-amber-400 border-b border-indigo-800 pb-1.5">Kết nối</h3>
            <ul className="space-y-3 font-medium text-indigo-200">
              <li className="flex items-center gap-3">📅 <span className="text-white">{formatBirthday(data.birthday)} ({data.gender || 'Nam'})</span></li>
              <li className="flex items-center gap-3">📞 <span className="text-white">{data.phone}</span></li>
              <li className="flex items-center gap-3">✉️ <span className="text-white break-all">{data.email}</span></li>
              <li className="flex items-center gap-3">📍 <span className="text-white">{data.address}</span></li>
            </ul>
          </div>
        </div>

        {/* Người tham chiếu ở đáy Sidebar - Đã fix an toàn lỗi render */}
        {data.contact_reference && (
          <div className="text-xs space-y-2 pt-6 border-t border-indigo-900">
            <h3 className="font-black uppercase tracking-normal text-amber-400 text-[10px]">Xác minh</h3>
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

              // Phòng hờ nếu là text thuần không phải JSON mảng
              if (!isJson && typeof data.contact_reference === 'string') {
                return <p className="text-indigo-300/90 italic leading-relaxed whitespace-pre-line font-medium text-[11px]">{data.contact_reference}</p>;
              }

              if (Array.isArray(referenceData) && referenceData.length > 0) {
                return referenceData.map((ref, idx) => (
                  <div key={idx} className="space-y-0.5 text-indigo-200 text-[11px]">
                    <p className="font-bold text-white text-xs">{ref.name}</p>
                    {ref.relationship && <p className="text-amber-400/90 italic">{ref.relationship}</p>}
                    {ref.phone && <p className="text-indigo-300">SĐT: {ref.phone}</p>}
                  </div>
                ));
              }

              if (referenceData && typeof referenceData === 'object' && referenceData.name) {
                return (
                  <div className="space-y-0.5 text-indigo-200 text-[11px]">
                    <p className="font-bold text-white text-xs">{referenceData.name}</p>
                    {referenceData.relationship && <p className="text-amber-400/90 italic">{referenceData.relationship}</p>}
                    {referenceData.phone && <p className="text-indigo-300">SĐT: {referenceData.phone}</p>}
                  </div>
                );
              }

              return <p className="text-indigo-400 italic">Chưa có thông tin.</p>;
            })()}
          </div>
        )}
      </div>

      {/* 📝 CỘT NỘI DUNG PHẢI - THÔNG TIN CHI TIẾT */}
      <div className="w-full md:w-7/12 p-8 sm:p-10 space-y-8 bg-slate-50/50 flex flex-col justify-between">
        <div className="space-y-8">

          {/* Giới thiệu & Số năm kinh nghiệm lồng ghép */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs relative overflow-hidden">
            <div className="absolute right-0 top-0 bg-orange-500 text-white font-black text-xs px-4 py-1.5 rounded-bl-xl shadow-xs">
              {data.experience_years} Năm KN
            </div>
            <h3 className="text-xs font-black text-indigo-950 uppercase tracking-normal mb-2">Về bản thân tôi</h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed text-justify whitespace-pre-line pr-12">
              {data.summary}
            </p>
            <p className="text-xs text-slate-500 italic mt-2 pt-2 border-t border-dashed border-slate-100">
              <span className="font-bold text-indigo-950 not-italic">Định hướng:</span> {data.objective}
            </p>
          </div>

          {/* 💼 KINH NGHIỆM LÀM VIỆC & DỰ ÁN (PROJECT) */}
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
                  // FIX 1: Đổi từ 'text-justify' thành 'text-left' ở khung bọc để tiêu đề không bao giờ bị giãn chữ bậy bạ
                  <div key={idx} className="text-xs space-y-1 text-left">

                    {/* FIX 2: Thêm gap-4 và break-words để xử lý những từ siêu dài không đè lên phần hiển thị thời gian */}
                    <div className="flex justify-between items-baseline font-bold text-slate-900 text-[13px] gap-4">
                      <h4 className="break-words max-w-[75%]">
                        Dự án: {proj.project_name || 'Tên dự án'}
                      </h4>
                      {proj.duration && (
                        <span className="text-[11px] font-normal italic shrink-0">({proj.duration})</span>
                      )}
                    </div>

                    {/* Vị trí */}
                    {proj.role && (
                      <p className="text-[11px] text-slate-700 italic font-medium">Vị trí: {proj.role}</p>
                    )}

                    {/* Mô tả dự án */}
                    {proj.description && (
                      // FIX 3: Chỉ đặt 'text-justify' ĐỘC QUYỀN tại phần nội dung mô tả này thui bro nhé!
                      <p className="text-slate-600 leading-relaxed mt-1 whitespace-pre-line pl-2 text-justify break-words">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Học vấn */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-indigo-950 uppercase tracking-normal flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></span> Học vấn học thuật
            </h3>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-medium pl-4 border-l-2 border-slate-200">
              {data.education}
            </div>
          </div>
        </div>

        {/* Khối Kỹ năng xếp gọn gàng dưới đáy */}
        <div className="space-y-3 pt-4 border-t border-slate-200/60">
          <h3 className="text-xs font-black text-indigo-950 uppercase tracking-normal">Kỹ năng đặc sắc</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills?.map((skill, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-950 font-bold text-[11px] rounded-xl border border-indigo-100 flex items-center gap-1.5 shadow-2xs">
                ⚡ {skill.name}
                <span className="text-[10px] text-orange-600 font-black bg-white px-1.5 py-0.5 rounded-md border border-indigo-100/50">
                  {skill.pivot?.level || 'Cơ bản'}
                </span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}