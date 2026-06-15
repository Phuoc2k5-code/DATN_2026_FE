import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  Filter,
  User,
  Briefcase,
  Loader2 // Thêm icon loading cho chuyên nghiệp
} from 'lucide-react';

export default function UserManagement() {
  // Thay dữ liệu cứng bằng state rỗng để đợi API đổ vào
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Khai báo cấu hình API (Thay đổi URL cho đúng với dự án của bạn)
  const API_BASE_URL = 'http://127.0.0.1:8000/api/admin';
  const token = localStorage.getItem('token');

  // ================= 1. HÀM GỌI API LẤY DANH SÁCH USER =================
  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/users-except-admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Gửi token lên để Laravel xác thực Admin
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Không thể lấy dữ liệu từ hệ thống.');
      return response.json();
    })
    .then(res => {
      if (res.success) {
        // Map lại trường dữ liệu từ DB (Laravel dùng deleted_at để nhận biết trạng thái khóa)
        const formatUsers = res.data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role, // Lúc này role từ API đổ về (Candidate/Employer/...)
          status: u.deleted_at ? 'banned' : 'active', // Nếu deleted_at có giá trị nghĩa là đang bị khóa
          createdAt: new Date(u.created_at).toLocaleDateString('vi-VN') // Format ngày cho đẹp
        }));
        setUsers(formatUsers);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError('Có lỗi xảy ra khi tải danh sách người dùng.');
      setLoading(false);
    });
  };

  // Chạy hàm fetch dữ liệu ngay khi component được render lần đầu
  useEffect(() => {
    fetchUsers();
  }, []);


  // ================= 2. HÀM THAY ĐỔI TRẠNG THÁI (KHÓA / MỞ KHÓA) QUA API =================
  const handleToggleStatus = (id, currentStatus) => {
    const isLockAction = currentStatus === 'active';
    const actionText = isLockAction ? 'KHÓA' : 'MỞ KHÓA';
    
    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản này không?`)) {
      
      // Xác định đúng URL và Phương thức theo API Laravel đã thiết kế
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
          // Cập nhật lại state trực tiếp trên giao diện để tránh phải tải lại toàn bộ trang
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

  // Xử lý tìm kiếm và bộ lọc dữ liệu (Giữ nguyên logic của bạn)
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' ? true : user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý người dùng</h1>
          <p className="text-sm text-slate-500 mt-1">Giám sát, phân quyền và xử lý trạng thái tài khoản trên hệ thống.</p>
        </div>
      </div>

      {/* Thanh công cụ: Tìm kiếm & Bộ lọc */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Ô Tìm kiếm */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Bộ lọc vai trò (Role) */}
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

      {/* Thông báo nếu lỗi hệ thống */}
      {error && <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">{error}</div>}

      {/* Danh sách người dùng (Data Table) */}
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
              
              {/* Trạng thái đang tải dữ liệu (Loading) */}
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500 mb-2" />
                    Đang tải danh sách thành viên...
                  </td>
                </tr>
              ) : (
                // Render danh sách user sau khi load xong
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Tên & Email */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{user.email}</div>
                    </td>

                    {/* Vai trò */}
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

                    {/* Ngày tạo */}
                    <td className="px-6 py-4 text-slate-500">
                      {user.createdAt}
                    </td>

                    {/* Trạng thái hoạt động */}
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

                    {/* Thao tác Khóa / Mở tài khoản nhanh */}
                    <td className="px-6 py-4 text-right">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors shadow-sm"
                          title="Khóa tài khoản"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Khóa</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors shadow-sm"
                          title="Mở khóa tài khoản"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Mở khóa</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
              
              {/* Trường hợp bộ lọc/tìm kiếm không có kết quả */}
              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <ShieldAlert className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                    Không tìm thấy thành viên nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}