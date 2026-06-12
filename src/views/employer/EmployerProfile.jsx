import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Building2, Lock, LogOut, Camera, ShieldCheck, FileText, FileCheck,
    MapPin, Globe, Layers, Save, Edit3, X, ArrowLeft, Users, Calendar, Heart
} from 'lucide-react';

export default function EmployerProfile() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. STATE ĐỒNG BỘ HOÀN TOÀN VỚI CẤU TRÚC BẢNG `companies`
    const [companyInfo, setCompanyInfo] = useState({
        companyName: '',
        taxCode: '',
        websiteUrl: '',
        industry: '',
        size: '',
        foundedYear: '',
        address: '',
        description: '',
        benefits: '',
        logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150', // Mặc định
        businessLicense: '' // Lưu trữ path/tên file giấy phép kinh doanh cũ từ DB
    });

    // State quản lý các file vật lý được chọn từ máy tính
    const [logoFile, setLogoFile] = useState(null);
    const [licenseFile, setLicenseFile] = useState(null);

    // Khung dữ liệu dự phòng khi nhấn Hủy bỏ (Backup State)
    const [backupCompanyInfo, setBackupCompanyInfo] = useState({});

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const token = localStorage.getItem('token');
    const apiConfig = {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json'
        }
    };

    // 2. LẤY DỮ LIỆU TỪ BACKEND ĐỔ VÀO FORM
    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://127.0.0.1:8000/api/employer/company', apiConfig);

                if (response.data.success) {
                    const cData = response.data.data;
                    const profileFetched = {
                        companyName: cData.company_name || '',
                        taxCode: cData.tax_code || '',
                        websiteUrl: cData.website_url || '',
                        industry: cData.industry || '',
                        size: cData.size || '',
                        foundedYear: cData.founded_year || '',
                        address: cData.address || '',
                        description: cData.description || '',
                        benefits: cData.benefits || '',
                        businessLicense: cData.business_license || '',
                        logoUrl: cData.logo_url
                            ? `http://127.0.0.1:8000/${cData.logo_url}`
                            : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150'
                    };
                    setCompanyInfo(profileFetched);
                    setBackupCompanyInfo(profileFetched);
                }
            } catch (error) {
                console.error("Lỗi lấy hồ sơ công ty:", error);
                if (error.response?.status === 401) {
                    alert("Phiên làm việc hết hạn, vui lòng đăng nhập lại.");
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        window.scrollTo(0, 0);
        fetchCompanyProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyInfo(prev => ({ ...prev, [name]: value }));
    };
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý File Logo (Xem trước thời gian thực)
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                alert("Dung lượng logo không được vượt quá 3MB!");
                return;
            }
            setLogoFile(file);
            setCompanyInfo(prev => ({ ...prev, logoUrl: URL.createObjectURL(file) }));
        }
    };

    // Xử lý File Giấy phép kinh doanh
    const handleLicenseChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert("Giấy phép (PDF/Ảnh) không vượt quá 10MB!");
                return;
            }
            setLicenseFile(file);
        }
    };

    // 3. ĐẨY DỮ LIỆU LÊN SERVER QUA FORMDATA
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('company_name', companyInfo.companyName);
            formData.append('tax_code', companyInfo.taxCode);
            formData.append('website_url', companyInfo.websiteUrl);
            formData.append('industry', companyInfo.industry);
            formData.append('size', companyInfo.size);
            formData.append('founded_year', companyInfo.foundedYear);
            formData.append('address', companyInfo.address);
            formData.append('description', companyInfo.description);
            formData.append('benefits', companyInfo.benefits);

            // Gửi kèm file nhị phân nếu người dùng chọn mới
            if (logoFile) formData.append('logo_url', logoFile);
            if (licenseFile) formData.append('business_license', licenseFile);

            const uploadConfig = {
                headers: { ...apiConfig.headers, 'Content-Type': 'multipart/form-data' }
            };

            const response = await axios.post('http://127.0.0.1:8000/api/employer/company/update', formData, uploadConfig);

            if (response.data.success) {
                alert("Cập nhật thông tin công ty thành công!");

                if (response.data.data?.logo_url) {
                    companyInfo.logoUrl = `http://127.0.0.1:8000/${response.data.data.logo_url}`;
                }
                if (response.data.data?.business_license) {
                    companyInfo.businessLicense = response.data.data.business_license;
                }

                setBackupCompanyInfo(companyInfo);
                setLogoFile(null);
                setLicenseFile(null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert(error.response?.data?.message || "Xảy ra lỗi trong quá trình lưu trữ.");
        }
    };

    const handleCancelEdit = () => {
        setCompanyInfo(backupCompanyInfo);
        setLogoFile(null);
        setLicenseFile(null);
        setIsEditing(false);
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Mật khẩu xác nhận chưa khớp!');
            return;
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user-password/update', {
                current_password: passwordData.currentPassword,
                new_password: passwordData.newPassword
            }, apiConfig);

            if (response.data.success) {
                alert('Thay đổi mật khẩu thành công!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            alert(error.response?.data?.message || "Mật khẩu hiện tại không hợp lệ.");
        }
    };

    const handleLogout = () => {
        if (window.confirm('Xác nhận đăng xuất khỏi hệ thống doanh nghiệp?')) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center font-bold text-slate-400 text-xs tracking-wider">
                ĐANG TẢI DỮ LIỆU DOANH NGHIỆP...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-16 w-full">

            {/* BANNER HEADER */}
            <div className="w-full bg-gradient-to-br from-orange-100/60 via-amber-100/40 to-white text-slate-800 px-4 sm:px-6 lg:px-8 py-10 border-b border-orange-100/70 shadow-xs">
                <div className="max-w-6xl mx-auto">
                    <Link to="/employer" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors mb-5 group w-fit">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        Quay lại trang quản lý
                    </Link>

                    <div className="flex flex-col sm:flex-row items-center gap-5">
                        <div className="relative group shrink-0">
                            <img
                                src={companyInfo.logoUrl}
                                alt={companyInfo.companyName}
                                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-orange-200/60 shadow-md transition-all ${isEditing ? 'cursor-pointer hover:opacity-80 group-hover:border-blue-400' : 'cursor-default'
                                    }`}
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150"; }}
                                onClick={() => isEditing && document.getElementById('logoInput').click()}
                            />
                            {isEditing && (
                                <div
                                    onClick={() => document.getElementById('logoInput').click()}
                                    className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-bold gap-1"
                                >
                                    <Camera size={16} />
                                    <span>Đổi Logo</span>
                                </div>
                            )}
                            <input type="file" id="logoInput" accept="image/*" className="hidden" onChange={handleLogoChange} disabled={!isEditing} />
                        </div>

                        <div className="text-center sm:text-left space-y-1">
                            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                {companyInfo.companyName || "Tên công ty chưa cập nhật"}
                            </h1>
                            <p className="text-xs font-medium text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                                <MapPin size={13} /> {companyInfo.address || "Chưa cập nhật địa chỉ"}
                            </p>
                            <span className="inline-flex items-center gap-1 bg-orange-100/70 text-orange-700 text-[10px] font-bold px-2.5 py-0.5 rounded-xl mt-1">
                                <ShieldCheck size={11} className="text-emerald-600 fill-emerald-100" /> Hồ sơ doanh nghiệp
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* KHUNG CHÍNH CHIA SIDEBAR & FORM */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start w-full">

                    {/* TABS SIDEBAR */}
                    <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm space-y-1">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'info' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                                }`}
                        >
                            <Building2 size={15} /> Hồ sơ doanh nghiệp
                        </button>
                        <button
                            onClick={() => { setActiveTab('password'); setIsEditing(false); }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'password' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                                }`}
                        >
                            <Lock size={15} /> Đổi mật khẩu
                        </button>
                        <div className="h-px bg-slate-100 my-2"></div>
                        <button onClick={handleLogout} className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 transition-colors">
                            <LogOut size={15} /> Đăng xuất tài khoản
                        </button>
                    </div>

                    {/* KHUNG NỘI DUNG FORM CHÍNH */}
                    <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">

                        {activeTab === 'info' && (
                            <form onSubmit={handleSaveProfile} className="space-y-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-800 tracking-tight">Thông tin chi tiết sàn công ty</h3>
                                        <p className="text-[11px] text-slate-400">Các thông tin hiển thị trực tiếp đến ứng viên tìm việc.</p>
                                    </div>
                                    {!isEditing && (
                                        <button
                                            type="button" onClick={() => setIsEditing(true)}
                                            className="px-3.5 py-1.5 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
                                        >
                                            <Edit3 size={13} /> Sửa cấu hình bảng
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Tên công ty */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Tên doanh nghiệp (`company_name`)</label>
                                        <div className="relative">
                                            <input
                                                type="text" name="companyName" value={companyInfo.companyName} onChange={handleInputChange} required disabled={!isEditing}
                                                className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all pl-9 ${isEditing ? 'bg-white border-blue-500 ring-1 ring-blue-500/10' : 'bg-slate-50 text-slate-500 cursor-default'}`}
                                            />
                                            <Building2 size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                                        </div>
                                    </div>

                                    {/* Mã số thuế */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Mã số thuế (`tax_code`)</label>
                                        <div className="relative">
                                            <input
                                                type="text" name="taxCode" value={companyInfo.taxCode} onChange={handleInputChange} disabled={!isEditing}
                                                className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all pl-9 ${isEditing ? 'bg-white border-blue-500 ring-1 ring-blue-500/10' : 'bg-slate-50 text-slate-500 cursor-default'}`}
                                            />
                                            <FileText size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                                        </div>
                                    </div>

                                    {/* Website Url */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Địa chỉ Website (`website_url`)</label>
                                        <div className="relative">
                                            <input
                                                type="url" name="websiteUrl" value={companyInfo.websiteUrl} onChange={handleInputChange} placeholder="https://..." disabled={!isEditing}
                                                className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all pl-9 ${isEditing ? 'bg-white border-blue-500 ring-1 ring-blue-500/10' : 'bg-slate-50 text-slate-500 cursor-default'}`}
                                            />
                                            <Globe size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                                        </div>
                                    </div>

                                    {/* Ngành nghề lĩnh vực */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Ngành nghề kinh doanh (`industry`)</label>
                                        <div className="relative">
                                            <input
                                                type="text" name="industry" value={companyInfo.industry} onChange={handleInputChange} disabled={!isEditing}
                                                className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all pl-9 ${isEditing ? 'bg-white border-blue-500 ring-1 ring-blue-500/10' : 'bg-slate-50 text-slate-500 cursor-default'}`}
                                            />
                                            <Layers size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                                        </div>
                                    </div>

                                    {/* Quy mô công ty */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Quy mô nhân sự (`size`)</label>
                                        <div className="relative">
                                            <input
                                                type="text" name="size" value={companyInfo.size} onChange={handleInputChange} placeholder="Ví dụ: 100-500 nhân viên" disabled={!isEditing}
                                                className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all pl-9 ${isEditing ? 'bg-white border-blue-500 ring-1 ring-blue-500/10' : 'bg-slate-50 text-slate-500 cursor-default'}`}
                                            />
                                            <Users size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                                        </div>
                                    </div>

                                    {/* Năm thành lập */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Năm thành lập (`founded_year`)</label>
                                        <div className="relative">
                                            <input
                                                type="number" name="foundedYear" value={companyInfo.foundedYear} onChange={handleInputChange} placeholder="Ví dụ: 2015" disabled={!isEditing}
                                                className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all pl-9 ${isEditing ? 'bg-white border-blue-500 ring-1 ring-blue-500/10' : 'bg-slate-50 text-slate-500 cursor-default'}`}
                                            />
                                            <Calendar size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                                        </div>
                                    </div>

                                    {/* Địa chỉ trụ sở */}
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Trụ sở công ty (`address`)</label>
                                        <div className="relative">
                                            <input
                                                type="text" name="address" value={companyInfo.address} onChange={handleInputChange} disabled={!isEditing}
                                                className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all pl-9 ${isEditing ? 'bg-white border-blue-500 ring-1 ring-blue-500/10' : 'bg-slate-50 text-slate-500 cursor-default'}`}
                                            />
                                            <MapPin size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                                        </div>
                                    </div>

                                    {/* File giấy phép kinh doanh */}
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Giấy phép kinh doanh (`business_license`)</label>
                                        <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <FileCheck className="text-orange-500 shrink-0" size={16} />
                                                <span className="text-xs font-medium text-slate-600 truncate max-w-xs">
                                                    {licenseFile ? licenseFile.name : (companyInfo.businessLicense || "Chưa tải lên file tài liệu")}
                                                </span>
                                            </div>
                                            {isEditing ? (
                                                <input
                                                    type="file" accept=".pdf,image/*" onChange={handleLicenseChange}
                                                    className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                                                />
                                            ) : (
                                                companyInfo.businessLicense && (
                                                    <a
                                                        href={`http://127.0.0.1:8000/${companyInfo.businessLicense}`} target="_blank" rel="noreferrer"
                                                        className="text-[11px] font-extrabold text-blue-600 hover:underline w-fit"
                                                    >
                                                        Xem tài liệu gốc
                                                    </a>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Giới thiệu tổng quan */}
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Giới thiệu công ty (`description`)</label>
                                        <textarea
                                            name="description" value={companyInfo.description} onChange={handleInputChange} disabled={!isEditing} rows={4}
                                            className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all resize-none leading-relaxed ${isEditing ? 'bg-white border-blue-500 ring-1 ring-blue-500/10' : 'bg-slate-50 text-slate-500 cursor-default'}`}
                                        />
                                    </div>

                                    {/* Chế độ phúc lợi */}
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                                            <Heart size={12} className="text-rose-500 fill-rose-500" /> Phúc lợi dành cho ứng viên (`benefits`)
                                        </label>
                                        <textarea
                                            name="benefits" value={companyInfo.benefits} onChange={handleInputChange} disabled={!isEditing} rows={4}
                                            placeholder="Các chế độ bảo hiểm, du lịch nghỉ dưỡng, lương thưởng tháng 13..."
                                            className={`w-full text-xs font-semibold px-3 py-2.5 border rounded-xl focus:outline-none transition-all resize-none leading-relaxed ${isEditing ? 'bg-white border-blue-500 ring-1 ring-blue-500/10' : 'bg-slate-50 text-slate-500 cursor-default'}`}
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="pt-2 flex justify-end gap-2">
                                        <button
                                            type="button" onClick={handleCancelEdit}
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

                        {activeTab === 'password' && (
                            <form onSubmit={handleSavePassword} className="space-y-5">
                                <div>
                                    <h3 className="text-sm font-black text-slate-800 tracking-tight">Đổi mật khẩu tài khoản bảo mật</h3>
                                    <p className="text-[11px] text-slate-400">Thiết lập mật khẩu an toàn cao để bảo vệ tài sản doanh nghiệp.</p>
                                </div>
                                <div className="space-y-4 max-w-md">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Mật khẩu hiện tại</label>
                                        <div className="relative">
                                            <input
                                                type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required placeholder="••••••••"
                                                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all pl-9"
                                            />
                                            <Lock size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Mật khẩu mới</label>
                                        <div className="relative">
                                            <input
                                                type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required placeholder="••••••••"
                                                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all pl-9"
                                            />
                                            <Lock size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Xác nhận mật khẩu mới</label>
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
                                    <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all transform hover:-translate-y-0.5">
                                        <Save size={13} /> Thiết lập mật khẩu mới
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