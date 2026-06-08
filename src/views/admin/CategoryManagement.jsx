import React, { useState } from 'react';
import { Search, Plus, Edit3, Trash2, Tag, CheckCircle, XCircle } from 'lucide-react';

export default function CategoryManagement() {
  const initialCategories = [
    { id: 'CAT01', name: 'Công nghệ thông tin', slug: 'cong-nghe-thong-tin', jobCount: 1250, status: 'active' },
    { id: 'CAT02', name: 'Marketing / Truyền thông', slug: 'marketing-truyen-thong', jobCount: 840, status: 'active' },
    { id: 'CAT03', name: 'Kế toán / Kiểm toán', slug: 'ke-toan-kiem-toan', jobCount: 430, status: 'active' },
    { id: 'CAT04', name: 'Thiết kế đồ họa', slug: 'thiet-ke-do-hoa', jobCount: 320, status: 'hidden' },
  ];

  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleStatus = (id) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, status: cat.status === 'active' ? 'hidden' : 'active' } : cat
    ));
  };

  const handleDelete = (id, name) => {
    if(window.confirm(`Xóa danh mục "${name}" có thể ảnh hưởng đến các tin tuyển dụng liên quan. Bạn có chắc chắn?`)) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý danh mục</h1>
          <p className="text-sm text-slate-500 mt-1">Cấu trúc và phân loại các ngành nghề, lĩnh vực trên hệ thống.</p>
        </div>
        <button className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all w-fit">
          <Plus className="w-4 h-4" />
          <span>Thêm danh mục mới</span>
        </button>
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tên danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Tên danh mục</th>
                <th className="px-6 py-4 font-semibold text-center">Số lượng việc làm</th>
                <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Tag className="w-4 h-4" /></div>
                      <div>
                        <div className="font-semibold text-slate-900">{cat.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">/{cat.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-700">{cat.jobCount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    {cat.status === 'active' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Đang hiển thị</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">Đang ẩn</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-3">
                      <button onClick={() => handleToggleStatus(cat.id)} className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors">
                        {cat.status === 'active' ? 'Ẩn' : 'Hiện'}
                      </button>
                      <button className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors">Sửa</button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}