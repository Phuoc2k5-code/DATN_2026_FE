import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User, Lock, LogOut, Camera, ShieldCheck, LogIn,
  Mail, Phone, MapPin, Briefcase, Calendar, Save, Edit3, X, ArrowLeft, FilePlus
} from 'lucide-react';

export default function UserProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true); // 🚀 THÊM: State check xem đã tạo hồ sơ chưa

  // State thông tin người dùng (Mặc định để chế độ Khách nếu chưa đăng nhập)
  const [userInfo, setUserInfo] = useState({
    fullName: 'Tài khoản khách',
    email: 'Chưa đăng nhập',
    phone: '',
    address: '',
    title: 'Khách vãng lai',
    dob: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [backupUserInfo, setBackupUserInfo] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Kiểm tra sự tồn tại của Token
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token; 

  const apiConfig = {
    headers: { 
      'Authorization': token ? `Bearer ${token}` : '',
      'Accept': 'application/json' 
    }
  };

  // LẤY THÔNG TIN PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/user-profile', apiConfig);
        
        // Trường hợp 1: API thành công và có dữ liệu ứng viên đầy đủ
        if (response.data.success && response.data.data?.candidate) {
          const uData = response.data.data;
          const profileFetched = {
            fullName: uData.candidate?.full_name || '',
            email: uData.email || '',
            phone: uData.candidate?.phone || '',
            address: uData.candidate?.address || '',
            title: uData.candidate?.title || '',
            dob: uData.candidate?.birthday || '',
            avatar: uData.candidate?.avatar_url 
              ? `http://127.0.0.1:8000/${uData.candidate.avatar_url}`
              : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
          };
          setUserInfo(profileFetched);
          setBackupUserInfo(profileFetched);
          setHasProfile(true);
        } 
        // Trường hợp 2: Đăng nhập thành công nhưng backend báo chưa có hồ sơ (candidate = null)
        else if (response.data.has_profile === false || !response.data.data?.candidate) {
          setHasProfile(false);
          setUserInfo(prev => ({
            ...prev,
            email: response.data.data?.email || 'Đã xác thực tài khoản',
            fullName: 'Chưa cập nhật họ tên',
            title: 'Chưa có hồ sơ ứng viên'
          }));
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin tài khoản:", error);
        // Nếu backend trả về lỗi 404 hoặc lỗi không tìm thấy hồ sơ ứng viên tùy cấu hình API của bạn
        if (error.response?.status === 404) {
          setHasProfile(false);
        } else if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchProfile();
  }, [isLoggedIn]);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Dung lượng ảnh đại diện không được vượt quá 5MB!");
        return;
      }
      setAvatarFile(file);
      setUserInfo(prev => ({
        ...prev,
        avatar: URL.createObjectURL(file)
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('full_name', userInfo.fullName);
      formData.append('phone', userInfo.phone);
      formData.append('title', userInfo.title);
      formData.append('address', userInfo.address);
      formData.append('birthday', userInfo.dob);
      formData.append('gender', 'Khác');

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const uploadConfig = {
        headers: {
          ...apiConfig.headers,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post('http://127.0.0.1:8000/api/user-profile/update', formData, uploadConfig);

      if (response.data.success) {
        alert(response.data.message);
        if (response.data.data?.avatar_url) {
          setUserInfo(prev => ({
            ...prev,
            avatar: `http://127.0.0.1:8000/${response.data.data.avatar_url}`
          }));
        }
        setBackupUserInfo(userInfo);
        setAvatarFile(null);
        setIsEditing(false);
        setHasProfile(true); // Đã lưu thành công đồng nghĩa với việc đã có hồ sơ
      }
    } catch (error) {
      console.error("Lỗi lưu hồ sơ:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin.");
    }
  };

  const handleCancelEdit = () => {
    setUserInfo(backupUserInfo);
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu nhập lại không trùng khớp!');
      return;
    }
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user-password/update', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      }, apiConfig);

      if (response.data.success) {
        alert('Đổi mật khẩu thành công!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Mật khẩu hiện tại không chính xác.");
    }
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
      localStorage.removeItem('token');
      alert('Đã đăng xuất hệ thống!');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center font-bold text-slate-500 text-xs">
        Đang tải thông tin hồ sơ...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full">

      {/* HEADER TÀI KHOẢN */}
      <div className="w-full bg-gradient-to-br from-orange-100/60 via-amber-100/40 to-white text-slate-800 px-4 sm:px-6 lg:px-8 py-10 border-b border-orange-100/70 shadow-sm">
        <div className="max-w-6xl mx-auto">
          
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors mb-5 group w-fit">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
            Quay lại trang chủ
          </Link>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group shrink-0">
              <img
                src={userInfo.avatar}
                alt={userInfo.fullName}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-orange-200/60 shadow-md transition-all ${
                  isEditing && isLoggedIn && hasProfile ? 'cursor-pointer hover:opacity-80 group-hover:border-blue-300' : 'cursor-default'
                }`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
                }}
                onClick={() => isEditing && isLoggedIn && hasProfile && document.getElementById('avatarInput').click()}
              />
              
              {isEditing && isLoggedIn && hasProfile && (
                <div 
                  onClick={() => document.getElementById('avatarInput').click()}
                  className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-bold gap-1"
                >
                  <Camera size={16} className="text-white drop-shadow-sm" />
                  <span>Thay ảnh</span>
                </div>
              )}

              <input 
                type="file" 
                id="avatarInput" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange}
                disabled={!isEditing || !isLoggedIn || !hasProfile}
              />
            </div>
            
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {userInfo.fullName}
              </h1>
              
              <p className="text-xs sm:text-sm font-medium text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                <Briefcase size={14} className="text-slate-400" /> {userInfo.title}
              </p>
              
              {isLoggedIn ? (
                <span className="inline-flex items-center gap-1 bg-orange-100/70 text-orange-700 text-[10px] font-bold px-2.5 py-0.5 rounded-xl mt-1.5 border border-orange-200/40 shadow-xs">
                  <ShieldCheck size={11} className="text-emerald-600 fill-emerald-100" /> Tài khoản đã xác thực
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-xl mt-1.5 border border-slate-200/60 shadow-xs">
                  Chế độ xem trước
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VÙNG NỘI DUNG CHÍNH CHIA BIỆT LẬP 2 BÊN */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start w-full">

          {/* SIDEBAR TAB */}
          <div className="md:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm space-y-1 shrink-0">
            <button
              onClick={() => setActiveTab('info')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'info'
                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <User size={15} /> Thông tin cá nhân
            </button>
            
            <button
              onClick={() => { setActiveTab('password'); setIsEditing(false); }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
                activeTab === 'password'
                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Lock size={15} /> Đổi mật khẩu
            </button>

            <div className="h-px bg-slate-100 my-2"></div>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={15} /> Đăng xuất tài khoản
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <LogIn size={15} /> Đăng nhập hệ thống
              </button>
            )}
          </div>

          {/* KHUNG HIỂN THỊ NỘI DUNG CHÍNH BÊN PHẢI */}
          <div className="md:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">

            {/* TRƯỜNG HỢP 1: Chưa đăng nhập tài khoản */}
            {!isLoggedIn ? (
              <div className="py-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-inner">
                  <User size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-800 tracking-tight">Bạn chưa đăng nhập</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Vui lòng đăng nhập hệ thống VieclamPro để quản lý hồ sơ, cập nhật CV, đổi mật khẩu và ứng tuyển các công việc hấp dẫn.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <LogIn size={13} /> Đăng nhập ngay
                </button>
              </div>
            ) : (
              <>
                {/* TAB 1: THÔNG TIN NGƯỜI DÙNG */}
                {activeTab === 'info' && (
                  <>
                    {/* 🚀 TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP NHƯNG CHƯA TẠO HỒ SƠ ỨNG VIÊN */}
                    {!hasProfile ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
                        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-inner">
                          <FilePlus size={26} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-black text-slate-800 tracking-tight">Bạn chưa có hồ sơ ứng viên</h3>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Tài khoản của bạn chưa được khởi tạo hồ sơ cá nhân. Vui lòng kích hoạt kích hoạt biểu mẫu bằng cách nhấn nút dưới đây để bắt đầu tìm kiếm việc làm.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigate('/cv-management/create-cv') // Bật form lên kích hoạt chế độ điền luôn
                          }}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                          <FilePlus size={13} /> Tạo hồ sơ ngay
                        </button>
                      </div>
                    ) : (
                      /* TRƯỜNG HỢP THÔNG THƯỜNG: Đã có hồ sơ, hiển thị form như cũ */
                      <form onSubmit={handleSaveInfo} className="space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-sm font-black text-slate-800 tracking-tight">Thông tin người dùng</h3>
                            <p className="text-[11px] text-slate-400">Xem hoặc chỉnh sửa thông tin hồ sơ cá nhân và ảnh đại diện.</p>
                          </div>

                          {!isEditing && (
                            <button
                              type="button"
                              onClick={() => setIsEditing(true)}
                              className="px-3.5 py-1.5 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
                            >
                              <Edit3 size={13} /> Sửa thông tin
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                              Họ và tên
                            </label>
                            <div className="relative">
                              <input
                                type="text" name="fullName" value={userInfo.fullName} onChange={handleInfoChange} required
                                disabled={!isEditing}
                                className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all pl-9 ${
                                  isEditing 
                                    ? 'bg-white border-blue-500 shadow-xs focus:ring-1 focus:ring-blue-500/20' 
                                    : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-default'
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
                                className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all pl-9 ${
                                  isEditing 
                                    ? 'bg-white border-blue-500 shadow-xs focus:ring-1 focus:ring-blue-500/20' 
                                    : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-default'
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
                                className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all pl-9 ${
                                  isEditing 
                                    ? 'bg-white border-blue-500 shadow-xs focus:ring-1 focus:ring-blue-500/20' 
                                    : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-default'
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
                                className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all pl-9 ${
                                  isEditing 
                                    ? 'bg-white border-blue-500 shadow-xs focus:ring-1 focus:ring-blue-500/20' 
                                    : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-default'
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
                                className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all pl-9 ${
                                  isEditing 
                                    ? 'bg-white border-blue-500 shadow-xs focus:ring-1 focus:ring-blue-500/20' 
                                    : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-default'
                                }`}
                              />
                              <MapPin size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                            </div>
                          </div>
                        </div>

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
                              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                            >
                              <Save size={13} /> Lưu thay đổi
                            </button>
                          </div>
                        )}
                      </form>
                    )}
                  </>
                )}

                {/* TAB 2: ĐỔI MẬT KHẨU */}
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
                            className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all pl-9"
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
                            className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all pl-9"
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
                            className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all pl-9"
                          />
                          <Lock size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                      >
                        <Save size={13} /> Cập nhật mật khẩu mới
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

          </div>

        </div>
      </main>

    </div>
  );
}