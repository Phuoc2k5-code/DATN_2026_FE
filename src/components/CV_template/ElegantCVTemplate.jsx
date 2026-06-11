import React from 'react';

export default function ElegantCVTemplate({ candidateData }) {
  // Dữ liệu giả (Mock Data) chuẩn cấu trúc Database để hiển thị độc lập mượt mà
  const data = candidateData || {
    full_name: "TRẦN THUỲ LINH",
    title: "UI/UX Designer & Frontend Developer",
    birthday: "22/11/2001",
    gender: "Nữ",
    phone: "0945.888.999",
    email: "thuylinh.design@gmail.com",
    address: "Quận 3, TP. Hồ Chí Minh",
    summary: "Tôi là một nhà phát triển giao diện đam mê tạo ra những trải nghiệm người dùng tinh tế, mượt mà. Sự kết hợp giữa tư duy thẩm mỹ UI/UX và năng lực lập trình Frontend giúp tôi tối ưu hóa sản phẩm từ bản vẽ ý tưởng đến dòng code thực tế một cách toàn diện.",
    objective: "Thử thách bản thân ở những dự án sản phẩm công nghệ quy mô lớn, hướng tới vị trí Product Design Lead.",
    experience_years: 2,
    project: [
      {
        project_name: "HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ SMART-SHOP",
        duration: "2024 - Hiện tại",
        role: "UI/UX Designer & Frontend Developer",
        description: "- Thiết kế toàn bộ luồng trải nghiệm người dùng (User Flow) và giao diện Wireframe/Mockup.\n- Trực tiếp lập trình các Component cốt lõi bằng ReactJS và Tailwind CSS, đảm bảo tính responsive tuyệt đối.\n- Phối hợp kiểm thử A/B Testing để tối ưu tỷ lệ chuyển đổi đơn hàng tăng 15%."
      },
      {
        project_name: "ỨNG DỤNG THEO DÕI SỨC KHỎE E-HEALTH",
        duration: "2023",
        role: "Product Designer",
        description: "- Thiết kế giao diện Dark Mode/Light Mode thân thiện với người dùng.\n- Đóng gói thư viện UI Component dùng chung cho đội ngũ phát triển."
      }
    ],
    education: "Trường Đại học Kiến trúc TP.HCM (2019 - 2023)\nChuyên ngành: Thiết kế Đồ họa Kỹ thuật số | Tốt nghiệp loại Giỏi",
    contact_reference: [
      {
        name: "Chị Lê Mai Anh",
        relationship: "Art Director tại Creative Agency",
        phone: "0911.999.888"
      }
    ],
    skills: [
      { name: "Figma / Adobe XD", pivot: { level: "Thành thạo" } },
      { name: "ReactJS", pivot: { level: "Khá" } },
      { name: "Tailwind CSS", pivot: { level: "Thành thạo" } },
      { name: "JavaScript (ES6)", pivot: { level: "Khá" } }
    ]
  };

  // Tách chữ cái đầu làm Avatar nếu không có ảnh
  const initialName = data.full_name ? data.full_name.split(" ").pop().charAt(0) : "CV";

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-xl font-sans text-slate-700 antialiased border border-slate-100 min-h-[297mm] text-left flex flex-col justify-between">
      
      <div>
        {/* 🌸 1. KHỐI ĐẦU TRANG (HEADER) - PHONG CÁCH THANH LỊCH, TINH TẾ */}
        <div className="bg-gradient-to-r from-slate-50 via-slate-100 to-indigo-50/30 p-8 sm:p-10 border-b border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-light tracking-wide text-slate-800">
              {data.full_name.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="font-semibold text-indigo-900">{data.full_name.split(" ").pop()}</span>
            </h1>
            <p className="text-xs font-medium tracking-normal text-indigo-600/90 uppercase">{data.title}</p>
          </div>
          
          {/* Avatar bo tròn tinh tế hoặc chữ viết tắt nghệ thuật */}
          <div className="w-20 h-20 rounded-full bg-white shadow-xs border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
            {data.avatar_url ? (
              <img src={`http://127.0.0.1:8000/${data.avatar_url}`} alt={data.full_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-light text-indigo-500 tracking-tighter">{initialName}</span>
            )}
          </div>
        </div>

        {/* 📋 2. THÔNG TIN LIÊN HỆ - HIỂN THỊ DẠNG THANH NGANG GỌN GÀNG */}
        <div className="bg-slate-900 text-slate-300 px-8 py-3 text-[11px] grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left font-light tracking-wide">
          <div><span className="text-indigo-400">📅</span> {data.birthday} ({data.gender || 'Nữ'})</div>
          <div><span className="text-indigo-400">📞</span> {data.phone}</div>
          <div><span className="text-indigo-400">✉️</span> <span className="break-all">{data.email}</span></div>
          <div><span className="text-indigo-400">📍</span> {data.address}</div>
        </div>

        {/* 📑 3. PHẦN THÂN CV (BODY CODE) */}
        <div className="p-8 sm:p-10 space-y-8">
          
          {/* Giới thiệu & Mục tiêu (Xử lý an toàn khi viết siêu dài) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            <div className="md:col-span-3 space-y-3 text-left">
              <h3 className="text-xs font-bold uppercase tracking-normal text-indigo-900 flex items-center gap-2">
                Giới thiệu bản thân
              </h3>
              {/* Kiểm soát căn đều văn bản và bẻ gãy từ siêu dài để tránh lỗi vỡ dòng */}
              <p className="text-xs text-slate-600 leading-relaxed text-justify font-light break-words">
                {data.summary}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed text-justify font-light break-words">
                <span className="font-medium text-slate-800">Mục tiêu sự nghiệp:</span> {data.objective}
              </p>
            </div>
            
            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/40 text-center space-y-1 shrink-0">
              <div className="text-2xl font-light text-indigo-600">{data.experience_years}</div>
              <div className="text-[10px] font-medium text-slate-500 uppercase tracking-normal">Năm kinh nghiệm chuyên môn</div>
            </div>
          </div>

          {/* Kinh nghiệm làm việc & Dự án thực chiến - ĐÃ FIX SẠCH LỖI VỠ CÚ PHÁP */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-normal text-indigo-900 border-b border-slate-100 pb-2">
              Kinh nghiệm & Dự án thực chiến
            </h3>
            
            <div className="pl-3 border-l border-indigo-200/60 space-y-5">
              {(() => {
                let projectArray = [];
                try {
                  projectArray = typeof data.project === 'string' ? JSON.parse(data.project) : data.project;
                } catch (e) {
                  projectArray = [];
                }

                // Nếu dữ liệu cũ nhập dạng chuỗi thuần túy (không phải JSON Array), render kiểu dự phòng
                if (!Array.isArray(projectArray) && typeof data.project === 'string') {
                  return <p className="text-xs text-slate-600 leading-relaxed text-justify font-light whitespace-pre-line break-words">{data.project}</p>;
                }

                if (!Array.isArray(projectArray) || projectArray.length === 0) {
                  return <p className="text-xs text-slate-400 italic">Chưa có thông tin dự án.</p>;
                }

                return projectArray.map((proj, idx) => (
                  <div key={idx} className="text-xs space-y-1 text-left">
                    <div className="flex justify-between items-baseline gap-4">
                      {/* Tiêu đề neo bên trái, break từ dài để bảo vệ thời gian */}
                      <h4 className="font-bold text-slate-900 text-[13px] break-words max-w-[75%]">
                        Dự án: {proj.project_name || 'Tên dự án'}
                      </h4>
                      {proj.duration && (
                        <span className="text-[10px] text-slate-400 italic shrink-0">({proj.duration})</span>
                      )}
                    </div>
                    
                    {proj.role && (
                      <p className="text-[11px] text-indigo-600/90 font-semibold uppercase tracking-wide">Vị trí: {proj.role}</p>
                    )}
                    
                    {proj.description && (
                      <p className="text-slate-500 leading-relaxed mt-1 whitespace-pre-line text-justify break-words font-light pl-1">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Học vấn & Bằng cấp */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-normal text-indigo-900 border-b border-slate-100 pb-2">
              Học vấn & Trình độ đào tạo
            </h3>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line text-justify font-light pl-3 border-l border-indigo-200/60 break-words">
              {data.education}
            </div>
          </div>

          {/* Kỹ năng chuyên môn (Thiết kế thanh đo Level tối giản) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-normal text-indigo-900 border-b border-slate-100 pb-2">
              Năng lực chuyên môn
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3.5 pt-1">
              {data.skills?.map((skill, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-light">
                    <span className="text-slate-800 font-medium">{skill.name}</span>
                    <span className="text-[11px] text-indigo-600 font-medium italic">{skill.pivot?.level || 'Cơ bản'}</span>
                  </div>
                  {/* Thanh Progress bar mảnh mai thể hiện tính 'Thanh lịch' */}
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ 
                        width: skill.pivot?.level === 'Chuyên gia' || skill.pivot?.level === 'Xuất sắc' ? '100%' :
                               skill.pivot?.level === 'Thành thạo' ? '85%' :
                               skill.pivot?.level === 'Khá' ? '65%' : '40%' 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 📞 4. NGƯỜI THAM CHIẾU (FOOTER) - Nằm gọn gàng dưới đáy trang */}
      {data.contact_reference && (
        <div className="px-8 sm:px-10 pb-8 pt-4 border-t border-slate-100 bg-slate-50/50 text-left">
          <h4 className="text-[11px] font-bold uppercase tracking-normal text-slate-400 mb-1.5">
            Thông tin xác thực (Reference)
          </h4>
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

            // Hỗ trợ nếu người tham chiếu nhập chuỗi văn bản thuần túy tự do
            if (!isJson && typeof data.contact_reference === 'string') {
              return <p className="text-xs text-slate-500 italic font-light whitespace-pre-line break-words">{data.contact_reference}</p>;
            }

            if (Array.isArray(referenceData) && referenceData.length > 0) {
              return referenceData.map((ref, idx) => (
                <div key={idx} className="text-xs text-slate-500 font-light space-y-0.5">
                  <span className="font-bold text-slate-700 not-italic">{ref.name}</span>
                  {ref.relationship && ` — ${ref.relationship}`}
                  {ref.phone && ` (SĐT: ${ref.phone})`}
                </div>
              ));
            }

            if (referenceData && typeof referenceData === 'object' && referenceData.name) {
              return (
                <div className="text-xs text-slate-500 font-light space-y-0.5">
                  <span className="font-bold text-slate-700 not-italic">{referenceData.name}</span>
                  {referenceData.relationship && ` — ${referenceData.relationship}`}
                  {referenceData.phone && ` (SĐT: ${referenceData.phone})`}
                </div>
              );
            }

            return <p className="text-xs text-slate-400 italic">Chưa có thông tin.</p>;
          })()}
        </div>
      )}

    </div>
  );
}