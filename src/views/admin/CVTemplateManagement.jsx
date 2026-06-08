import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  LayoutTemplate, 
  Grid, 
  List,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function CvTemplateManagement() {
  // Dữ liệu mẫu CV giả lập (Có hình ảnh minh họa, danh mục, trạng thái)
  const initialTemplates = [
    {
      id: 'CV001',
      title: 'Mẫu CV IT Chuyên Nghiệp',
      category: 'Công nghệ thông tin',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=400',
      status: 'active', // active hoặc draft
      usedCount: 1420,  // Số lượt ứng viên đã dùng mẫu này
    },
    {
      id: 'CV002',
      title: 'Mẫu CV Thanh Lịch - Pastel',
      category: 'Marketing / Kinh doanh',
      thumbnail: 'https://images.unsplash.com/photo-1616448332195-fb0b1f21cc41?auto=format&fit=crop&q=80&w=400',
      status: 'active',
      usedCount: 895,
    },
    {
      id: 'CV003',
      title: 'Mẫu CV Kế Toán Trưởng',
      category: 'Tài chính / Kế toán',
      thumbnail: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400',
      status: 'draft', // Bản nháp, đang thiết kế chưa public
      usedCount: 0,
    },
    {
      id: 'CV004',
      title: 'Mẫu CV Sáng Tạo cho Designer',
      category: 'Thiết kế / Đồ họa',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400',
      status: 'active',
      usedCount: 2310,
    }
  ];

  const [templates, setTemplates] = useState(initialTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' hoặc 'list' để Admin đổi cách hiển thị

  // Hàm xóa mẫu CV
  const handleDelete = (id, title) => {
    if (window.confirm(`Bạn có chắc muốn xóa mẫu CV "${title}" không?`)) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  // Hàm đổi trạng thái Active / Draft nhanh
  const toggleStatus = (id) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, status: t.status === 'active' ? 'draft' : 'active' } : t
    ));
  };

  // Quét tìm kiếm theo Tên mẫu hoặc Danh mục ngành nghề
  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý mẫu CV</h1>
          <p className="text-sm text-slate-500 mt-1">Thiết kế, cập nhật và theo dõi hiệu suất các biểu mẫu CV cung cấp cho ứng viên.</p>
        </div>
        
        {/* Nút Thêm Mẫu CV Mới */}
        <button className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all w-fit">
          <Plus className="w-4 h-4" />
          <span>Tải lên mẫu mới</span>
        </button>
      </div>

      {/* Bộ lọc & Chuyển đổi View Mode */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Ô tìm kiếm */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên CV hoặc ngành nghề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Nút chuyển đổi giao diện Lưới (Grid) hoặc Danh sách (List) */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            title="Hiển thị dạng lưới ảnh"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            title="Hiển thị dạng danh bạ"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* NỘI DUNG CHÍNH */}
      {viewMode === 'grid' ? (
        /* GIAO DIỆN DẠNG LƯỚI (GRID CARD) - Rất trực quan đối với CV */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm group hover:shadow-md transition-all flex flex-col">
              {/* Vùng Ảnh Thumbnail có phủ mờ khi Hover */}
              <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden border-b border-slate-100">
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Lớp phủ action xuất hiện khi hover chuộc vào card */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg shadow transition-colors" title="Xem trước mẫu">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg shadow transition-colors" title="Chỉnh sửa thông tin">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 bg-white hover:bg-red-50 text-red-600 rounded-lg shadow transition-colors" 
                    title="Xóa mẫu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Badge trạng thái nằm đè lên ảnh */}
                <div className="absolute top-3 left-3">
                  {item.status === 'active' ? (
                    <span className="inline-flex items-center text-[11px] font-bold uppercase bg-emerald-500 text-white px-2 py-0.5 rounded shadow-sm">Sử dụng</span>
                  ) : (
                    <span className="inline-flex items-center text-[11px] font-bold uppercase bg-slate-400 text-white px-2 py-0.5 rounded shadow-sm">Bản nháp</span>
                  )}
                </div>
              </div>

              {/* Thông tin chữ bên dưới ảnh */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-blue-600 tracking-wider uppercase">{item.category}</span>
                  <h3 className="font-bold text-slate-800 text-sm mt-0.5 line-clamp-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{item.usedCount.toLocaleString()} lượt dùng</span>
                  
                  {/* Switch nhanh trạng thái ẩn hiện bằng Text link */}
                  <button 
                    onClick={() => toggleStatus(item.id)}
                    className={`text-xs font-semibold ${item.status === 'active' ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'}`}
                  >
                    {item.status === 'active' ? 'Ẩn mẫu' : 'Kích hoạt'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GIAO DIỆN DẠNG BẢNG (LIST VIEW) - Thích hợp khi cần quản lý nhanh hàng loạt */
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="px-6 py-4 font-semibold">Mẫu CV</th>
                  <th className="px-6 py-4 font-semibold">Danh mục ngành</th>
                  <th className="px-6 py-4 font-semibold text-center">Số lượt sử dụng</th>
                  <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTemplates.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Hình nhỏ + Tên mẫu */}
                    <td className="px-6 py-3 flex items-center space-x-3">
                      <img src={item.thumbnail} alt="" className="w-10 h-12 object-cover rounded border border-slate-200 bg-slate-100" />
                      <div className="font-semibold text-slate-900">{item.title}</div>
                    </td>
                    {/* Ngành nghề */}
                    <td className="px-6 py-3 text-slate-600">
                      {item.category}
                    </td>
                    {/* Lượt dùng */}
                    <td className="px-6 py-3 text-center font-medium text-slate-700">
                      {item.usedCount.toLocaleString()}
                    </td>
                    {/* Trạng thái */}
                    <td className="px-6 py-3 text-center">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          <span>Đang hiển thị</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                          <AlertCircle className="w-3 h-3" />
                          <span>Bản nháp</span>
                        </span>
                      )}
                    </td>
                    {/* Nút bấm thao tác */}
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => toggleStatus(item.id)}
                          className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          {item.status === 'active' ? 'Ẩn đi' : 'Hiện'}
                        </button>
                        <button className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors">
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.title)}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="bg-white border border-slate-200 text-center py-16 px-4 rounded-xl shadow-sm text-slate-400">
          <LayoutTemplate className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-medium text-slate-600">Không tìm thấy mẫu CV nào</p>
          <p className="text-xs text-slate-400 mt-1">Vui lòng thử tìm kiếm lại với từ khóa khác.</p>
        </div>
      )}

    </div>
  );
};