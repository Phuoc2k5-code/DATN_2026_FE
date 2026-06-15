import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  LayoutTemplate, 
  X,
  Loader2
} from 'lucide-react';

export default function CvTemplateManagement() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // State điều khiển Modal Thêm / Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = Thêm mới, có ID = Sửa
  const [formData, setFormData] = useState({ name: '', file_path: '', description: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  const token = localStorage.getItem('token');

  // ================= 1. HÀM LẤY DANH SÁCH (GET) =================
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8000/api/admin/cv-templates-management', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await res.json();
      if (result.success) setTemplates(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // ================= 2. ĐIỀU KHIỂN MODAL =================
  const openModal = (template = null) => {
    if (template) {
      setEditingId(template.id);
      setFormData({ 
        name: template.name, 
        file_path: template.file_path, 
        description: template.description || '' 
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', file_path: '', description: '' });
    }
    setIsModalOpen(true);
  };

  // ================= 3. HÀM THÊM / SỬA (POST / PUT) =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const url = editingId 
      ? `http://127.0.0.1:8000/api/admin/update-cv-templates/${editingId}`
      : 'http://127.0.0.1:8000/api/admin/create-cv-template';

    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        setIsModalOpen(false);
        fetchTemplates();
      } else {
        alert(result.message || 'Có lỗi xảy ra.');
      }
    } catch (error) {
      alert('Lỗi kết nối.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // ================= 4. HÀM XÓA MỀM (DELETE) =================
  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa mẫu CV "${name}" vào thùng rác không?`)) {
      // Lưu lại danh sách cũ phòng trường hợp API bị lỗi thì khôi phục
      const originalTemplates = [...templates];

      // CẬP NHẬT GIAO DIỆN LẬP TỨC (Biến mất luôn trên màn hình, admin không thể spam)
      setTemplates(prevTemplates => prevTemplates.filter(t => t.id !== id));
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/admin/delete-cv-templates/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
          alert(result.message);
          setTemplates(templates.filter(t => t.id !== id));
        }
      } catch (error) {
        alert('Lỗi khi xóa.');
      }
    }
  };

  // Lọc tìm kiếm theo Tên mẫu hoặc Mã layout code
  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.file_path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 p-6">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-blue-600" /> Quản lý mẫu CV
          </h1>
          <p className="text-sm text-slate-500 mt-1">Cấu hình tên hiển thị, phong cách và định danh mã nguồn layout cho các biểu mẫu CV.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm mẫu mới</span>
        </button>
      </div>

      {/* Bộ lọc tìm kiếm */}
      <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã định danh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* HIỂN THỊ NỘI DUNG */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500 mb-2" /> Đang tải danh sách mẫu...
        </div>
      ) : filteredTemplates.length > 0 ? (
        
        /* GIAO DIỆN DẠNG BẢNG (LIST VIEW THUẦN) */
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="px-6 py-4 font-semibold w-16">ID</th>
                  <th className="px-6 py-4 font-semibold">Tên mẫu hiển thị</th>
                  <th className="px-6 py-4 font-semibold">Mã định danh Layout</th>
                  <th className="px-6 py-4 font-semibold">Đoạn mô tả phong cách</th>
                  <th className="px-6 py-4 font-semibold text-center">Số lượt sử dụng</th>
                  <th className="px-6 py-4 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTemplates.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-400 font-mono">#{item.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">{item.name}</td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-slate-600 font-mono rounded">
                        {item.file_path}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                      {item.description || <span className="text-slate-300 italic">Chưa có mô tả</span>}
                    </td>
                    {/* Sử dụng đúng trường candidates_count đồng bộ với Laravel */}
                    <td className="px-6 py-4 text-center font-bold text-slate-700">
                      {item.candidates_count ?? 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-1.5">
                        <button 
                          onClick={() => openModal(item)} 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.name)} 
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa mềm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 text-center py-16 px-4 rounded-xl shadow-sm text-slate-400">
          <LayoutTemplate className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-medium text-slate-600">Không tìm thấy mẫu CV nào</p>
        </div>
      )}

      {/* ================= MODAL THÊM / SỬA (POPUP FORM) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">{editingId ? 'Cập Nhật Mẫu CV' : 'Thêm Mẫu CV Mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tên mẫu hiển thị</label>
                  <input type="text" required placeholder="Ví dụ: Mẫu IT Đột Phá..." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mã Layout định danh (file_path)</label>
                  <input type="text" required disabled={editingId !== null} placeholder="Ví dụ: modern, elegant-v2..." value={formData.file_path} onChange={(e) => setFormData({ ...formData, file_path: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Đoạn mô tả phong cách</label>
                  <textarea rows="3" placeholder="Ghi chú phong cách hoặc gợi ý ngành nghề phù hợp..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-200 rounded-xl hover:bg-slate-300 transition-colors">Hủy</button>
                <button type="submit" disabled={submitLoading} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1">
                  {submitLoading && <Loader2 className="h-3 w-3 animate-spin" />} Lưu dữ liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}