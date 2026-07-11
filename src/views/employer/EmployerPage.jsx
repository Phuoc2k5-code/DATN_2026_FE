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
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("activeTab") || "statistics";
    });
    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [extendingJob, setExtendingJob] = useState(null);
    const [newDeadline, setNewDeadline] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [skills, setSkills] = useState([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [skillsList, setSkillsList] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        activeJobs: 0,
        totalJobs: 0,
        totalCVs: 0,
        totalViews: 0,
        interviewRate: 0,
        weeklyViewsChart: [],
        cvChartData: []
    });
    useEffect(() => {
        if (activeTab === "dashboard") {
            const fetchStats = async () => {
                try {
                    const token = localStorage.getItem('token');
                    // SỬA QUAN TRỌNG NHẤT Ở ĐÂY: Dùng dấu backtick (`) và gắn ?week_offset=${weekOffset} vào cuối link
                    const response = await axios.get(`http://127.0.0.1:8000/api/employer/dashboard-stats?week_offset=${weekOffset}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.data.success) {
                        setDashboardStats(response.data.data);
                    }
                } catch (error) {
                    console.error("Lỗi khi tải thông số Dashboard:", error);
                }
            };

            fetchStats();
        }
    }, [activeTab, weekOffset]);

    const [newJob, setNewJob] = useState({
        title: "",
        category_id: "",
        level: "Nhân viên",
        salary_min: "",
        salary_max: "",
        is_negotiable: false,
        location: "",
        description: "",
        requirements: "",
        benefits: "",
        expired_at: "",
        skills: []
    });

    useEffect(() => {
        loadEmployerJobs();
        loadCategories();
    }, []);

    // Hàm gọi API Laravel lấy danh sách bài đăng
    const loadEmployerJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/employer/jobs", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                console.log("👉 DỮ LIỆU THỰC TẾ TỪ API:", response.data.data);
                setJobs(response.data.data);
            }
        } catch (err) {
            console.error("Lỗi khi tải danh sách việc làm:", err);
            setError("Không thể kết nối đến máy chủ hoặc phiên làm việc hết hạn.");
        } finally {
            setLoading(false);
        }
    };
    const loadCategories = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/categories");
            if (response.data.success) {
                setCategoriesList(response.data.data);

                // Tinh tế: Tự động set value mặc định của Form đăng tin thành ID của danh mục đầu tiên
                if (response.data.data.length > 0) {
                    setNewJob(prev => ({ ...prev, category_id: response.data.data[0].id }));
                }
            }
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
        }
    };

    //  Các hàm xử lý sự kiện khi click nút (để không bị lỗi undefined)
    const handleViewDetails = (job) => {
        setSelectedJob(job);
    };
    // Hàm đóng Modal
    const handleCloseModal = () => {
        setSelectedJob(null);
    };
    const handleExtendJob = (job) => {
        setExtendingJob(job);
        setNewDeadline(""); // Xóa trắng ô nhập ngày cũ
    };

    // Hàm gửi API lên Backend
    const submitExtendJob = async () => {
        if (!newDeadline) {
            alert("Vui lòng chọn ngày hết hạn mới!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`http://127.0.0.1:8000/api/employer/jobs/${extendingJob.id}/extend`, {
                new_deadline: newDeadline
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                alert(response.data.message);
                setExtendingJob(null); // Đóng Modal
                loadEmployerJobs();    // Tải lại danh sách
            }
        } catch (err) {
            // Bắt lỗi Validation từ Laravel (Ví dụ: Ngày chọn ở trong quá khứ)
            if (err.response && err.response.data && err.response.data.errors) {
                alert(Object.values(err.response.data.errors)[0][0]);
            } else {
                alert("Có lỗi xảy ra khi gia hạn! Vui lòng thử lại.");
            }
        }
    };
    const handleToggleJobStatus = async (jobId, currentStatus) => {
        // 1. Chặn ngay ở Frontend nếu đang chờ duyệt (Rất tốt, giảm tải cho server)
        if (currentStatus === "Chờ duyệt") {
            alert("Tin tuyển dụng này đang chờ Admin phê duyệt, bạn chưa thể thao tác!");
            return;
        }

        const confirmMessage = currentStatus === "Vận hành" // Hoặc 'active' tùy cách bạn map dữ liệu
            ? "Bạn có chắc chắn muốn ĐÓNG tin tuyển dụng này không?"
            : "Bạn có chắc chắn muốn MỞ LẠI tin tuyển dụng này không?";

        if (!window.confirm(confirmMessage)) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`http://127.0.0.1:8000/api/employer/jobs/${jobId}/toggle-status`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // Cập nhật thành công -> Gọi lại hàm tải danh sách
                loadEmployerJobs();
                
                // Bạn có thể bật thêm dòng này để hiện thông báo Thành công từ Laravel
                // alert(response.data.message); 
            }
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
            
            // 2. SỬA CHỖ NÀY: Bóc tách thông báo lỗi từ Laravel
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message); // In ra "Tin này đã bị Admin từ chối..."
            } else {
                alert("Có lỗi xảy ra khi cập nhật! Vui lòng thử lại sau."); // Lớp dự phòng khi đứt cáp, mất mạng
            }
        }
    };
    const handleCreateJob = async (e) => {
        e.preventDefault(); // Chặn hành vi tải lại trang mặc định của Form html

        //  Kiểm tra logic nếu không thỏa thuận thì phải nhập đủ mức lương
        if (!newJob.is_negotiable && (!newJob.salary_min || !newJob.salary_max)) {
            alert("Vui lòng nhập đầy đủ Mức lương tối thiểu và tối đa!");
            return;
        }

        //  Kiểm tra xem nhà tuyển dụng đã chọn ít nhất 1 kỹ năng chưa
        if (!newJob.skills || newJob.skills.length === 0) {
            alert("Vui lòng chọn ít nhất một kỹ năng chuyên môn yêu cầu!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://127.0.0.1:8000/api/employer/jobs", newJob, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                alert(response.data.message);
                setIsAddModalOpen(false); // Đóng Modal

                // bổ sung skills: [] để làm sạch form hoàn toàn
                setNewJob({
                    title: "",
                    category_id: "", //để trống để hiển thị placeholder mặc định
                    level: "Nhân viên",
                    salary_min: "",
                    salary_max: "",
                    is_negotiable: false,
                    location: "",
                    description: "",
                    requirements: "",
                    benefits: "",
                    expired_at: "",
                    skills: [] // <--- THÊM DÒNG NÀY ĐỂ RESET KHÔNG BỊ LỖI LƯU THẺ CŨ
                });

                loadEmployerJobs(); // Cập nhật lại danh sách tự động
            }
        } catch (err) {
            // Sửa lại cách hiển thị lỗi validation để tránh crash giao diện
            if (err.response && err.response.data && err.response.data.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat();
                alert(errorMessages[0] || "Dữ liệu nhập vào không hợp lệ!");
            } else if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Có lỗi xảy ra khi đăng tin. Vui lòng thử lại!");
            }
        }
    };
    // Hàm mở Modal Sửa và nạp dữ liệu cũ vào form
    const handleOpenEdit = (job) => {
        // Ép toàn bộ ID kỹ năng cũ về dạng số nguyên (VD: [4, 16, 27]) để so sánh không bị lỗi
        const oldSkillIds = job.skills
            ? job.skills.map(skill => Number(typeof skill === 'object' ? skill.id : skill))
            : [];

        setEditingJob({
            ...job,
            is_negotiable: Boolean(job.is_negotiable), // true/false
            salary_min: job.salary_min || "",
            salary_max: job.salary_max || "",
            benefits: job.benefits || "",
            // Lưu mảng ID vào form
            skills: oldSkillIds
        });

        setIsEditModalOpen(true);
    };
    // Hàm gửi API cập nhật
    const handleUpdateJob = async (e) => {
        e.preventDefault();
        try {
            // Đóng gói dữ liệu gửi lên Laravel
            const payload = {
                title: editingJob.title,
                category_id: editingJob.category_id,
                level: editingJob.level,
                location: editingJob.location,
                salary_min: editingJob.salary_min || null,
                salary_max: editingJob.salary_max || null,
                is_negotiable: editingJob.is_negotiable ? 1 : 0,
                description: editingJob.description,
                requirements: editingJob.requirements,
                benefits: editingJob.benefits || null,
                skills: editingJob.skills || []
            };

            const token = localStorage.getItem("token");

            const response = await axios.put(
                `http://127.0.0.1:8000/api/employer/jobs/${editingJob.id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );
            if (response.data && response.data.success) {
                alert("Cập nhật thành công!");
                const updatedSkillsWithNames = editingJob.skills.map(id => {
                    return skillsList.find(s => s.id === id) || { id: id, name: 'Unknown' };
                });

                // 2. Cập nhật state danh sách jobs của bạn
                setJobs(prevJobs => prevJobs.map(job =>
                    job.id === editingJob.id
                        ? { ...job, ...payload, skills: updatedSkillsWithNames }
                        : job
                ));
                setIsEditModalOpen(false);
                // Gọi lại hàm fetch data (ví dụ: fetchCompanyJobs()) ở đây để làm mới danh sách bài viết
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Cập nhật thất bại, vui lòng kiểm tra lại dữ liệu.");
        }
    };
    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const loadCandidates = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/employer/candidates", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setCandidates(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách ứng viên:", error);
        }
    };
    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            // Gọi API cập nhật trạng thái
            await axios.put(`http://127.0.0.1:8000/api/applications/${applicationId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Cập nhật trạng thái và gửi email thành công!');

            // Cập nhật lại state danh sách ứng viên để giao diện đổi luôn mà không cần F5
            setCandidates(prevCandidates =>
                prevCandidates.map(candidate =>
                    candidate.id === applicationId
                        ? { ...candidate, status: newStatus }
                        : candidate
                )
            );

        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            alert('Có lỗi xảy ra, vui lòng kiểm tra lại!');
        }
    };

    useEffect(() => {
        // Chỉ gọi API khi người dùng đang ở tab "Ứng viên"
        if (activeTab === "candidates") {
            loadCandidates();
        }

        // Tuyệt đối KHÔNG dùng setInterval ở đây nữa nhé!

    }, [activeTab]);
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


    // Bộ lọc ứng viên nâng cao
    const [filterSkill, setFilterSkill] = useState("Tất cả");
    const [filterExp, setFilterExp] = useState("Tất cả");
    const [filterEdu, setFilterEdu] = useState("Tất cả");

    // State điều khiển các Modal Form tương tác
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [newStatusTarget, setNewStatusTarget] = useState("");

    const [emailDetails, setEmailDetails] = useState({ time: "09:00", date: "", location: "65 Huỳnh Thúc Kháng, Q.1, TP.HCM", note: "" });

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

    // SÀNG LỌC ỨNG VIÊN THEO TIÊU CHÍ NÂNG CAO\


    const filteredCandidates = candidates.filter(c => {
        // 1. BỎ QUA việc lọc kỹ năng ở đây (vì API đã lọc sẵn rồi)
        // const matchSkill = filterSkill === "Tất cả" || c.skills.includes(filterSkill); 

        // 2. Chỉ giữ lại lọc Edu và Exp
        const matchEdu = filterEdu === "Tất cả" || c.education === filterEdu;

        let matchExp = true;
        // Đảm bảo c.exp là số để so sánh (Phòng trường hợp API trả về chuỗi)
        const expValue = parseInt(c.exp) || 0;

        if (filterExp === "fresher") matchExp = expValue < 2;
        else if (filterExp === "junior") matchExp = expValue >= 2 && expValue <= 4;
        else if (filterExp === "senior") matchExp = expValue > 4;

        return matchEdu && matchExp;
    });
    const fetchCompanyJobs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/employer/jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setJobs(response.data.data);
            }
        } catch (err) {
            console.error(err);
            setError("Không thể tải danh sách.");
        } finally {
            setLoading(false);
        }

    };
    // Gọi API lấy toàn bộ kỹ năng khi component được render lần đầu
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/skills')
            .then(res => {
                // Kiểm tra nếu API trả về có thuộc tính data thì lấy res.data.data
                if (res.data && res.data.data) {
                    setSkills(res.data.data);
                } else {
                    setSkills(res.data); // Dự phòng nếu API trả về mảng trực tiếp
                }
            })
            .catch(err => console.error("Lỗi lấy danh sách kỹ năng:", err));
    }, []);
    const fetchCandidates = () => {
        // 1. Lấy token để gọi API bảo mật
        const token = localStorage.getItem('token');

        // 2. Xây dựng đường dẫn API kèm theo tham số tìm kiếm (id của skill)
        let url = 'http://127.0.0.1:8000/api/employer/candidates?';

        // Nếu filterSkill khác "Tất cả", tức là nó đang chứa ID của kỹ năng (VD: 1, 2, 3...)
        if (filterSkill !== 'Tất cả') {
            url += `skill=${filterSkill}&`;
        }
        // Gắn thêm các bộ lọc khác nếu có (VD: url += `exp=${filterExp}`)

        // 3. Gửi request
        axios.get(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                setCandidates(res.data?.data || []);
            })
            .catch(err => console.error("Lỗi khi lọc ứng viên:", err));
    };

    // Sử dụng useEffect để tự động chạy hàm fetchCandidates MỖI KHI giá trị filterSkill thay đổi
    useEffect(() => {
        fetchCandidates();

    }, [filterSkill]);
    useEffect(() => {
        // Chỉ gọi API khi tab đang mở là 'dashboard'
        if (activeTab === "dashboard") {
            const fetchStats = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://127.0.0.1:8000/api/employer/dashboard-stats', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.data.success) {
                        setDashboardStats(response.data.data); // Lưu dữ liệu vào State
                    }
                } catch (error) {
                    console.error("Lỗi khi tải thông số Dashboard:", error);
                }
            };

            fetchStats();
        }
    }, [activeTab]); // React sẽ tự động gọi lại hàm này nếu bạn bấm chuyển sang tab dashboard

    useEffect(() => {
        const fetchAllSkills = async () => {
            console.log("🚀 BƯỚC 1: Bắt đầu gọi API lấy danh sách kỹ năng...");
            try {
                // LƯU Ý: Thay đổi URL nếu Backend của bạn chạy ở port khác
                const response = await axios.get('http://127.0.0.1:8000/api/skills');

                console.log("✅ BƯỚC 2: API đã gọi thành công! Dữ liệu trả về là:", response);

                // Bắt bệnh cấu trúc dữ liệu
                if (response.data && response.data.data) {
                    console.log("🎯 BƯỚC 3: Dữ liệu dạng { success: true, data: [...] }. Đã lưu vào state!");
                    setSkillsList(response.data.data);
                }
                else if (Array.isArray(response.data)) {
                    console.log("🎯 BƯỚC 3: Dữ liệu trả về mảng trực tiếp [...]. Đã lưu vào state!");
                    setSkillsList(response.data);
                }
                else {
                    console.warn("⚠️ BƯỚC 3: Cấu trúc dữ liệu lạ, không tìm thấy mảng skills!", response.data);
                }

            } catch (error) {
                console.error("❌ LỖI RỒI: Không thể gọi được API lấy kỹ năng!");
                console.error("Chi tiết lỗi:", error.message);
                if (error.response) {
                    console.error("Backend Laravel báo lỗi:", error.response.data);
                }
            }
        };

        fetchAllSkills();
    }, []);

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
                            onClick={() => setIsAddModalOpen(true)}
                            className="whitespace-nowrap px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200">
                            Đăng tin mới
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
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                        {dashboardStats.activeJobs} / {dashboardStats.totalJobs}
                                    </h3>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><Users size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng CV Đã Tiếp Nhận</p>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                        {dashboardStats.totalCVs} Hồ sơ
                                    </h3>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500"><TrendingUp size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lượt Tiếp Cận Tin</p>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                        {dashboardStats.totalViews.toLocaleString('vi-VN')} Lượt
                                    </h3>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500"><Mail size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tỷ Lệ Mời Phỏng Vấn</p>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                        {dashboardStats.interviewRate}%
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Đồ Thị Biểu Diễn Lượt Tiếp Cận Và CV Nộp Theo Thời Gian */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Biểu đồ lượt tiếp cận */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                                <div className="flex justify-between items-center mb-4 gap-2">
                                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                                        <BarChart3 size={14} className="text-orange-500" /> Biểu đồ lượt tiếp cận tin đăng
                                    </h3>

                                    {/* BỘ CHỌN PHẠM VI 1 THÁNG MỚI NÂNG CẤP */}
                                    <select
                                        value={weekOffset}
                                        onChange={(e) => setWeekOffset(Number(e.target.value))}
                                        className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-slate-300 transition-all"
                                    >
                                        <option value={0}>Tuần này</option>
                                        <option value={1}>Tuần trước</option>
                                        <option value={2}>2 tuần trước</option>
                                        <option value={3}>3 tuần trước</option>
                                    </select>
                                </div>

                                {/* Thiết kế biểu đồ cột dạng Custom Tailwind thuần (Không lo lỗi thư viện) */}
                                <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
                                    {(() => {
                                        // Bộ khung mặc định phòng trường hợp chưa có dữ liệu
                                        const chartData = dashboardStats.weeklyViewsChart && dashboardStats.weeklyViewsChart.length > 0
                                            ? dashboardStats.weeklyViewsChart
                                            : [
                                                { label: 'Thứ 2', clicks: 0, date_format: '' },
                                                { label: 'Thứ 3', clicks: 0, date_format: '' },
                                                { label: 'Thứ 4', clicks: 0, date_format: '' },
                                                { label: 'Thứ 5', clicks: 0, date_format: '' },
                                                { label: 'Thứ 6', clicks: 0, date_format: '' },
                                                { label: 'Thứ 7', clicks: 0, date_format: '' },
                                                { label: 'CN', clicks: 0, date_format: '' }
                                            ];

                                        // Tìm số lượt click cao nhất để tính cột cao nhất (mốc 100%)
                                        const maxClicks = Math.max(...chartData.map(item => item.clicks));

                                        // Xác định ngày hôm nay để highlight (Chỉ áp dụng khi đang xem tuần hiện tại offset = 0)
                                        const daysMapping = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                                        const todayLabel = daysMapping[new Date().getDay()];

                                        return chartData.map((item, index) => {
                                            // Tính phần trăm chiều cao cột, tối thiểu 12% để 0 click vẫn hiện vạch chân nền đẹp mắt
                                            const heightPercent = maxClicks > 0 ? Math.max((item.clicks / maxClicks) * 100, 12) : 12;

                                            // Chỉ highlight nếu là ngày hôm nay VÀ đang chọn xem tuần này
                                            const isToday = weekOffset === 0 && item.label === todayLabel;

                                            return (
                                                <div key={index} className="w-full h-full flex flex-col items-center justify-end gap-1.5">
                                                    <div
                                                        className={`w-full rounded-t-lg relative group transition-all duration-300 ${isToday
                                                            ? 'bg-orange-500'
                                                            : 'bg-orange-100 hover:bg-orange-500'
                                                            }`}
                                                        style={{ height: `${heightPercent}%` }}
                                                    >
                                                        {/* Tooltip hiện số lượt click nguyên bản của bạn */}
                                                        <span className={`absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-[9px] px-1 rounded pointer-events-none transition-opacity ${isToday ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                            }`}>
                                                            {item.clicks}
                                                        </span>
                                                    </div>

                                                    {/* Nhãn Thứ và Ngày tháng (Ví dụ: Thứ 2 - 15/06) */}
                                                    <div className="flex flex-col items-center">
                                                        <span className={`text-[9px] font-bold whitespace-nowrap ${isToday ? 'text-slate-700' : 'text-slate-400'}`}>
                                                            {item.label}
                                                        </span>
                                                        {item.date_format && (
                                                            <span className="text-[8px] text-slate-400/80 font-mono scale-90 -mt-0.5">
                                                                {item.date_format}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
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
                                    {(() => {
                                        // Khung mặc định phòng trường hợp API chưa load xong dữ liệu
                                        const chartData = dashboardStats.cvChartData && dashboardStats.cvChartData.length > 0
                                            ? dashboardStats.cvChartData
                                            : [
                                                // Sửa lại 4 dòng này cho chuẩn format mới
                                                { label: 'Tuần 1', cvs: 0, is_current: false, range: '' },
                                                { label: 'Tuần 2', cvs: 0, is_current: false, range: '' },
                                                { label: 'Tuần 3', cvs: 0, is_current: false, range: '' },
                                                { label: 'Tuần 4', cvs: 0, is_current: false, range: '' }
                                            ];

                                        // Tìm số lượng CV lớn nhất để tính tỉ lệ cột cao nhất
                                        const maxCvs = Math.max(...chartData.map(item => item.cvs));

                                        return chartData.map((item, index) => {
                                            // TỈ LỆ CHIỀU CAO: Cột cao nhất sẽ đạt 100%. 
                                            // Nếu không có CV nào (bằng 0), giữ mức 16% để hiển thị được số 0 bọc trong cột màu xanh rất đẹp.
                                            const heightPercent = maxCvs > 0 ? Math.max((item.cvs / maxCvs) * 100, 16) : 16;

                                            return (
                                                <div key={index} className="w-full h-full flex flex-col items-center justify-end gap-1.5 group">
                                                    {/* Thanh cột hiển thị số lượng CV */}
                                                    <div
                                                        className={`w-8 rounded-t text-center text-[10px] font-bold pt-1 transition-all duration-300 relative flex justify-center ${item.is_current
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-blue-100 hover:bg-blue-600 text-slate-700 hover:text-white'
                                                            }`}
                                                        style={{ height: `${heightPercent}%` }}
                                                    >
                                                        {/* Tooltip hiển thị khoảng ngày chi tiết khi hover chuột vào cột */}
                                                        {item.range && (
                                                            <span className="absolute -top-7 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-10 shadow">
                                                                {item.range}
                                                            </span>
                                                        )}

                                                        {/* Hiển thị số lượng CV thực tế */}
                                                        {item.cvs}
                                                    </div>

                                                    {/* Nhãn Tuần ở dưới đáy */}
                                                    <span className={`text-[9px] whitespace-nowrap ${item.is_current ? 'font-bold text-slate-700' : 'font-medium text-slate-400'
                                                        }`}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* QUẢN LÝ TIN TUYỂN DỤNG */}
                {activeTab === "jobs" && (
                    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                        {/* THANH ĐẦU BẢNG: TÌM KIẾM & TỔNG SỐ LƯỢNG TIN */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
                            <div className="relative w-full sm:w-72">
                                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm tin tuyển dụng..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 outline-none focus:border-orange-400 text-slate-700"
                                />
                            </div>
                            <div className="flex gap-2 text-xs text-slate-500 font-medium self-end sm:self-auto">
                                <span>Tổng cộng: <strong className="text-slate-800">{filteredJobs.length}</strong> tin</span>
                            </div>
                        </div>

                        {/* BẢNG DỮ LIỆU CHÍNH XỬ LÝ OVERFLOW */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        <th className="p-4">Tên công việc / Vị trí</th>
                                        <th className="p-4 text-center">Lượt xem</th>
                                        <th className="p-4 text-center">Số lượng CV</th>
                                        <th className="p-4">Hạn nộp hồ sơ</th>
                                        <th className="p-4 text-center">Trạng thái</th>
                                        <th className="p-4 text-right">Thao tác xử lý</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs divide-y divide-slate-100">
                                    {filteredJobs.length > 0 ? (
                                        filteredJobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                                                {/* CỘT 1: TIÊU ĐỀ & PHÒNG THỦ DANH MỤC */}
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900 text-sm">{job.title}</div>
                                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                                        {job.category_name || (job.category && job.category.name) ? (
                                                            <span className="bg-amber-100/70 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                                {job.category_name || job.category.name}
                                                            </span>
                                                        ) : (
                                                            <span className="bg-slate-100 text-slate-400 text-[9px] font-medium px-1.5 py-0.5 rounded">
                                                                Chưa phân loại
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* CỘT 2: LƯỢT XEM */}
                                                <td className="p-4 text-center font-mono font-medium text-slate-600">
                                                    {job.views}
                                                </td>

                                                {/* CỘT 3: SỐ LƯỢNG CV */}
                                                <td className="p-4 text-center">
                                                    <span className="font-mono font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[11px]">
                                                        {job.applicants} CV
                                                    </span>
                                                </td>

                                                {/* CỘT 4: HẠN NỘP HỒ SƠ */}
                                                <td className="p-4 text-slate-500 font-mono">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={12} /> {job.deadline || "Không giới hạn"}
                                                    </div>
                                                </td>

                                                {/* CỘT 5: TRẠNG THÁI VẬN HÀNH */}
                                                <td className="p-4 text-center">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${job.status === "Vận hành" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                                                        }`}>
                                                        {job.status || "Tạm đóng"}
                                                    </span>
                                                </td>

                                                {/* CỘT 6: THAO TÁC NÚT BẤM */}
                                                <td className="p-4 text-right space-x-2 whitespace-nowrap w-[240px]">
                                                    <button
                                                        onClick={() => handleViewDetails(job)}
                                                        className="text-slate-500 hover:text-slate-700 font-bold hover:underline"
                                                    >
                                                        Xem chi tiết
                                                    </button>

                                                    <button
                                                        onClick={() => handleOpenEdit(job)}
                                                        className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                                                        Sửa tin
                                                    </button>

                                                    <button
                                                        onClick={() => handleExtendJob(job)}
                                                        className="text-amber-600 hover:text-amber-700 font-bold hover:underline">
                                                        Gia hạn
                                                    </button>

                                                    <button
                                                        onClick={() => handleToggleJobStatus(job.id, job.status)}
                                                        className={`font-bold hover:underline inline-block w-16 text-right ${job.status === "Vận hành" ? "text-rose-500 hover:text-rose-600" : "text-emerald-600 hover:text-emerald-700"}`}>
                                                        {job.status === "Vận hành" ? "Đóng tin" : "Mở lại"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        /* HIỂN THỊ KHI DANH SÁCH KHÔNG CÓ TIN NÀO (CHỐNG TRỐNG BẢNG) */
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                                                <div className="text-sm">Doanh nghiệp hiện chưa đăng bài tuyển dụng nào.</div>
                                            </td>
                                        </tr>
                                    )}
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
                                    // Lưu ý: Giá trị lưu bây giờ sẽ là ID của kỹ năng (hoặc "Tất cả")
                                    onChange={(e) => setFilterSkill(e.target.value)}
                                    className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 outline-none focus:border-orange-400 cursor-pointer"
                                >
                                    <option value="Tất cả">Tất cả kỹ năng</option>
                                    {/* Duyệt qua mảng skills lấy từ database */}
                                    {skills.map((skill) => (
                                        <option key={skill.id} value={skill.id}>
                                            {skill.name}
                                        </option>
                                    ))}
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
                                            <div className="flex items-center gap-3 py-1.5 w-full sm:w-2/3">
                                                <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">Độ phù hợp:</span>
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden flex items-center">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${candidate.matchScore >= 80 ? 'bg-emerald-500' :
                                                            candidate.matchScore >= 60 ? 'bg-amber-400' :
                                                                'bg-rose-400'
                                                            }`}
                                                        style={{ width: `${candidate.matchScore || 0}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-xs font-black ${candidate.matchScore >= 80 ? 'text-emerald-600' :
                                                    candidate.matchScore >= 60 ? 'text-amber-600' :
                                                        'text-rose-500'
                                                    }`}>
                                                    {candidate.matchScore}%
                                                </span>
                                            </div>
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
                                                    onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                                                    className={`w-full sm:w-36 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer outline-none text-center transition-colors
                                                    ${candidate.status === "pending" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" :
                                                            candidate.status === "interviewing" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
                                                                candidate.status === "accepted" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" :
                                                                    "bg-rose-100 text-rose-800 hover:bg-rose-200"}`}>
                                                    <option value="pending">CHỜ DUYỆT</option>
                                                    <option value="interviewing">PHỎNG VẤN</option>
                                                    <option value="accepted">NHẬN VIỆC</option>
                                                    <option value="rejected">TỪ CHỐI</option>
                                                </select>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    if (candidate.file_path) {
                                                        // 1. Lấy đường dẫn gốc từ Database
                                                        let cleanPath = candidate.file_path;

                                                        // 2. Tự động cắt bỏ cái đuôi ổ cứng "F:/.../public/" đi
                                                        // Nó sẽ biến "F:/DATN/.../public/cv_files/abc.pdf" thành "cv_files/abc.pdf"
                                                        if (cleanPath.includes('public/')) {
                                                            cleanPath = cleanPath.split('public/')[1];
                                                        } else if (cleanPath.includes('public\\')) { // Đề phòng dấu gạch chéo ngược của Windows
                                                            cleanPath = cleanPath.split('public\\')[1];
                                                        }

                                                        // 3. Ghép vào domain của web (Bắt buộc phải có 127.0.0.1:8000 thì Laravel mới nhả file ra)
                                                        const fileUrl = `http://127.0.0.1:8000/${cleanPath}`;

                                                        // Mở file
                                                        window.open(fileUrl, '_blank');
                                                    } else {
                                                        alert("Ứng viên này chưa cập nhật file CV!");
                                                    }
                                                }}
                                                className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg w-full sm:w-36 text-center transition-colors"
                                            >
                                                Xem trực tiếp CV
                                            </button>
                                        </div>

                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                )}

            </main>

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
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-lg">
                                    Đóng lại
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmStatusAndSendEmail}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1">
                                    <Send size={12} /> Phê duyệt & Gửi Email ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ========================================== */}
            {/* KHU VỰC MODAL HIỂN THỊ CHI TIẾT CÔNG VIỆC  */}
            {/* ========================================== */}
            {selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* Header của Modal */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{selectedJob.title}</h3>
                                <div className="text-sm font-medium text-amber-600 mt-1">
                                    {selectedJob.category_name || "Chưa phân loại danh mục"}
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Nội dung chi tiết (Có thanh cuộn) */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">

                            {/* Dàn hàng thông tin tổng quan */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Cấp bậc</div>
                                    <div className="text-sm font-semibold text-slate-700">{selectedJob.level}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Mức lương</div>
                                    <div className="text-sm font-semibold text-emerald-600">
                                        {selectedJob.is_negotiable === 1
                                            ? "Thỏa thuận"
                                            : `${Number(selectedJob.salary_min).toLocaleString()} - ${Number(selectedJob.salary_max).toLocaleString()} VNĐ`}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Địa điểm</div>
                                    <div className="text-sm font-semibold text-slate-700">{selectedJob.location}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Hạn nộp hồ sơ</div>
                                    <div className="text-sm font-semibold text-rose-600">{selectedJob.deadline || selectedJob.expired_at}</div>
                                </div>
                            </div>

                            {/* ==================== KHU VỰC HIỂN THỊ KỸ NĂNG (ĐÃ THÊM MỚI) ==================== */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-2 border-l-4 border-emerald-500 pl-2">Kỹ năng chuyên môn yêu cầu</h4>
                                <div className="flex flex-wrap gap-2 bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                                    {selectedJob.skills && selectedJob.skills.length > 0 ? (
                                        selectedJob.skills.map((skill, index) => (
                                            <span
                                                key={skill.id || index}
                                                className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 shadow-sm"
                                            >
                                                {skill.name || skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">Không có yêu cầu kỹ năng đặc biệt</span>
                                    )}
                                </div>
                            </div>
                            {/* ============================================================================== */}

                            {/* Mô tả công việc */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-2 border-l-4 border-blue-500 pl-2">Mô tả công việc</h4>
                                <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                                    {selectedJob.description}
                                </div>
                            </div>

                            {/* Yêu cầu công việc */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-2 border-l-4 border-amber-500 pl-2">Yêu cầu ứng viên</h4>
                                <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                                    {selectedJob.requirements}
                                </div>
                            </div>

                            {/* Quyền lợi */}
                            {selectedJob.benefits && (
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-2 border-l-4 border-emerald-500 pl-2">Quyền lợi được hưởng</h4>
                                    <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                                        {selectedJob.benefits}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer của Modal */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="px-5 py-2 bg-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-300 transition-colors">
                                Đóng lại
                            </button>
                        </div>

                    </div>
                </div>
            )}
            {/* ========================================== */}
            {/* KHU VỰC MODAL GIA HẠN TIN TUYỂN DỤNG       */}
            {/* ========================================== */}
            {extendingJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        <div className="p-5 border-b border-slate-100 bg-amber-50/50">
                            <h3 className="text-lg font-bold text-amber-800">Gia hạn tin tuyển dụng</h3>
                            <p className="text-sm font-medium text-slate-600 mt-1">{extendingJob.title}</p>
                        </div>

                        <div className="p-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Chọn hạn nộp hồ sơ mới <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={newDeadline}
                                onChange={(e) => setNewDeadline(e.target.value)}
                                min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]} // Chỉ cho phép chọn từ ngày mai
                                className="w-full border border-slate-200 text-slate-700 rounded-xl px-4 py-2 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all" />
                            <div className="text-[11px] text-slate-500 mt-2 italic">
                                * Lưu ý: Nếu tin đang Tạm đóng, sau khi gia hạn hệ thống sẽ tự động chuyển trạng thái sang Vận hành.
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={() => setExtendingJob(null)}
                                className="px-5 py-2 bg-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-300 transition-colors">
                                Hủy bỏ
                            </button>
                            <button
                                onClick={submitExtendJob}
                                className="px-5 py-2 bg-amber-500 text-white text-sm font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-sm shadow-amber-200" >
                                Xác nhận gia hạn
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ========================================== */}
            {/* KHU VỰC MODAL ĐĂNG TIN MỚI                 */}
            {/* ========================================== */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* Tiêu đề Modal */}
                        <div className="p-5 border-b border-slate-100 bg-emerald-50/50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-emerald-800">Đăng tin tuyển dụng mới</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-rose-500 font-bold text-xl">✕</button>
                        </div>

                        {/* Nội dung cuộn Form */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form id="addJobForm" onSubmit={handleCreateJob} className="space-y-5">

                                {/* Lưới chia 2 cột */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề công việc <span className="text-rose-500">*</span></label>
                                        <input required type="text" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" placeholder="VD: Tuyển dụng Lập trình viên ReactJS..." />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Danh mục ngành nghề <span className="text-rose-500">*</span>
                                        </label>

                                        <select
                                            required
                                            value={newJob.category_id || ""}
                                            onChange={e => setNewJob({ ...newJob, category_id: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400"
                                        >
                                            {/* LƯU Ý: Chỉ có thẻ <option> ở trong này, tuyệt đối không có <div> */}
                                            <option value="" disabled>-- Chọn danh mục --</option>

                                            {categoriesList && categoriesList.length > 0 ? (
                                                categoriesList.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>Không có dữ liệu hoặc đang tải...</option>
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Cấp bậc <span className="text-rose-500">*</span></label>
                                        <select required value={newJob.level} onChange={e => setNewJob({ ...newJob, level: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400">
                                            <option value="Thực tập sinh">Thực tập sinh</option>
                                            <option value="Mới tốt nghiệp">Mới tốt nghiệp</option>
                                            <option value="Nhân viên">Nhân viên</option>
                                            <option value="Trưởng nhóm">Trưởng nhóm</option>
                                            <option value="Quản lý">Quản lý</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Địa điểm làm việc <span className="text-rose-500">*</span></label>
                                        <input required type="text" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" placeholder="VD: Hà Nội, TP.HCM, hoặc địa chỉ cụ thể..." />
                                    </div>

                                    {/* Khu vực Mức lương */}
                                    <div className="relative">
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Mức lương tối thiểu (VNĐ)</label>
                                        <input type="number" disabled={newJob.is_negotiable} value={newJob.salary_min} onChange={e => setNewJob({ ...newJob, salary_min: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" placeholder="VD: 10000000" />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Mức lương tối đa (VNĐ)</label>
                                        <input type="number" disabled={newJob.is_negotiable} value={newJob.salary_max} onChange={e => setNewJob({ ...newJob, salary_max: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" placeholder="VD: 25000000" />
                                    </div>

                                    {/* Hàng chứa Checkbox và Ngày hết hạn */}
                                    <div className="flex items-center">
                                        <label className="flex items-center cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={newJob.is_negotiable}
                                                onChange={e => setNewJob({ ...newJob, is_negotiable: e.target.checked, salary_min: "", salary_max: "" })}
                                                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                                            />
                                            <span className="ml-2 text-sm font-bold text-amber-600 group-hover:text-amber-700 transition-colors">Thỏa thuận lương (Không bắt buộc nhập số)</span>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Hạn nộp hồ sơ <span className="text-rose-500">*</span></label>
                                        <input required type="date" min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]} value={newJob.expired_at} onChange={e => setNewJob({ ...newJob, expired_at: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400" />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Kỹ năng chuyên môn yêu cầu <span className="text-rose-500">*</span>
                                        <span className="text-slate-400 font-normal ml-1">(Bấm để chọn hoặc bỏ chọn nhiều kỹ năng)</span>
                                    </label>

                                    {/* Khung bo góc chứa các nút kỹ năng, tự động sinh thanh cuộn nếu quá dài */}
                                    <div className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50/50 max-h-40 overflow-y-auto custom-scrollbar flex flex-wrap gap-2">
                                        {skills && skills.length > 0 ? (
                                            skills.map((skill) => {
                                                // Kiểm tra kỹ năng hiện tại đã được bấm chọn hay chưa
                                                const isSelected = newJob.skills && newJob.skills.includes(skill.id);

                                                return (
                                                    <button
                                                        key={skill.id}
                                                        type="button" // QUAN TRỌNG: Ngăn chặn hành vi tự động submit form của trình duyệt
                                                        onClick={() => {
                                                            const currentSkills = newJob.skills || [];
                                                            if (currentSkills.includes(skill.id)) {
                                                                // Nếu tồn tại rồi -> Xóa ID khỏi mảng (Bỏ chọn)
                                                                setNewJob({
                                                                    ...newJob,
                                                                    skills: currentSkills.filter(id => id !== skill.id)
                                                                });
                                                            } else {
                                                                // Nếu chưa tồn tại -> Thêm ID vào mảng (Chọn)
                                                                setNewJob({
                                                                    ...newJob,
                                                                    skills: [...currentSkills, skill.id]
                                                                });
                                                            }
                                                        }}
                                                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-150 ${isSelected
                                                            ? "bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-100" // Màu khi được chọn
                                                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100" // Màu mặc định
                                                            }`}
                                                    >
                                                        {skill.name}
                                                        {isSelected && <span className="ml-1.5 text-[10px]">✓</span>}
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            <p className="text-xs text-slate-400 italic py-1">Đang kết nối hệ thống tải danh sách kỹ năng...</p>
                                        )}
                                    </div>

                                    {/* Hiển thị số lượng kỹ năng đã chọn dưới chân khung */}
                                    {newJob.skills && newJob.skills.length > 0 && (
                                        <p className="text-[11px] text-emerald-600 font-medium mt-1">
                                            Đã chọn {newJob.skills.length} kỹ năng yêu cầu.
                                        </p>
                                    )}
                                </div>
                                {/* Các ô mô tả Textarea rộng */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết công việc <span className="text-rose-500">*</span></label>
                                    <textarea required rows="4" value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 custom-scrollbar" placeholder="- Thực hiện các công việc ABC...&#10;- Báo cáo tiến độ cho XYZ..."></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Yêu cầu ứng viên <span className="text-rose-500">*</span></label>
                                    <textarea required rows="3" value={newJob.requirements} onChange={e => setNewJob({ ...newJob, requirements: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 custom-scrollbar" placeholder="- Có từ 1 năm kinh nghiệm...&#10;- Thành thạo công cụ..."></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Quyền lợi được hưởng (Tùy chọn)</label>
                                    <textarea rows="3" value={newJob.benefits} onChange={e => setNewJob({ ...newJob, benefits: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 custom-scrollbar" placeholder="- Lương tháng 13, BHXH đầy đủ...&#10;- Du lịch công ty hàng năm..."></textarea>
                                </div>
                            </form>
                        </div>

                        {/* Nút submit dưới chân */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 bg-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-300 transition-colors">
                                Hủy bỏ
                            </button>
                            <button type="submit" form="addJobForm" className="px-5 py-2 bg-emerald-500 text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200">
                                Hoàn tất đăng tin
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ========================================== */}
            {/* KHU VỰC MODAL SỬA TIN TUYỂN DỤNG */}
            {/* ========================================== */}
            {isEditModalOpen && editingJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        <div className="p-5 border-b border-slate-100 bg-blue-50/50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-blue-800">Chỉnh sửa tin tuyển dụng</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-rose-500 font-bold text-xl">✕</button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form id="editJobForm" onSubmit={handleUpdateJob} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề công việc <span className="text-rose-500">*</span></label>
                                        <input required type="text" value={editingJob.title} onChange={e => setEditingJob({ ...editingJob, title: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Danh mục ngành nghề <span className="text-rose-500">*</span></label>
                                        <select required value={editingJob.category_id || ""} onChange={e => setEditingJob({ ...editingJob, category_id: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                                            <option value="" disabled>-- Chọn danh mục --</option>
                                            {categoriesList && categoriesList.length > 0 && categoriesList.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Cấp bậc <span className="text-rose-500">*</span></label>
                                        <select required value={editingJob.level} onChange={e => setEditingJob({ ...editingJob, level: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                                            <option value="Thực tập sinh">Thực tập sinh</option>
                                            <option value="Mới tốt nghiệp">Mới tốt nghiệp</option>
                                            <option value="Nhân viên">Nhân viên</option>
                                            <option value="Trưởng nhóm">Trưởng nhóm</option>
                                            <option value="Quản lý">Quản lý</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Địa điểm làm việc <span className="text-rose-500">*</span></label>
                                        <input required type="text" value={editingJob.location} onChange={e => setEditingJob({ ...editingJob, location: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Mức lương tối thiểu (VNĐ)</label>
                                        <input type="number" disabled={editingJob.is_negotiable} value={editingJob.salary_min || ""} onChange={e => setEditingJob({ ...editingJob, salary_min: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Mức lương tối đa (VNĐ)</label>
                                        <input type="number" disabled={editingJob.is_negotiable} value={editingJob.salary_max || ""} onChange={e => setEditingJob({ ...editingJob, salary_max: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" />
                                    </div>

                                    <div className="flex items-center md:col-span-2">
                                        <label className="flex items-center cursor-pointer group">
                                            <input type="checkbox" checked={editingJob.is_negotiable} onChange={e => setEditingJob({ ...editingJob, is_negotiable: e.target.checked, salary_min: "", salary_max: "" })} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer" />
                                            <span className="ml-2 text-sm font-bold text-blue-600 group-hover:text-blue-700 transition-colors">Thỏa thuận lương (Không bắt buộc nhập số)</span>
                                        </label>
                                    </div>
                                </div>

                                {/* ======================================================== */}
                                {/* KHU VỰC THÊM MỚI: CHỌN VÀ CHỈNH SỬA KỸ NĂNG (SKILLS) */}
                                <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-2">
                                        Kỹ năng chuyên môn yêu cầu <span className="text-rose-500">*</span>
                                    </label>

                                    <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-2 border border-slate-200 rounded-lg bg-white custom-scrollbar">
                                        {skillsList.length > 0 ? (
                                            skillsList.map((skill) => {
                                                const skillId = Number(skill.id);
                                                // Kiểm tra xem ID kỹ năng này có nằm trong mảng editingJob.skills không
                                                const isSelected = (editingJob.skills || []).includes(skillId);

                                                return (
                                                    <button
                                                        type="button"
                                                        key={skillId}
                                                        onClick={() => {
                                                            // LOGIC CHỌN / BỎ CHỌN
                                                            const currentSkills = editingJob.skills || [];
                                                            let newSkills;

                                                            if (isSelected) {
                                                                // Nếu đang xanh -> Bấm vào là XÓA
                                                                newSkills = currentSkills.filter(id => id !== skillId);
                                                            } else {
                                                                // Nếu chưa xanh -> Bấm vào là THÊM
                                                                newSkills = [...currentSkills, skillId];
                                                            }

                                                            // Cập nhật lại state form
                                                            setEditingJob({ ...editingJob, skills: newSkills });
                                                        }}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${isSelected
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm' // Màu khi được chọn
                                                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200' // Màu khi chưa chọn
                                                            }`}
                                                    >
                                                        {skill.name} {isSelected && '✓'}
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            <p className="text-xs text-slate-400 italic p-1">Đang tải danh sách kỹ năng...</p>
                                        )}
                                    </div>
                                </div>
                                {/* ======================================================== */}

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết công việc <span className="text-rose-500">*</span></label>
                                    <textarea required rows="4" value={editingJob.description} onChange={e => setEditingJob({ ...editingJob, description: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 custom-scrollbar"></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Yêu cầu ứng viên <span className="text-rose-500">*</span></label>
                                    <textarea required rows="3" value={editingJob.requirements} onChange={e => setEditingJob({ ...editingJob, requirements: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 custom-scrollbar"></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Quyền lợi được hưởng (Tùy chọn)</label>
                                    <textarea rows="3" value={editingJob.benefits || ""} onChange={e => setEditingJob({ ...editingJob, benefits: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 custom-scrollbar"></textarea>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 bg-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-300 transition-colors">
                                Hủy bỏ
                            </button>
                            <button type="submit" form="editJobForm" className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}