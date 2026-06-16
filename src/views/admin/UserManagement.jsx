import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  Filter,
  User,
  Briefcase,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Các state lưu giá trị input trên giao diện
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // State quản lý Phân trang từ API
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const API_BASE_URL = 'http://127.0.0.1:8000/api/admin';
  const token = localStorage.getItem('token');

  // ================= 1. HÀM GỌI API TÌM KIẾM & PHÂN TRANG TOÀN HỆ THỐNG =================
  const fetchUsers = (pageNumber = 1, search = '', role = 'all') => {
    setLoading(true);
    
    // Tạo Query Parameters truyền lên URL
    const queryParams = new URLSearchParams({
      page: pageNumber,
      search: search,
      role: role
    }).toString();

    fetch(`${API_BASE_URL}/users-except-admin?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Không thể lấy dữ liệu từ hệ thống.');
      return response.json();
    })
    .then(res => {
      if (res.success) {
        const formatUsers = res.data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.deleted_at ? 'banned' : 'active',
          createdAt: new Date(u.created_at).toLocaleDateString('vi-VN')
        }));
        
        setUsers(formatUsers);
        
        if (res.pagination) {
          setCurrentPage(res.pagination.current_page);
          setLastPage(res.pagination.last_page);
        }
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError('Có lỗi xảy ra khi tải danh sách người dùng.');
      setLoading(false);
    });
  };

  // ================= TỰ ĐỘNG GỌI API KHI THAY ĐỔI BỘ LỌC HOẶC TÌM KIẾM (DEBOUNCE) =================
  useEffect(() => {
    // Nếu người dùng đổi Role bộ lọc thì reset về trang 1 luôn
    setCurrentPage(1);
    
    // Cơ chế Debounce: Chờ người dùng dừng gõ 500ms rồi mới gửi API lên Server tìm toàn bộ
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1, searchTerm, roleFilter); 
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, roleFilter]); // Lắng nghe sự thay đổi của ô Tìm kiếm và ô Chọn vai trò

  // Lắng nghe riêng sự thay đổi của chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
      fetchUsers(newPage, searchTerm, roleFilter); // Gọi trang tiếp theo với từ khóa hiện tại
    }
  };


  // ================= 2. HÀM THAY ĐỔI TRẠNG THÁI (KHÓA / MỞ KHÓA) =================
  const handleToggleStatus = (id, currentStatus) => {
    const isLockAction = currentStatus === 'active';
    const actionText = isLockAction ? 'KHÓA' : 'MỞ KHÓA';
    
    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản này không?`)) {
      const url = isLockAction ? `${API_BASE_URL}/users/${id}/lock` : `${API_BASE_URL}/users/${id}/unlock`;
      const method = isLockAction ? 'DELETE' : 'PATCH';

      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          alert(res.message);
          setUsers(users.map(user => 
            user.id === id ? { ...user, status: isLockAction ? 'banned' : 'active' } : user
          ));
        } else {
          alert(res.message || 'Thao tác thất bại.');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Lỗi kết nối mạng, vui lòng thử lại.');
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 p-6">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý người dùng</h1>
          <p className="text-sm text-slate-500 mt-1">Giám sát, phân quyền và xử lý trạng thái tài khoản trên hệ thống.</p>
        </div>
      </div>

      {/* Thanh công cụ: Tìm kiếm & Bộ lọc (Đã đổi sang Server-side) */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Ô Tìm kiếm toàn bộ hệ thống */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email trên toàn hệ thống..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Bộ lọc vai trò */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-600 font-medium"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Candidate">Ứng viên (Candidate)</option>
            <option value="Employer">Nhà tuyển dụng (Employer)</option>
          </select>
        </div>
      </div>

      {/* Thông báo lỗi */}
      {error && <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">{error}</div>}

      {/* Danh sách người dùng */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Người dùng</th>
                <th className="px-6 py-4 font-semibold">Vai trò</th>
                <th className="px-6 py-4 font-semibold">Ngày tham gia</th>
                <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500 mb-2" />
                    Đang tìm kiếm dữ liệu...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role.toLowerCase() === 'candidate' ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          <User className="w-3.5 h-3.5" />
                          <span>Ứng viên</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>Nhà tuyển dụng</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.createdAt}</td>
                    <td className="px-6 py-4 text-center">
                      {user.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          Đang khóa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Khóa</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Mở khóa</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}

              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <ShieldAlert className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                    Không tìm thấy thành viên nào phù hợp trên hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Thanh điều hướng phân trang */}
        {!loading && lastPage > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Trang <span className="font-semibold text-slate-700">{currentPage}</span> trên tổng số <span className="font-semibold text-slate-700">{lastPage}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="inline-flex items-center p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang sau"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}