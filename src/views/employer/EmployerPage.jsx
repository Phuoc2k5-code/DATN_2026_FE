import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Briefcase, Users, Plus, Search, Filter,
    Clock, CheckCircle, XCircle, Mail, BarChart3, TrendingUp,
    Calendar, MapPin, Award, Edit3, Lock, RefreshCw, Send, ChevronDown, Sparkles
} from "lucide-react";
import { Link } from 'react-router-dom'; // Đảm bảo đã import Link
import axios from 'axios';

export default function EmployerPage() {
    const [companyData, setCompanyData] = useState(null);

    useEffect(() => {
        const fetchCompanyHeader = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/employer/company', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data.success) {
                    setCompanyData(response.data.data); // Nhận về object chứa company_name, logo_url...
                }
            } catch (error) {
                console.error("Không thể lấy dữ liệu thu nhỏ của công ty", error);
            }
        };

        fetchCompanyHeader();
    }, []);
    // Quản lý Tab chức năng chính
    const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, jobs, candidates

    // DỮ LIỆU MOCK ĐỂ ĐẢM BẢO GIAO DIỆN HIỂN THỊ TRỰC QUAN KHÔNG BỊ TRỐNG
    // 1. Danh sách Tin Tuyển Dụng
    const [jobs, setJobs] = useState([
        { id: 1, title: "Senior ReactJS Engineer", department: "Phòng Công Nghệ", applicants: 18, views: 1240, status: "Vận hành", deadline: "2026-07-15", tags: ["React", "Tailwind", "TypeScript"] },
        { id: 2, title: "Fullstack Node & React Developer", department: "Phòng Công Nghệ", applicants: 24, views: 2150, status: "Vận hành", deadline: "2026-06-30", tags: ["NodeJS", "ReactJS", "MongoDB"] },
        { id: 3, title: "UI/UX Designer (Figma expert)", department: "Phòng Design", applicants: 8, views: 680, status: "Đã đóng", deadline: "2026-05-20", tags: ["Figma", "UI/UX", "Prototyping"] },
        { id: 4, title: "Digital Marketing Specialist", department: "Phòng Kinh Doanh", applicants: 15, views: 940, status: "Vận hành", deadline: "2026-07-01", tags: ["SEO", "Google Ads", "Content"] },
    ]);

    // 2. Danh sách Ứng Viên Tuyển Dụng Real-time
    const [candidates, setCandidates] = useState([
        { id: 101, name: "Lê Nguyễn Trọng Phúc", jobTitle: "Senior ReactJS Engineer", email: "phuc.ln@gmail.com", exp: 3, education: "Đại học", skills: ["React", "Tailwind", "JavaScript"], status: "Chờ duyệt", timeApplied: "Vừa xong" },
        { id: 102, name: "Trần Toàn Phước", jobTitle: "Fullstack Node & React Developer", email: "phuoc.tt@gmail.com", exp: 2, education: "Cao đẳng", skills: ["NodeJS", "ReactJS", "Express"], status: "Phỏng vấn", timeApplied: "10 phút trước" },
        { id: 103, name: "Nguyễn Văn Hùng", jobTitle: "Senior ReactJS Engineer", email: "hung.nv@yahoo.com", exp: 5, education: "Đại học", skills: ["React", "TypeScript", "Redux"], status: "Nhận việc", timeApplied: "2 giờ trước" },
        { id: 104, name: "Phạm Thị Mai", jobTitle: "UI/UX Designer (Figma expert)", email: "maipham@gmail.com", exp: 1, education: "Trung cấp", skills: ["Figma", "Photoshop"], status: "Từ chối", timeApplied: "1 ngày trước" },
        { id: 105, name: "Hoàng Anh Tuấn", jobTitle: "Digital Marketing Specialist", email: "tuan.ha@outlook.com", exp: 4, education: "Đại học", skills: ["SEO", "Content"], status: "Chờ duyệt", timeApplied: "2 ngày trước" },
    ]);

    // Bộ lọc ứng viên nâng cao
    const [filterSkill, setFilterSkill] = useState("Tất cả");
    const [filterExp, setFilterExp] = useState("Tất cả");
    const [filterEdu, setFilterEdu] = useState("Tất cả");

    // State điều khiển các Modal Form tương tác
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [newStatusTarget, setNewStatusTarget] = useState("");

    // Biểu mẫu tạo mới tin đăng
    const [newJob, setNewJob] = useState({ title: "", department: "", deadline: "", tagsText: "" });
    const [emailDetails, setEmailDetails] = useState({ time: "09:00", date: "", location: "65 Huỳnh Thúc Kháng, Q.1, TP.HCM", note: "" });

    // XỬ LÝ QUY TRÌNH TIN TUYỂN DỤNG
    const handleCreateJob = (e) => {
        e.preventDefault();
        if (!newJob.title || !newJob.tagsText) return alert("Vui lòng nhập tên công việc và kỹ năng bắt buộc!");
        const tagsArray = newJob.tagsText.split(",").map(t => t.trim()).filter(t => t.length > 0);
        const created = {
            id: jobs.length + 1,
            title: newJob.title,
            department: newJob.department || "Phòng Ban Chung",
            applicants: 0,
            views: 1,
            status: "Vận hành",
            deadline: newJob.deadline || "2026-08-30",
            tags: tagsArray
        };
        setJobs([created, ...jobs]);
        setNewJob({ title: "", department: "", deadline: "", tagsText: "" });
        setShowCreateModal(false);
    };

    const handleToggleJobStatus = (id) => {
        setJobs(jobs.map(j => {
            if (j.id === id) {
                return { ...j, status: j.status === "Vận hành" ? "Đã đóng" : "Vận hành" };
            }
            return j;
        }));
    };

    const handleExtendJob = (id) => {
        setJobs(jobs.map(j => {
            if (j.id === id) {
                return { ...j, deadline: "2026-08-31", status: "Vận hành" };
            }
            return j;
        }));
        alert("Đã gia hạn thành công thời gian nộp hồ sơ đến 31/08/2026!");
    };

    // XỬ LÝ TRẠNG THÁI CV & ĐIỀU HƯỚNG EMAIL TỰ ĐỘNG
    const initiateStatusChange = (candidate, targetStatus) => {
        setSelectedCandidate(candidate);
        setNewStatusTarget(targetStatus);
        // Chuẩn bị sẵn ngày mặc định cho email hẹn phỏng vấn
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);
        setEmailDetails({ ...emailDetails, date: tomorrow.toISOString().split('T')[0] });
        setShowEmailModal(true);
    };

    const confirmStatusAndSendEmail = () => {
        // Cập nhật trạng thái ứng viên
        setCandidates(candidates.map(c => {
            if (c.id === selectedCandidate.id) {
                return { ...c, status: newStatusTarget };
            }
            return c;
        }));
        setShowEmailModal(false);
        alert(`Hệ thống đã kích hoạt và gửi email thông báo trạng thái [${newStatusTarget}] tự động đến ứng viên ${selectedCandidate.name}!`);
    };

    // SÀNG LỌC ỨNG VIÊN THEO TIÊU CHÍ NÂNG CAO
    const filteredCandidates = candidates.filter(c => {
        const matchSkill = filterSkill === "Tất cả" || c.skills.includes(filterSkill);
        const matchEdu = filterEdu === "Tất cả" || c.education === filterEdu;
        let matchExp = true;
        if (filterExp === "fresher") matchExp = c.exp < 2;
        if (filterExp === "junior") matchExp = c.exp >= 2 && c.exp <= 4;
        if (filterExp === "senior") matchExp = c.exp > 4;
        return matchSkill && matchEdu && matchExp;
    });

    return (
        <div className="w-full min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased flex">

            {/* SIDEBAR ĐIỀU HƯỚNG RIÊNG CHO NHÀ TUYỂN DỤNG */}
            <aside className="w-64 bg-white border-r border-orange-100 flex flex-col justify-between shrink-0 sticky top-0 h-screen">
                <div>
                    {/* Logo Brand Đồng Nhất */}
                    <div className="p-6 border-b border-orange-50/50 flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 font-black text-white text-lg shadow-sm">V</div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            VIECLAM<span className="text-orange-500 font-extrabold">PRO</span>
                        </span>
                    </div>

                    {/* Nhãn phân vùng nhà tuyển dụng */}
                    <div className="px-6 py-3">
                        <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Nhà Tuyển Dụng Portal
                        </span>
                    </div>

                    {/* Danh sách Tab chuyển đổi */}
                    <nav className="mt-4 px-3 space-y-1">
                        <button
                            onClick={() => setActiveTab("dashboard")}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === "dashboard" ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <LayoutDashboard size={16} /> Thống kê hiệu quả
                        </button>
                        <button
                            onClick={() => setActiveTab("jobs")}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === "jobs" ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <Briefcase size={16} /> Quản lý tin đăng
                        </button>
                        <button
                            onClick={() => setActiveTab("candidates")}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === "candidates" ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <Users size={16} /> Hồ sơ ứng viên
                            <span className="ml-auto bg-rose-500 text-white text-[10px] font-black h-5 px-1.5 min-w-5 flex items-center justify-center rounded-full animate-pulse">
                                2
                            </span>
                        </button>
                    </nav>
                </div>

                {/* Thông tin tài khoản ở góc dưới sidebar */}
                <Link
                    to="/employer/profile" // Thay đường dẫn này bằng route dẫn tới trang hồ sơ công ty của bạn
                    className="p-4 border-t border-slate-100 bg-slate-50/50 m-3 rounded-xl flex items-center gap-3 hover:bg-orange-50/60 transition-all cursor-pointer group decor-none block"
                >
                    {/* Hiển thị Logo Công ty thay cho khối chữ HR */}
                    <img
                        src={companyData?.logo_url ? `http://127.0.0.1:8000/${companyData.logo_url}` : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150"}
                        alt={companyData?.company_name || "Company Logo"}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 group-hover:border-orange-300 transition-colors shrink-0"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150"; }} // Fallback khi lỗi ảnh
                    />

                    <div className="overflow-hidden flex-1">
                        {/* Hiển thị Tên Công ty (company_name) */}
                        <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">
                            {companyData?.company_name || "Đang tải thông tin..."}
                        </h4>
                        {/* Subtext điều hướng trực quan */}
                        <p className="text-[10px] text-slate-400 truncate">
                            Xem hồ sơ doanh nghiệp
                        </p>
                    </div>
                </Link>
            </aside>

            {/* KHU VỰC CHỨA NỘI DUNG CHÍNH (MAIN PANEL) */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">

                {/* TOPBAR BANNER NHỎ */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-orange-100 pb-5 mb-6">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            {activeTab === "dashboard" && "Dashboard Phân Tích Tổng Quan"}
                            {activeTab === "jobs" && "Vận Hành Quy Trình Tin Đăng"}
                            {activeTab === "candidates" && "Sàng Lọc & Tiếp Nhận Hồ Sơ Real-time"}
                            <Sparkles size={16} className="text-amber-500" />
                        </h1>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Hệ thống khớp lệnh tuyển dụng thông minh ứng dụng AI</p>
                    </div>

                    {activeTab === "jobs" && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
                        >
                            <Plus size={14} /> Đăng tin tuyển dụng mới
                        </button>
                    )}
                </header>

                {/* THỐNG KÊ HIỆU QUẢ (DASHBOARD)*/}
                {activeTab === "dashboard" && (
                    <div className="space-y-6">
                        {/* Hàng Thẻ Chỉ Số (Metric Cards) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500"><Briefcase size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tin Đang Chạy</p>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">3 / 4</h3>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><Users size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng CV Đã Tiếp Nhận</p>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">80 Hồ sơ</h3>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500"><TrendingUp size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lượt Tiếp Cận Tin</p>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">5,010 Lượt</h3>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500"><Mail size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tỷ Lệ Mời Phỏng Vấn</p>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">38.5%</h3>
                                </div>
                            </div>
                        </div>

                        {/* Đồ Thị Biểu Diễn Lượt Tiếp Cận Và CV Nộp Theo Thời Gian */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Biểu đồ lượt tiếp cận */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                        <BarChart3 size={14} className="text-orange-500" /> Biểu đồ lượt tiếp cận tin đăng (Tuần này)
                                    </h3>
                                    <span className="text-[10px] text-slate-400 font-medium">Cập nhật: 5 phút trước</span>
                                </div>
                                {/* Thiết kế biểu đồ cột dạng Custom Tailwind thuần (Không lo lỗi thư viện) */}
                                <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
                                    <div className="w-full flex flex-col items-center gap-2">
                                        <div className="w-full bg-orange-100 rounded-t-lg transition-all hover:bg-orange-500 h-16 relative group">
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">420</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400">Thứ 2</span>
                                    </div>
                                    <div className="w-full flex flex-col items-center gap-2">
                                        <div className="w-full bg-orange-100 rounded-t-lg transition-all hover:bg-orange-500 h-24 relative group">
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">680</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400">Thứ 3</span>
                                    </div>
                                    <div className="w-full flex flex-col items-center gap-2">
                                        <div className="w-full bg-orange-500 rounded-t-lg h-36 relative group">
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[9px] px-1 rounded opacity-100">1240</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-700">Thứ 4</span>
                                    </div>
                                    <div className="w-full flex flex-col items-center gap-2">
                                        <div className="w-full bg-orange-100 rounded-t-lg transition-all hover:bg-orange-500 h-28 relative group">
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">890</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400">Thứ 5</span>
                                    </div>
                                    <div className="w-full flex flex-col items-center gap-2">
                                        <div className="w-full bg-orange-100 rounded-t-lg transition-all hover:bg-orange-500 h-32 relative group">
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">1020</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400">Thứ 6</span>
                                    </div>
                                    <div className="w-full flex flex-col items-center gap-2">
                                        <div className="w-full bg-orange-100 rounded-t-lg transition-all hover:bg-orange-500 h-20 relative group">
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">510</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400">Thứ 7</span>
                                    </div>
                                </div>
                            </div>

                            {/* Biểu đồ số lượng hồ sơ nộp */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                        <BarChart3 size={14} className="text-blue-500" /> Biểu đồ số lượng CV ứng tuyển theo thời gian
                                    </h3>
                                    <span className="text-[10px] text-slate-400 font-medium">Đơn vị: Hồ sơ</span>
                                </div>
                                <div className="h-44 flex items-end justify-between gap-4 pt-6 pb-2 px-4">
                                    <div className="w-full flex flex-col items-center gap-1.5">
                                        <div className="w-8 bg-blue-100 hover:bg-blue-600 transition-colors rounded-t h-12 text-center text-[10px] font-bold text-slate-700 pt-1">5</div>
                                        <span className="text-[9px] font-medium text-slate-400">Tuần 1</span>
                                    </div>
                                    <div className="w-full flex flex-col items-center gap-1.5">
                                        <div className="w-8 bg-blue-100 hover:bg-blue-600 transition-colors rounded-t h-20 text-center text-[10px] font-bold text-slate-700 pt-1">12</div>
                                        <span className="text-[9px] font-medium text-slate-400">Tuần 2</span>
                                    </div>
                                    <div className="w-full flex flex-col items-center gap-1.5">
                                        <div className="w-8 bg-blue-600 rounded-t h-36 text-center text-[10px] font-bold text-white pt-1">24</div>
                                        <span className="text-[9px] font-bold text-slate-700">Tuần 3</span>
                                    </div>
                                    <div className="w-full flex flex-col items-center gap-1.5">
                                        <div className="w-8 bg-blue-100 hover:bg-blue-600 transition-colors rounded-t h-24 text-center text-[10px] font-bold text-slate-700 pt-1">16</div>
                                        <span className="text-[9px] font-medium text-slate-400">Tuần 4</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hoạt động tuyển dụng gần đây */}
                        <div className="bg-[#FBF4DC] rounded-2xl border border-amber-200/60 p-5">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles size={13} className="text-amber-600" /> Đánh giá hiệu suất từ Trợ lý thông minh SmartJob AI
                            </h3>
                            <p className="text-xs text-slate-700 leading-relaxed mt-2">
                                Tin đăng <span className="font-bold">"Fullstack Node & React Developer"</span> đang đạt hiệu suất khớp mã (Matching Score) rất cao với nhóm sinh viên K23 Công nghệ thông tin trường Cao Thắng. Đã có <span className="font-bold text-blue-600">24 CV ứng tuyển</span> trong vòng 48h qua, phân phối điểm hồ sơ tập trung ở mức 85/100 điểm kỹ năng cốt lõi. Hãy tiến hành lọc hồ sơ ngay!
                            </p>
                        </div>
                    </div>
                )}

                {/* QUẢN LÝ TIN TUYỂN DỤNG */}
                {activeTab === "jobs" && (
                    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
                            <div className="relative w-full sm:w-72">
                                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm tin tuyển dụng..."
                                    className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 outline-none focus:border-orange-400 text-slate-700"
                                />
                            </div>
                            <div className="flex gap-2 text-xs text-slate-500 font-medium self-end sm:self-auto">
                                <span>Tổng cộng: <strong className="text-slate-800">{jobs.length}</strong> tin</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        <th className="p-4">Tên công việc / Vị trí</th>
                                        <th className="p-4">Phòng ban</th>
                                        <th className="p-4 text-center">Lượt xem</th>
                                        <th className="p-4 text-center">Số lượng CV</th>
                                        <th className="p-4">Hạn nộp hồ sơ</th>
                                        <th className="p-4 text-center">Trạng thái</th>
                                        <th className="p-4 text-right">Thao tác xử lý</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs divide-y divide-slate-100">
                                    {jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-900 text-sm">{job.title}</div>
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {job.tags.map((t, idx) => (
                                                        <span key={idx} className="bg-amber-100/70 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600 font-medium">{job.department}</td>
                                            <td className="p-4 text-center font-mono font-medium text-slate-600">{job.views}</td>
                                            <td className="p-4 text-center">
                                                <span className="font-mono font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[11px]">
                                                    {job.applicants} CV
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500 font-mono">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} /> {job.deadline}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${job.status === "Vận hành" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                                                    }`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                                <button className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleExtendJob(job.id)}
                                                    className="text-amber-600 hover:text-amber-700 font-bold hover:underline"
                                                >
                                                    Gia hạn
                                                </button>
                                                <button
                                                    onClick={() => handleToggleJobStatus(job.id)}
                                                    className={`font-bold hover:underline ${job.status === "Vận hành" ? "text-rose-500 hover:text-rose-600" : "text-emerald-600 hover:text-emerald-700"}`}
                                                >
                                                    {job.status === "Vận hành" ? "Đóng tin" : "Mở lại"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/*QUẢN LÝ HỒ SƠ ỨNG VIÊN & TƯƠNG TÁ*/}
                {activeTab === "candidates" && (
                    <div className="flex flex-col md:flex-row gap-5 items-start">

                        {/* COMPONENT BỘ LỌC BÊN TRÁI (Thiết kế đồng nhất SidebarLeft của ứng viên) */}
                        <div className="w-full md:w-[220px] bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4 shrink-0">
                            <div className="flex items-center gap-1 border-b border-slate-100 pb-2">
                                <Filter size={13} className="text-orange-500" />
                                <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-700">Bộ lọc sàng lọc</h2>
                            </div>

                            {/* Lọc theo Kỹ Năng */}
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Kỹ năng bắt buộc</label>
                                <select
                                    value={filterSkill}
                                    onChange={(e) => setFilterSkill(e.target.value)}
                                    className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 outline-none focus:border-orange-400 cursor-pointer"
                                >
                                    <option value="Tất cả">Tất cả kỹ năng</option>
                                    <option value="React">React / ReactJS</option>
                                    <option value="NodeJS">NodeJS</option>
                                    <option value="Figma">Figma</option>
                                    <option value="SEO">SEO</option>
                                </select>
                            </div>

                            {/* Lọc theo Số Năm Kinh Nghiệm */}
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Số năm kinh nghiệm</label>
                                <select
                                    value={filterExp}
                                    onChange={(e) => setFilterExp(e.target.value)}
                                    className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 outline-none focus:border-orange-400 cursor-pointer"
                                >
                                    <option value="Tất cả">Mọi kinh nghiệm</option>
                                    <option value="fresher">Dưới 2 năm (Fresher)</option>
                                    <option value="junior">Từ 2 - 4 năm (Junior)</option>
                                    <option value="senior">Trên 4 năm (Senior)</option>
                                </select>
                            </div>

                            {/* Lọc theo Trình độ học vấn */}
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Học vấn tối thiểu</label>
                                <div className="space-y-1.5 mt-1 text-[11px] text-slate-600">
                                    {["Tất cả", "Đại học", "Cao đẳng", "Trung cấp"].map((edu) => (
                                        <label key={edu} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="eduFilter"
                                                checked={filterEdu === edu}
                                                onChange={() => setFilterEdu(edu)}
                                                className="border-slate-300 text-orange-500 focus:ring-orange-400 h-3 w-3"
                                            />
                                            <span>{edu}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => { setFilterSkill("Tất cả"); setFilterExp("Tất cả"); setFilterEdu("Tất cả"); }}
                                className="w-full py-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors uppercase tracking-wider text-center">
                                Xóa tất cả bộ lọc
                            </button>
                        </div>

                        {/* DANH SÁCH ỨNG VIÊN TIẾP NHẬN THEO THỜI GIAN THỰC (Phía bên phải) */}
                        <div className="flex-1 w-full space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                    Hồ sơ tìm thấy ({filteredCandidates.length})
                                </h2>
                                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live stream CV kết nối thời gian thực
                                </div>
                            </div>

                            {filteredCandidates.length === 0 ? (
                                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs">
                                    Không tìm thấy ứng viên nào phù hợp với bộ lọc hiện tại.
                                </div>
                            ) : (
                                filteredCandidates.map((candidate) => (
                                    <div
                                        key={candidate.id}
                                        className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm transition-all hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                        {/* Cột trái: Thông tin cá nhân ứng viên */}
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-black text-slate-900 hover:text-orange-500 transition-colors cursor-pointer">
                                                    {candidate.name}
                                                </h3>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${candidate.status === "Chờ duyệt" ? "bg-amber-100 text-amber-800" :
                                                    candidate.status === "Phỏng vấn" ? "bg-blue-100 text-blue-800" :
                                                        candidate.status === "Nhận việc" ? "bg-emerald-100 text-emerald-800" :
                                                            "bg-rose-100 text-rose-800"
                                                    }`}>
                                                    {candidate.status}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono ml-auto sm:ml-0">{candidate.timeApplied}</span>
                                            </div>

                                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                Ứng tuyển vị trí: <strong className="text-slate-700 font-semibold">{candidate.jobTitle}</strong>
                                            </p>

                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 pt-1">
                                                <span className="flex items-center gap-0.5 text-slate-500"><Award size={12} /> {candidate.exp} năm kinh nghiệm</span>
                                                <span className="flex items-center gap-0.5 text-slate-500"><MapPin size={12} /> Học vấn: {candidate.education}</span>
                                                <span className="text-slate-400">| Email: {candidate.email}</span>
                                            </div>

                                            {/* Từ khóa tags kỹ năng */}
                                            <div className="flex flex-wrap gap-1 pt-1.5">
                                                {candidate.skills.map((skill, i) => (
                                                    <span key={i} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Cột phải: Thao tác chuyển đổi trạng thái quy trình & Gọi Email */}
                                        <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
                                            <div className="relative w-full sm:w-auto">
                                                <select
                                                    value={candidate.status}
                                                    onChange={(e) => initiateStatusChange(candidate, e.target.value)}
                                                    className="w-full sm:w-36 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer focus:border-orange-400 appearance-none pr-8"
                                                >
                                                    <option value="Chờ duyệt">Chờ duyệt</option>
                                                    <option value="Phỏng vấn">Phỏng vấn</option>
                                                    <option value="Từ chối">Từ chối</option>
                                                    <option value="Nhận việc">Nhận việc</option>
                                                </select>
                                                <ChevronDown size={12} className="text-slate-400 absolute right-2 top-2 pointer-events-none" />
                                            </div>

                                            <button className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg w-full sm:w-36 text-center transition-colors">
                                                Xem trực tuyến CV
                                            </button>
                                        </div>

                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                )}

            </main>


            {/* MODAL COMPONENT: TẠO MỚI TIN TUYỂN DỤNG VÀ THIẾT LẬP TAG KỸ NĂNG BẮT BUỘC */}

            {/* ========================================================================= */}
            {/* 4. MODAL COMPONENT: TẠO MỚI TIN TUYỂN DỤNG VÀ THIẾT LẬP CHI TIẾT (ĐÃ SỬA LỖI CUỘN) */}
            {/* ========================================================================= */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-fade-in">
                    {/* Khung trắng Form: Khống chế chiều cao tối đa bằng 90% màn hình */}
                    <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
                        {/* HEADER CỐ ĐỊNH */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <Briefcase size={16} className="text-blue-600" /> Tạo tin tuyển dụng mới
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">Điền đầy đủ thông tin để hệ thống AI phân tích và khớp lệnh ứng viên</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                className="text-slate-400 hover:text-slate-600 font-bold p-1 hover:bg-slate-100 rounded-lg text-sm transition-colors">
                                ✕
                            </button>
                        </div>
                        {/* THÂN FORM - VÙNG NHẬP LIỆU CHO PHÉP CUỘN ĐỘC LẬP (OVERFLOW-Y-AUTO) */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-700 bg-[#FFFDF9]/30">
                            {/* PHẦN 1: THÔNG TIN CHUNG */}
                            <div>
                                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <span className="w-1 h-3.5 bg-blue-600 rounded-full"></span> Thông tin chung
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1.5">Tiêu đề công việc <span className="text-rose-500">*</span></label>
                                        <input type="text" required placeholder="VD: Senior Frontend Developer (ReactJS)" className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1.5">Mức lương</label>
                                        <input type="text" placeholder="VD: 22 - 35 Triệu hoặc Thỏa thuận" className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1.5">Ngành nghề</label>
                                        <select className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-500 transition-all cursor-pointer">
                                            <option value="">Chọn ngành nghề</option>
                                            <option value="it">Công nghệ thông tin</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="design">Thiết kế đồ họa</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1.5">Cấp bậc yêu cầu</label>
                                        <select className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-500 transition-all cursor-pointer">
                                            <option value="">Chọn cấp bậc</option>
                                            <option value="intern">Intern / Thực tập sinh</option>
                                            <option value="fresher">Fresher</option>
                                            <option value="junior">Junior</option>
                                            <option value="senior">Senior</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1.5">Hình thức làm việc</label>
                                        <select className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-500 transition-all cursor-pointer">
                                            <option value="fulltime">Toàn thời gian</option>
                                            <option value="parttime">Bán thời gian</option>
                                            <option value="remote">Làm việc từ xa</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1.5">Hạn cuối nộp hồ sơ <span className="text-rose-500">*</span></label>
                                        <input type="date" required className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1.5">Địa điểm làm việc</label>
                                        <input type="text" placeholder="VD: Quận 1, TP. Hồ Chí Minh" className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-500 transition-all" />
                                    </div>
                                </div>
                            </div>
                            {/* PHẦN 2: CHI TIẾT CÔNG VIỆC */}
                            <div className="border-t border-slate-100 pt-5">
                                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <span className="w-1 h-3.5 bg-blue-600 rounded-full"></span> Chi tiết công việc
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1.5">Mô tả công việc <span className="text-rose-500">*</span></label>
                                        <textarea rows="4" placeholder="- Phát triển giao diện người dùng bằng ReactJS..." className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-500 transition-all resize-none leading-relaxed"></textarea>
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1.5">Yêu cầu ứng viên <span className="text-rose-500">*</span></label>
                                        <textarea rows="4" placeholder="- Có tối thiểu 2 năm kinh nghiệm làm việc với React..." className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-500 transition-all resize-none leading-relaxed"></textarea>
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1.5">Quyền lợi được hưởng</label>
                                        <textarea rows="4" placeholder="- Mức lương cạnh tranh, tháng lương 13..." className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-500 transition-all resize-none leading-relaxed"></textarea>
                                    </div>
                                </div>
                            </div>
                            {/* PHẦN 3: TỪ KHÓA KỸ NĂNG */}
                            <div className="border-t border-slate-100 pt-5">
                                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <span className="w-1 h-3.5 bg-blue-600 rounded-full"></span> Từ khóa kỹ năng (Tags)
                                </h4>
                                <label className="block font-bold text-slate-500 uppercase text-[9px] mb-1.5">Kỹ năng cốt lõi bắt buộc (Cách nhau bằng dấu phẩy)</label>
                                <input type="text" placeholder="VD: React, Tailwind, TypeScript" className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-500 transition-all font-mono" />
                                <p className="text-[10px] text-slate-400 mt-1">Hệ thống dựa vào các tag này để chấm điểm Matching Score với CV ứng viên.</p>
                            </div>

                        </div>
                        {/* FOOTER CỐ ĐỊNH - KHÔNG BỊ TRÔI, LUÔN BẤM ĐƯỢC */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2.5 shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 font-bold rounded-xl transition-all">
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    alert("Đã đăng tin tuyển dụng mới thành công!");
                                    setShowCreateModal(false);
                                }}
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm shadow-blue-600/10 transition-all flex items-center gap-1.5">
                                Kích hoạt đăng tin
                            </button>
                        </div>

                    </div>
                </div>
            )}


            {/* CẬP NHẬT TRẠNG THÁI CV & TỰ ĐỘNG THIẾT LẬP EMAIL THÔNG BÁO */}

            {showEmailModal && selectedCandidate && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-scale-up">
                        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                                <Mail size={15} /> Cấu hình Email gửi tự động theo trạng thái
                            </h3>
                            <button onClick={() => setShowEmailModal(false)} className="text-white/80 hover:text-white font-bold text-sm">✕</button>
                        </div>

                        <div className="p-5 space-y-4 text-xs text-slate-700">
                            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
                                Hệ thống chuẩn bị chuyển hồ sơ của <strong className="text-slate-900">{selectedCandidate.name}</strong> sang trạng thái:
                                <span className="ml-1 bg-blue-600 text-white font-black px-2 py-0.5 rounded text-[10px] uppercase">
                                    {newStatusTarget}
                                </span>
                            </div>

                            {/* Nếu là trạng thái hẹn phỏng vấn, hiển thị input nhập thời gian, địa điểm */}
                            {newStatusTarget === "Phỏng vấn" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 border border-slate-200 rounded-xl">
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Giờ phỏng vấn</label>
                                        <input
                                            type="time"
                                            value={emailDetails.time}
                                            onChange={(e) => setEmailDetails({ ...emailDetails, time: e.target.value })}
                                            className="w-full border p-1.5 bg-white rounded outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Ngày phỏng vấn</label>
                                        <input
                                            type="date"
                                            value={emailDetails.date}
                                            onChange={(e) => setEmailDetails({ ...emailDetails, date: e.target.value })}
                                            className="w-full border p-1.5 bg-white rounded outline-none"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Địa điểm / Link Online</label>
                                        <input
                                            type="text"
                                            value={emailDetails.location}
                                            onChange={(e) => setEmailDetails({ ...emailDetails, location: e.target.value })}
                                            className="w-full border p-1.5 bg-white rounded outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Bản xem trước Email (Mail Preview Component) */}
                            <div>
                                <label className="block font-bold text-slate-400 uppercase text-[9px] mb-1">Xem trước nội dung thư gửi ứng viên</label>
                                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 max-h-48 overflow-y-auto font-sans text-slate-600 leading-relaxed space-y-2">
                                    <p><strong>Tiêu đề:</strong> Thông báo về trạng thái hồ sơ ứng tuyển vị trí {selectedCandidate.jobTitle} - SmartJob System</p>
                                    <hr className="border-slate-200 my-2" />
                                    <p>Chào <strong>{selectedCandidate.name}</strong>,</p>

                                    {newStatusTarget === "Chờ duyệt" && (
                                        <p>Hệ thống đã nhận được CV của bạn. Nhà tuyển dụng đang tiến hành rà soát các tiêu chí kỹ năng. Chúng tôi sẽ phản hồi sớm nhất.</p>
                                    )}
                                    {newStatusTarget === "Phỏng vấn" && (
                                        <>
                                            <p>Chúc mừng bạn! Hồ sơ của bạn đã vượt qua vòng sàng lọc kỹ năng xuất sắc. Chúng tôi trân trọng mời bạn tham gia buổi phỏng vấn trực tiếp vào lúc:</p>
                                            <ul className="list-disc pl-5 font-bold text-slate-800 space-y-0.5">
                                                <li>Thời gian: {emailDetails.time} ngày {emailDetails.date}</li>
                                                <li>Địa điểm: {emailDetails.location}</li>
                                            </ul>
                                        </>
                                    )}
                                    {newStatusTarget === "Từ chối" && (
                                        <p>Cảm ơn bạn đã quan tâm đến vị trí của công ty. Rất tiếc hiện tại kỹ năng của hồ sơ chưa hoàn toàn trùng khớp với định hướng hiện tại. Hy vọng được cộng tác với bạn ở các dự án sau.</p>
                                    )}
                                    {newStatusTarget === "Nhận việc" && (
                                        <p>Chúc mừng! Ban nhân sự trân trọng thông báo bạn đã chính thức được tiếp nhận làm việc. Bộ phận HR sẽ liên hệ gửi Offer Letter chi tiết đến bạn trong ngày hôm nay.</p>
                                    )}

                                    <p className="text-[11px] text-slate-400 pt-3">Trân trọng,<br />Đội ngũ tuyển dụng SmartJob Hub</p>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowEmailModal(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-lg"
                                >
                                    Đóng lại
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmStatusAndSendEmail}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1"
                                >
                                    <Send size={12} /> Phê duyệt & Gửi Email ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}