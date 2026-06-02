import React, { useState } from 'react';
import {
  User, Lock, LogOut, Camera, ShieldCheck,
  Mail, Phone, MapPin, Briefcase, Calendar, Save, Edit3, X
} from 'lucide-react';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('info'); // 'info' hoặc 'password'
  const [isEditing, setIsEditing] = useState(false);  // 💡 Trạng thái khóa/mở khóa chỉnh sửa

  const initialUserInfo = {
    fullName: 'Nguyễn Văn A',
    email: 'Anguyen@gmail.com',
    phone: '0987654321',
    address: 'Quận 9, TP. Hồ Chí Minh',
    title: 'Frontend Developer',
    dob: '2004-10-15',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  };

  const [userInfo, setUserInfo] = useState(initialUserInfo);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Hàm xử lý thay đổi dữ liệu thông tin cá nhân
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý thay đổi dữ liệu mật khẩu
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Hàm Lưu thông tin cá nhân
  const handleSaveInfo = (e) => {
    e.preventDefault();
    alert('Cập nhật thông tin tài khoản thành công!');
    setIsEditing(false); // 💡 Lưu xong thì khóa form lại ngay
    // Sau này gọi API: axios.put('/api/user/profile', userInfo)
  };

  // Hàm Hủy chỉnh sửa (Khôi phục lại dữ liệu ban đầu)
  const handleCancelEdit = () => {
    setUserInfo(initialUserInfo); // Trả lại dữ liệu cũ
    setIsEditing(false);          // Khóa form lại
  };

  // Hàm Lưu đổi mật khẩu
  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu nhập lại không trùng khớp!');
      return;
    }
    alert('Đổi mật khẩu thành công!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Hàm Đăng xuất
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
      alert('Đã đăng xuất hệ thống!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full">

      {/* HEADER TÀI KHOẢN (TRÀN NGANG) */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group cursor-pointer">
            <img
              src={userInfo.avatar}
              alt={userInfo.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/20 shadow-xl group-hover:opacity-80 transition-opacity"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} className="text-white" />
              </div>
            )}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{userInfo.fullName}</h1>
            <p className="text-xs sm:text-sm font-medium text-blue-100/90 flex items-center justify-center sm:justify-start gap-1">
              <Briefcase size={14} /> {userInfo.title}
            </p>
            <span className="inline-flex items-center gap-1 bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 border border-white/10">
              <ShieldCheck size={11} className="text-emerald-400" /> Tài khoản đã xác thực
            </span>
          </div>
        </div>
      </div>

      {/* VÙNG NỘI DUNG CHÍNH CHIA BIỆT LẬP 2 BÊN */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start w-full">

          {/* THANH ĐIỀU HƯỚNG BÊN TRÁI (SIDEBAR TAB) */}
          <div className="md:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm space-y-1 shrink-0">
            <button
              onClick={() => setActiveTab('info')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'info'
                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
            >
              <User size={15} /> Thông tin cá nhân
            </button>
            <button
              onClick={() => { setActiveTab('password'); setIsEditing(false); }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'password'
                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
            >
              <Lock size={15} /> Đổi mật khẩu
            </button>

            <div className="h-px bg-slate-100 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut size={15} /> Đăng xuất tài khoản
            </button>
          </div>

          {/* KHUNG HIỂN THỊ NỘI DUNG CHÍNH BÊN PHẢI */}
          <div className="md:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">

            {/* TAB 1: THÔNG TIN NGƯỜI DÙNG */}
            {activeTab === 'info' && (
              <form onSubmit={handleSaveInfo} className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight">Thông tin người dùng</h3>
                    <p className="text-[11px] text-slate-400">Xem hoặc chỉnh sửa thông tin hồ sơ cá nhân của bạn.</p>
                  </div>

                  {/* 💡 NÚT BẬT CHẾ ĐỘ SỬA: Khi chưa sửa thì hiện nút này */}
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-3.5 py-1.5 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <Edit3 size={13} /> Sửa thông tin
                    </button>
                  )}
                </div>

                {/* Tất cả các input sẽ dựa vào `disabled={!isEditing}` để khóa/mở khóa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <input
                        type="text" name="fullName" value={userInfo.fullName} onChange={handleInfoChange} required
                        disabled={!isEditing}
                        className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-colors pl-9 ${isEditing ? 'bg-white border-blue-500 focus:border-blue-600' : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-default'
                          }`}
                      />
                      <User size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Địa chỉ Email (Không được sửa)
                    </label>
                    <div className="relative">
                      <input
                        type="email" name="email" value={userInfo.email} disabled
                        className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl cursor-not-allowed pl-9"
                      />
                      <Mail size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <input
                        type="text" name="phone" value={userInfo.phone} onChange={handleInfoChange}
                        disabled={!isEditing}
                        className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-colors pl-9 ${isEditing ? 'bg-white border-blue-500' : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-default'
                          }`}
                      />
                      <Phone size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Ngày sinh
                    </label>
                    <div className="relative">
                      <input
                        type="date" name="dob" value={userInfo.dob} onChange={handleInfoChange}
                        disabled={!isEditing}
                        className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-colors pl-9 ${isEditing ? 'bg-white border-blue-500' : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-default'
                          }`}
                      />
                      <Calendar size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Vị trí công việc hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type="text" name="title" value={userInfo.title} onChange={handleInfoChange}
                        disabled={!isEditing}
                        className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-colors pl-9 ${isEditing ? 'bg-white border-blue-500' : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-default'
                          }`}
                      />
                      <Briefcase size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Địa chỉ cư trú
                    </label>
                    <div className="relative">
                      <input
                        type="text" name="address" value={userInfo.address} onChange={handleInfoChange}
                        disabled={!isEditing}
                        className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-colors pl-9 ${isEditing ? 'bg-white border-blue-500' : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-default'
                          }`}
                      />
                      <MapPin size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* 💡 NÚT ACTION: Chỉ hiện cụm nút Lưu / Hủy khi đang ở chế độ sửa */}
                {isEditing && (
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <X size={13} /> Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
                    >
                      <Save size={13} /> Lưu thay đổi
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* TAB 2: ĐỔI MẬT KHẨU (GIỮ NGUYÊN) */}
            {activeTab === 'password' && (
              <form onSubmit={handleSavePassword} className="space-y-5">
                <div>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight">Đổi mật khẩu tài khoản</h3>
                  <p className="text-[11px] text-slate-400">Hãy sử dụng mật khẩu mạnh gồm chữ, số và ký tự để bảo mật tài khoản tốt hơn.</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Mật khẩu hiện tại <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required placeholder="••••••••"
                        className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors pl-9"
                      />
                      <Lock size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Mật khẩu mới <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required placeholder="••••••••"
                        className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors pl-9"
                      />
                      <Lock size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required placeholder="••••••••"
                        className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors pl-9"
                      />
                      <Lock size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
                  >
                    <Save size={13} /> Cập nhật mật khẩu mới
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </main>

    </div>
  );
}