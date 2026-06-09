import React from 'react';

export default function TechMinimalistTemplate({ candidateData }) {
  const data = candidateData || {
    full_name: "PHẠM QUANG HUY",
    title: "Senior Backend Engineer (Go / Node.js)",
    birthday: "30/10/1997",
    gender: "Nam",
    phone: "0902.555.444",
    email: "quanghuy.dev@gmail.com",
    address: "Quận 2, TP. Hồ Chí Minh",
    summary: "Kỹ sư phần mềm hơn 4 năm kinh nghiệm chuyên sâu về kiến trúc hệ thống Backend, vi dịch vụ (Microservices) và tối ưu hóa cơ sở dữ liệu lớn. Có khả năng chịu áp lực cao, tư duy giải quyết vấn đề (Problem-solving) triệt để và đam mê nghiên cứu công nghệ mới.",
    objective: "Trở thành Solution Architect, tham gia tối ưu hạ tầng Cloud cho các sản phẩm SaaS phục vụ hàng triệu người dùng.",
    experience_years: 4,
    project: "[05/2023 - Hiện tại] TECH CORP - TECH LEAD BACKEND\n- Tái cấu trúc hệ thống Monolith sang Microservices bằng Golang & gRPC, giảm 50% độ trễ hệ thống (Latency).\n- Thiết kế kiến trúc bộ nhớ đệm với Redis Cluster giúp chịu tải từ 10k lên 50k CCU hệ thống realtime.\n- Đóng gói môi trường và cấu hình CI/CD Pipeline (Docker, Jenkins, AWS EC2) tăng tốc độ deploy sản phẩm.\n\n[2021 - 2023] STARTUP FINTECH - BACKEND DEVELOPER\n- Phát triển module tích hợp cổng thanh toán (VNPAY, Momo) bằng Node.js (NestJS).\n- Thiết kế và chuẩn hóa schema cơ sở dữ liệu PostgreSQL, tối ưu các câu lệnh query chậm.",
    education: "Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM\nChuyên ngành: Khoa học Máy tính (2015 - 2019)",
    contact_reference: "Mr. David Nguyen - CTO tại Tech Corp (SĐT: 0912.888.777)",
    skills: [
      { name: "Golang / Node.js", pivot: { level: "Chuyên gia" } },
      { name: "PostgreSQL / MySQL", pivot: { level: "Thành thạo" } },
      { name: "Docker / Kubernetes", pivot: { level: "Khá" } },
      { name: "Redis / Kafka", pivot: { level: "Khá" } }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-md p-8 sm:p-10 font-mono text-slate-800 antialiased border border-slate-200 min-h-[297mm] text-left space-y-6">
      
      {/* 🖥️ PHẦN ĐẦU (HEADER) - PHONG CÁCH CODING GỌN GÀNG */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-900 pb-5 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{data.full_name}</h1>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{`// ${data.title}`}</p>
          <p className="text-[11px] font-semibold text-slate-400 italic">Kinh nghiệm tích lũy: {data.experience_years} năm thực chiến</p>
        </div>
        
        {/* Khối liên hệ tinh gọn bằng text thuần */}
        <div className="text-[11px] space-y-1 font-sans font-medium text-slate-600 sm:text-right w-full sm:w-auto">
          <div><span className="font-bold text-slate-900">☎ TEL:</span> {data.phone}</div>
          <div><span className="font-bold text-slate-900">✉ EMAIL:</span> {data.email}</div>
          <div><span className="font-bold text-slate-900">📍 LOC:</span> {data.address}</div>
          <div><span className="font-bold text-slate-900">📅 BORN:</span> {data.birthday} ({data.gender})</div>
        </div>
      </div>

      {/* 📝 KHỐI TÓM TẮT CHUYÊN MÔN */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 inline-block text-slate-900 border border-slate-300">
          01. Tóm tắt năng lực
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed text-justify font-sans">
          {data.summary}
        </p>
        <p className="text-xs text-slate-600 leading-relaxed font-sans italic pt-1">
          <strong className="font-bold text-slate-900 not-italic">Mục tiêu:</strong> {data.objective}
        </p>
      </div>

      {/* 💼 KHỐI KINH NGHIỆM & DỰ ÁN */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 inline-block text-slate-900 border border-slate-300">
          02. Kinh nghiệm & Dự án
        </h3>
        <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line text-justify font-mono pl-1">
          {data.project}
        </div>
      </div>

      {/* 🎓 KHỐI HỌC VẤN */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 inline-block text-slate-900 border border-slate-300">
          03. Học vấn
        </h3>
        <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-sans pl-1">
          {data.education}
        </div>
      </div>

      {/* 🛠️ MA TRẬN KỸ NĂNG (DÀN CELL ĐẸP MẮT) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 inline-block text-slate-900 border border-slate-300">
          04. Kỹ năng công nghệ
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {data.skills?.map((skill, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 border border-slate-200 rounded font-sans text-xs bg-slate-50/50">
              <span className="font-bold text-slate-900">{skill.name}</span>
              <span className="text-[10px] bg-slate-900 text-white font-bold px-2 py-0.5 rounded">
                {skill.pivot?.level || 'Cơ bản'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 📞 NGƯỜI THAM CHIẾU */}
      {data.contact_reference && (
        <div className="space-y-2 pt-4 border-t border-slate-200">
          <h4 className="text-[10px] font-bold uppercase text-slate-400">
            [References]
          </h4>
          <p className="text-xs text-slate-500 italic font-sans">
            {data.contact_reference}
          </p>
        </div>
      )}

    </div>
  );
}