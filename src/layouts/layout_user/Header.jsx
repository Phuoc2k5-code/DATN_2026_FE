import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut, User, History } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  // 1. GỌI API LẤY THÔNG TIN PROFILE MỚI NHẤT KHI HEADER ĐƯỢC MOUNT
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Nếu không có token, hiểu là chưa đăng nhập -> không cần gọi API
    if (!token) {
      setCurrentUser(null);
      return;
    }

    const fetchHeaderProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.data.success) {
          const uData = response.data.data;
          
          // Đồng bộ và gán gọn lại các trường cần thiết để hiển thị trên Header
          setCurrentUser({
            name: uData.candidate?.full_name || "Thành viên",
            email: uData.email,
            // Xử lý link ảnh từ DB, bọc lót nếu rỗng
            avatar: uData.candidate?.avatar_url
              ? `http://127.0.0.1:8000/${uData.candidate.avatar_url}`
              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
          });
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin profile tại Header:", error);
        // Nếu token hết hạn hoặc lỗi 401, xóa token cũ và đưa về trạng thái chưa đăng nhập
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setCurrentUser(null);
        }
      }
    };

    fetchHeaderProfile();
  }, [navigate]);

  // 2. HÀM XỬ LÝ ĐĂNG XUẤT
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCurrentUser(null);
      setIsOpenDropdown(false);
      navigate("/login"); // Đá user về trang login
    }
  };

  return (
    <header className="sticky top-0 z-[1000] border-b border-orange-100 bg-white/95 backdrop-blur-md px-6 py-3.5 w-full">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-black text-white text-lg">V</div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            VIECLAM<span className="text-blue-600 font-extrabold">PRO</span>
          </span>
        </Link>

        {/* NAVIGATION MENUS */}
        <nav className="hidden items-center gap-6 md:flex text-sm font-medium text-slate-600">
          <Link to="/" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Tìm việc</Link>
          <Link to="/cv-management/create-cv" className="hover:text-blue-600 transition-colors">Tạo CV</Link>
          <Link to="/application-history" className="hover:text-blue-600 transition-colors">Lịch sử ứng tuyển</Link>
          <Link to="/ai-suggestions" className="hover:text-blue-600 transition-colors text-indigo-600 font-semibold">AI gợi ý</Link>
        </nav>

        {/* KHỐI XỬ LÝ ĐĂNG NHẬP / AVATAR */}
        <div className="flex items-center gap-2.5 relative">
          {currentUser ? (
            /* TRẠNG THÁI 1: ĐÃ ĐĂNG NHẬP -> HIỂN THỊ AVATAR VÀ TÊN LẤY TỪ API */
            <div className="relative">
              <button 
                onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-100 transition cursor-pointer outline-none select-none border border-slate-100"
              >
                {/* Ảnh đại diện an toàn */}
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover bg-blue-50 border border-blue-200"
                  // 💡 BẢO VỆ: Nếu ảnh từ server bị lỗi đường dẫn vật lý, tự thay bằng ảnh dự phòng online ngay
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
                  }}
                />
                <span className="text-xs font-bold text-slate-700 hidden sm:inline-block max-w-[120px] truncate">
                  {currentUser.name}
                </span>
              </button>

              {/* DROPDOWN MENU KHI BẤM VÀO AVATAR */}
              {isOpenDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsOpenDropdown(false)}></div>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Tài khoản</p>
                      <p className="text-xs font-bold text-slate-600 truncate">{currentUser.email}</p>
                    </div>

                    <Link 
                      to="/profile" 
                      onClick={() => setIsOpenDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 transition font-medium"
                    >
                      <User size={14} className="text-slate-400" />
                      Hồ sơ của tôi
                    </Link>

                    <Link 
                      to="/application-history" 
                      onClick={() => setIsOpenDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 transition font-medium"
                    >
                      <History size={14} className="text-slate-400" />
                      Lịch sử ứng tuyển
                    </Link>

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition font-semibold border-t border-slate-50 text-left cursor-pointer"
                    >
                      <LogOut size={14} className="text-rose-500" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* TRẠNG THÁI 2: CHƯA ĐĂNG NHẬP */
            <>
              <Link to="/register" className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition">
                Đăng ký
              </Link>
              <Link to="/login" className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition">
                Đăng nhập
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}