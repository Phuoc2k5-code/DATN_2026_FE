import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-50 border-t border-orange-100 text-slate-600 font-sans mt-20">
      {/* Khối nội dung chính */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Cột 1: Giới thiệu & Điểm nhấn Đồ án */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            {/* Thay thế bằng Logo hoặc Tên Web của bạn */}
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              SmartJob
            </span>
            <span className="bg-orange-100 text-orange-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              AI Powered
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
            Hệ thống nền tảng tuyển dụng thông minh ứng dụng thuật toán so khớp (Matching Score) và gợi ý việc làm tự động theo kỹ năng, mang lại cơ hội tối ưu cho Ứng viên và Nhà tuyển dụng.
          </p>
          {/* Mạng xã hội mockup */}
          <div className="flex space-x-4 pt-2">
            <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-colors">🌐</span>
            <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-colors">🔵</span>
            <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-colors">🔴</span>
          </div>
        </div>

        {/* Cột 2: Đường dẫn cho Ứng viên */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Dành Cho Ứng Viên</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#jobs" className="hover:text-orange-500 transition-colors">Tìm kiếm việc làm</a></li>
            <li><a href="#profile" className="hover:text-orange-500 transition-colors">Tạo CV trực tuyến</a></li>
            <li><a href="#matching" className="hover:text-orange-500 transition-colors">Tính điểm hồ sơ AI</a></li>
            <li><a href="#dashboard" className="hover:text-orange-500 transition-colors">Cẩm nang nghề nghiệp</a></li>
          </ul>
        </div>

        {/* Cột 3: Đường dẫn cho Nhà tuyển dụng */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Nhà Tuyển Dụng</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#post-job" className="hover:text-orange-500 transition-colors">Đăng tin tuyển dụng</a></li>
            <li><a href="#candidates" className="hover:text-orange-500 transition-colors">Quản lý & Lọc ứng viên</a></li>
            <li><a href="#pricing" className="hover:text-orange-500 transition-colors">Bảng giá dịch vụ</a></li>
            <li><a href="#rules" className="hover:text-orange-500 transition-colors">Quy định bảo mật</a></li>
          </ul>
        </div>

        {/* Cột 4: Thông tin liên hệ nhóm / trường Cao Thắng */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Thông Tin Liên Hệ</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li className="flex items-start space-x-1">
              <span>📍</span>
              <span>65 Huỳnh Thúc Kháng, P. Bến Nghé, Quận 1, TP. HCM</span>
            </li>
            <li className="flex items-center space-x-1">
              <span>✉️</span>
              <span>support@smartjob.edu.vn</span>
            </li>
            <li className="flex items-center space-x-1">
              <span>📞</span>
              <span>(028) 38 212 868</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Thanh bản quyền & Tên SV thực hiện ở đáy trang */}
      <div className="w-full bg-slate-100 border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} SmartJob - Đồ án tốt nghiệp K23 Công nghệ thông tin.</p>
          <p className="font-medium text-slate-500">
            Thực hiện: Lê Nguyễn Trọng Phúc & Trần Toàn Phước - Lớp: CĐ TH 23WEBB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;