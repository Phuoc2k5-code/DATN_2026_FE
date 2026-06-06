import React, { useState } from 'react';
import { 
  Search, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  Filter,
  User,
  Briefcase
} from 'lucide-react';

export default function UserManagement() {
  // Dữ liệu mẫu người dùng (Giả lập kết nối từ database)
  const initialUsers = [
    {
      id: 'USR001',
      name: 'Nguyen Van A',
      email: 'nguyenvana@gmail.com',
      role: 'Candidate', // Candidate hoặc Employer
      status: 'active',  // active hoặc banned
      createdAt: '01/06/2026',
    },
    {
      id: 'USR002',
      name: 'Công ty Công nghệ TechVibe',
      email: 'hr@techvibe.vn',
      role: 'Employer',
      status: 'active',
      createdAt: '28/05/2026',
    },
    {
      id: 'USR003',
      name: 'Tran Thi B',
      email: 'tranthib@gmail.com',
      role: 'Candidate',
      status: 'banned',
      createdAt: '15/05/2026',
    },
    {
      id: 'USR004',
      name: 'Tập đoàn Bán lẻ VinMart',
      email: 'recruitment@vinmart.com',
      role: 'Employer',
      status: 'active',
      createdAt: '10/05/2026',
    }
  ];

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Hàm Toggle Khóa / Mở khóa tài khoản
  const handleToggleStatus = (id, currentStatus) => {
    const actionText = currentStatus === 'active' ? 'KHÓA' : 'MỞ KHÓA';
    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản này không?`)) {
      setUsers(users.map(user => 
        user.id === id ? { ...user, status: currentStatus === 'active' ? 'banned' : 'active' } : user
      ));
    }
  };

  // Xử lý tìm kiếm và bộ lọc dữ liệu
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' ? true : user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý người dùng</h1>
          <p className="text-sm text-slate-500 mt-1">Giám sát, phân quyền và xử lý trạng thái tài khoản trên hệ thống.</p>
        </div>
      </div>

      {/* Thanh công cụ: Tìm kiếm & Bộ lọc (Thanh thoát, hiện đại) */}
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  
                  {/* Tên & Email */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{user.email}</div>
                  </td>

                  {/* Vai trò (Kèm Icon trực quan) */}
                  <td className="px-6 py-4">
                    {user.role === 'Candidate' ? (
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
              ))}
              
              {/* Trường hợp bộ lọc/tìm kiếm không có kết quả */}
              {filteredUsers.length === 0 && (
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
};