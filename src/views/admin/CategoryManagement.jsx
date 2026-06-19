import React, { useState, useEffect } from 'react';
import { Search, Plus, Tag, Code, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/admin';

export default function CategoryManagement() {
  const [activeTab, setActiveTab] = useState('categories'); 
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State quản lý phân trang nhận từ Backend
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15
  });

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
  };

  // --- HÀM GỌI API LẤY DANH SÁCH (Hỗ trợ truyền thêm số trang) ---
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'categories' ? '/categories' : '/skills';
      // Gửi kèm tham số ?page lên Laravel để lấy đúng phân trang
      const response = await axios.get(`${API_BASE_URL}${endpoint}?page=${page}`, getAuthConfig());
      
      if (response.data.success) {
        // Map thêm trạng thái active mặc định nếu DB chưa có trường status
        const formattedData = response.data.data.map(item => ({
          ...item,
          status: item.status || 'active'
        }));

        if (activeTab === 'categories') {
          setCategories(formattedData);
        } else {
          setSkills(formattedData);
        }

        // Lưu thông tin phân trang vào State
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu từ API:', error);
      alert(error.response?.data?.message || 'Không thể kết nối đến máy chủ Backend!');
    } finally {
      setLoading(false);
    }
  };

  // Reset về trang 1 và gọi lại API khi đổi Tab điều hướng
  useEffect(() => {
    fetchData(1);
  }, [activeTab]);

  // Hàm xử lý khi bấm nút chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchData(newPage);
    }
  };

  // --- HÀM GỌI API THÊM MỚI ---
  const handleCreate = async () => {
    const typeLabel = activeTab === 'categories' ? 'ngành nghề' : 'kỹ năng';
    const name = prompt(`Nhập tên ${typeLabel} mới:`);
    
    if (name === null) return;
    if (!name.trim()) {
      alert('Tên không được bỏ trống!');
      return;
    }

    try {
      const endpoint = activeTab === 'categories' ? '/categories' : '/skills';
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, { name: name.trim() }, getAuthConfig());

      if (response.data.success) {
        alert(response.data.message);
        fetchData(pagination.current_page); // Tải lại trang hiện tại
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi hệ thống khi thêm bản ghi!');
    }
  };

  // --- HÀM GỌI API CẬP NHẬT TÊN ---
  const handleEdit = async (id, currentName) => {
    const typeLabel = activeTab === 'categories' ? 'ngành nghề' : 'kỹ năng';
    const newName = prompt(`Chỉnh sửa tên ${typeLabel}:`, currentName);

    if (newName === null) return;
    if (!newName.trim()) {
      alert('Tên không được bỏ trống!');
      return;
    }

    try {
      const endpoint = activeTab === 'categories' ? `/categories/${id}` : `/skills/${id}`;
      const response = await axios.put(`${API_BASE_URL}${endpoint}`, { name: newName.trim() }, getAuthConfig());

      if (response.data.success) {
        alert(response.data.message);
        fetchData(pagination.current_page);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Cập nhật thất bại, vui lòng kiểm tra lại!');
    }
  };
  
  // --- HÀM GỌI API XÓA MỀM ---
  const handleDelete = async (id, name) => {
    const typeLabel = activeTab === 'categories' ? 'danh mục ngành nghề' : 'kỹ năng';
    if (!window.confirm(`Xóa ${typeLabel} "${name}" có thể ảnh hưởng đến các dữ liệu liên quan. Bạn có chắc chắn?`)) {
      return;
    }

    try {
      const endpoint = activeTab === 'categories' ? `/categories/${id}` : `/skills/${id}`;
      const response = await axios.delete(`${API_BASE_URL}${endpoint}`, getAuthConfig());

      if (response.data.success) {
        alert(response.data.message);
        // Nếu trang hiện tại chỉ còn 1 phần tử mà bị xóa, tự động lùi về trang trước
        const currentDataLength = activeTab === 'categories' ? categories.length : skills.length;
        const pageToFetch = currentDataLength === 1 && pagination.current_page > 1 
          ? pagination.current_page - 1 
          : pagination.current_page;
        fetchData(pageToFetch);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Không thể xóa bản ghi do có ràng buộc dữ liệu!');
    }
  };

  const currentData = activeTab === 'categories' ? categories : skills;
  const filteredData = currentData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* TIÊU ĐỀ TRANG */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cấu hình Hệ thống</h1>
          <p className="text-sm text-slate-500 mt-1">Phân loại danh mục ngành nghề chính và các bộ kỹ năng yêu cầu.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm {activeTab === 'categories' ? 'ngành nghề' : 'kỹ năng'} mới</span>
        </button>
      </div>

      {/* THANH ĐIỀU HƯỚNG TABS */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-xl shadow-sm gap-2 mb-6">
        <button
          onClick={() => { setActiveTab('categories'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'categories' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Tag className="w-4 h-4" />
          Quản lý Ngành nghề ({activeTab === 'categories' ? pagination.total : categories.length})
        </button>
        <button
          onClick={() => { setActiveTab('skills'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'skills' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Code className="w-4 h-4" />
          Quản lý Kỹ năng ({activeTab === 'skills' ? pagination.total : skills.length})
        </button>
      </div>

      {/* THANH TÌM KIẾM */}
      <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'categories' ? "Tìm kiếm trong trang này..." : "Tìm kiếm trong trang này..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* BẢNG DỮ LIỆU CHUNG */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">
                  {activeTab === 'categories' ? 'Tên ngành nghề' : 'Tên kỹ năng'}
                </th>
                <th className="px-6 py-4 font-semibold text-center">Số lượng bài đăng</th>
                <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-500 font-medium">
                    Đang đồng bộ dữ liệu từ hệ thống Backend...
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${activeTab === 'categories' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                          {activeTab === 'categories' ? <Tag className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">/{item.slug}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* ĐÃ SỬA: Đọc chính xác trường jobs_count trả từ với withCount() của Laravel */}
                    <td className="px-6 py-4 text-center font-medium text-slate-700">
                      {(item.jobs_count || 0).toLocaleString()} bài đăng
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Đang hiển thị</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">Đang ẩn</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-3">                      
                        <button 
                          onClick={() => handleEdit(item.id, item.name)}
                          className="px-3 py-1.5 text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          Sửa
                        </button>

                        <button 
                          onClick={() => handleDelete(item.id, item.name)} 
                          className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              
              {!loading && filteredData.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400">
                    Không tìm thấy dữ liệu phù hợp với từ khóa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* THÊM MỚI: Thanh điều hướng Phân trang (Pagination UI) */}
        {!loading && pagination.last_page > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Hiển thị trang <span className="text-slate-800 font-bold">{pagination.current_page}</span> / <span className="text-slate-800 font-bold">{pagination.last_page}</span> (Tổng số {pagination.total} bản ghi)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Vòng lặp hiển thị danh sách số trang trực quan */}
              {Array.from({ length: pagination.last_page }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    pagination.current_page === pageNumber
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}