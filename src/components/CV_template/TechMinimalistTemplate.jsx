import React from 'react';

export default function TechMinimalistTemplate({ candidateData }) {
  // 🚀 ĐỒNG BỘ MOCK DATA SANG CẤU TRÚC MẢNG CHUẨN ĐỂ HIỂN THỊ ĐỘC LẬP HOÀN HẢO
  const data = candidateData || {
    full_name: "PHẠM QUANG HUY",
    title: "Senior Backend Engineer (Go / Node.js)",
    birthday: "1997-10-30",
    gender: "Nam",
    phone: "0902.555.444",
    email: "quanghuy.dev@gmail.com",
    address: "Quận 2, TP. Hồ Chí Minh",
    summary: "Kỹ sư phần mềm hơn 4 năm kinh nghiệm chuyên sâu về kiến trúc hệ thống Backend, vi dịch vụ (Microservices) và tối ưu hóa cơ sở dữ liệu lớn. Có khả năng chịu áp lực cao, tư duy giải quyết vấn đề (Problem-solving) triệt để và đam mê nghiên cứu công nghệ mới.",
    objective: "Trở thành Solution Architect, tham gia tối ưu hạ tầng Cloud cho các sản phẩm SaaS phục vụ hàng triệu người dùng.",
    experience_years: 4,
    project: [
      {
        project_name: "HỆ THỐNG VI DỊCH VỤ MICROSERVICES",
        duration: "05/2023 - Hiện tại",
        role: "Tech Lead Backend tại Tech Corp",
        description: "- Tái cấu trúc hệ thống Monolith sang Microservices bằng Golang & gRPC, giảm 50% độ trễ hệ thống (Latency).\n- Thiết kế kiến trúc bộ nhớ đệm với Redis Cluster giúp chịu tải từ 10k lên 50k CCU hệ thống realtime.\n- Đóng gói môi trường và cấu hình CI/CD Pipeline (Docker, Jenkins, AWS EC2) tăng tốc độ deploy sản phẩm."
      },
      {
        project_name: "CỔNG THANH TOÁN TÍCH HỢP FINTECH",
        duration: "2021 - 2023",
        role: "Backend Developer tại Startup Fintech",
        description: "- Phát triển module tích hợp cổng thanh toán (VNPAY, Momo) bằng Node.js (NestJS).\n- Thiết kế và chuẩn hóa schema cơ sở dữ liệu PostgreSQL, tối ưu các câu lệnh query chậm."
      }
    ],
    education: "Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM\nChuyên ngành: Khoa học Máy tính (2015 - 2019)",
    contact_reference: [
      {
        name: "Mr. David Nguyen",
        relationship: "CTO tại Tech Corp",
        phone: "0912.888.777"
      }
    ],
    skills: [
      { name: "Golang / Node.js", pivot: { level: "Chuyên gia" } },
      { name: "PostgreSQL / MySQL", pivot: { level: "Thành thạo" } },
      { name: "Docker / Kubernetes", pivot: { level: "Khá" } },
      { name: "Redis / Kafka", pivot: { level: "Khá" } }
    ]
  };

  // Hàm hỗ trợ định dạng ngày sinh chuẩn Việt Nam
  const formatBirthday = (dateStr) => {
    if (!dateStr) return 'Chưa cập nhật';
    if (dateStr.includes('/') && !dateStr.includes('T')) return dateStr;
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-md p-8 sm:p-10 font-mono text-slate-800 antialiased border border-slate-200 min-h-[297mm] text-left space-y-6 flex flex-col justify-between">
      
      <div className="space-y-6">
        {/* 🖥️ PHẦN ĐẦU (HEADER) - PHONG CÁCH CODING GỌN GÀNG */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-900 pb-5 gap-4">
          <div className="space-y-1 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase break-words">{data.full_name}</h1>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-normal">{`// ${data.title}`}</p>
            <p className="text-[11px] font-semibold text-slate-400 italic">Kinh nghiệm tích lũy: {data.experience_years} năm thực chiến</p>
          </div>
          
          {/* Khối liên hệ tinh gọn bằng text thuần - Xử lý chống tràn văn bản */}
          <div className="text-[11px] space-y-1 font-sans font-medium text-slate-600 sm:text-right w-full sm:w-auto text-left">
            <div><span className="font-bold text-slate-900">☎ TEL:</span> {data.phone}</div>
            <div><span className="font-bold text-slate-900">✉ EMAIL:</span> <span className="break-all">{data.email}</span></div>
            <div><span className="font-bold text-slate-900">📍 LOC:</span> <span className="break-words">{data.address}</span></div>
            <div><span className="font-bold text-slate-900">📅 BORN:</span> {formatBirthday(data.birthday)} ({data.gender || 'Nam'})</div>
          </div>
        </div>

        {/* 📝 KHỐI TÓM TẮT CHUYÊN MÔN */}
        <div className="space-y-2 text-left">
          <h3 className="text-xs font-bold uppercase tracking-normal bg-slate-100 px-2 py-1 inline-block text-slate-900 border border-slate-300">
            01. Tóm tắt năng lực
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed text-justify font-sans break-words">
            {data.summary}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-sans italic pt-1 break-words">
            <strong className="font-bold text-slate-900 not-italic">Mục tiêu chiến lược:</strong> {data.objective}
          </p>
        </div>

        {/* 💼 KHỐI KINH NGHIỆM & DỰ ÁN - ĐÃ KHẮC PHỤC LỖI HIỂN THỊ */}
        <div className="space-y-2 text-left">
          <h3 className="text-xs font-bold uppercase tracking-normal bg-slate-100 px-2 py-1 inline-block text-slate-900 border border-slate-300">
            02. Kinh nghiệm & Dự án
          </h3>
          
          <div className="pl-3 border-l-2 border-slate-900 space-y-5 font-mono">
            {(() => {
              let projectArray = [];
              try {
                projectArray = typeof data.project === 'string' ? JSON.parse(data.project) : data.project;
              } catch (e) {
                projectArray = [];
              }

              // Cơ chế dự phòng nếu dữ liệu nhập vào dạng chuỗi văn bản thuần tự do
              if (!Array.isArray(projectArray) && typeof data.project === 'string') {
                return <p className="text-xs text-slate-600 leading-relaxed text-justify whitespace-pre-line break-words pl-1">{data.project}</p>;
              }

              if (!Array.isArray(projectArray) || projectArray.length === 0) {
                return <p className="text-xs text-slate-400 italic pl-1">// Chưa có dữ liệu dự án hệ thống.</p>;
              }

              return projectArray.map((proj, idx) => (
                <div key={idx} className="text-xs space-y-1 text-left pl-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                    <h4 className="font-bold text-slate-900 text-[13px] break-words max-w-full sm:max-w-[75%]">
                      &gt; Dự án: {proj.project_name || 'Tên dự án'}
                    </h4>
                    {proj.duration && (
                      <span className="text-[10px] text-slate-400 font-sans italic shrink-0">({proj.duration})</span>
                    )}
                  </div>
                  
                  {proj.role && (
                    <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wide">// Vị trí: {proj.role}</p>
                  )}
                  
                  {proj.description && (
                    <p className="text-slate-500 leading-relaxed mt-1 whitespace-pre-line text-justify break-words pl-1 font-sans">
                      {proj.description}
                    </p>
                  )}
                </div>
              ));
            })()}
          </div>
        </div>

        {/* 🎓 KHỐI HỌC VẤN */}
        <div className="space-y-2 text-left">
          <h3 className="text-xs font-bold uppercase tracking-normal bg-slate-100 px-2 py-1 inline-block text-slate-900 border border-slate-300">
            03. Học vấn & Đào tạo
          </h3>
          <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line text-justify font-sans pl-1 break-words">
            {data.education}
          </div>
        </div>

        {/* 🛠️ MA TRẬN KỸ NĂNG (DÀN CELL ĐẸP MẮT) */}
        <div className="space-y-2 text-left">
          <h3 className="text-xs font-bold uppercase tracking-normal bg-slate-100 px-2 py-1 inline-block text-slate-900 border border-slate-300">
            04. Kỹ năng công nghệ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {data.skills?.map((skill, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 border border-slate-200 rounded font-sans text-xs bg-slate-50/50">
                <span className="font-bold text-slate-900 break-words pr-2">{skill.name}</span>
                <span className="text-[10px] bg-slate-900 text-white font-mono font-bold px-2 py-0.5 rounded shrink-0">
                  {skill.pivot?.level || 'Cơ bản'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📞 NGƯỜI THAM CHIẾU (FOOTER) - KHU VỰC XÁC MINH AN TOÀN */}
      {data.contact_reference && (
        <div className="space-y-2 pt-4 border-t border-slate-200 text-left">
          <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            [References / Người xác minh]
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

            // Hỗ trợ trường hợp admin nhập text thô tự do
            if (!isJson && typeof data.contact_reference === 'string') {
              return <p className="text-xs text-slate-500 italic font-sans whitespace-pre-line break-words leading-relaxed">{data.contact_reference}</p>;
            }

            if (Array.isArray(referenceData) && referenceData.length > 0) {
              return referenceData.map((ref, idx) => (
                <div key={idx} className="text-xs font-sans text-slate-600 space-y-0.5">
                  <span className="font-bold text-slate-900">{ref.name}</span>
                  {ref.relationship && ` — ${ref.relationship}`}
                  {ref.phone && ` (SĐT: ${ref.phone})`}
                </div>
              ));
            }

            if (referenceData && typeof referenceData === 'object' && referenceData.name) {
              return (
                <div className="text-xs font-sans text-slate-600 space-y-0.5">
                  <span className="font-bold text-slate-900">{referenceData.name}</span>
                  {referenceData.relationship && ` — ${referenceData.relationship}`}
                  {referenceData.phone && ` (SĐT: ${referenceData.phone})`}
                </div>
              );
            }

            return <p className="text-xs text-slate-400 italic font-sans">// Chưa có thông tin người xác thực.</p>;
          })()}
        </div>
      )}

    </div>
  );
}