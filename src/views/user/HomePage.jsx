import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Banner from '../../layouts/layout_user/Banner';
import SidebarLeft from '../../layouts/layout_user/SidebarLeft';
import SidebarRight from '../../layouts/layout_user/SidebarRight';
import JobCard from '../../components/JobCard';

export default function Homepage() {
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [totalPages, setTotalPages] = useState(1); 

  // Quản lý và đồng bộ bộ lọc thông qua URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Đọc số trang hiện tại từ URL, mặc định là trang 1
  const page = parseInt(searchParams.get('page')) || 1;

  // 🚀 HÀM GỌI API CHÍNH XỬ LÝ TOÀN BỘ LOGIC LOAD VÀ LỌC DỮ LIỆU
  const handleFetchJobs = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const keyword = searchParams.get('keyword') || '';
      const location = searchParams.get('location') || '';
      const category_id = searchParams.get('category_id') || '';
      const level = searchParams.get('level') || 'Nổi bật';
      
      const salaryFromRaw = searchParams.get('salary_from') || '';
      const salaryToRaw = searchParams.get('salary_to') || '';
      
      // Khởi tạo object params gửi lên server
      const params = {
        page: pageNumber,
        keyword,
        location,
        category_id,
        level,
      };

      // Chỉ gán và quy đổi nếu có giá trị lương thực tế (Tránh lỗi gửi NaN hoặc 0 bậy bạ)
      if (salaryFromRaw && !isNaN(salaryFromRaw)) {
        params.salary_from = parseFloat(salaryFromRaw) * 1000000;
      }
      if (salaryToRaw && !isNaN(salaryToRaw)) {
        params.salary_to = parseFloat(salaryToRaw) * 1000000;
      }

      // Lấy danh sách mảng types từ URL
      const typesArray = searchParams.getAll('types');
      if (typesArray.length > 0) {
        // Gửi dạng mảng sạch sẽ thông qua tính năng gộp của axios hoặc chuỗi
        params.types = typesArray; 
      }
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/api/home`, { 
        params,
        // 💡 Cấu hình ép params array luôn giữ cấu trúc chuẩn rạng: types=A&types=B độc lập
        paramsSerializer: {
          indexes: null 
        },
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        }
      });
      
      if (response.data.success) {
        setJobs(response.data.data); 
        setTotalPages(response.data.pagination?.last_page || 1); 
      } else {
        setError(response.data.message || 'Không tìm thấy dữ liệu phù hợp.');
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.response?.data?.message || 'Đã xảy ra lỗi kết nối với máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  // 🚀 TỰ ĐỘNG ĐỒNG BỘ: Cứ mỗi khi URL params hoặc số trang thay đổi, gọi lại API cập nhật dữ liệu mới lập tức
  useEffect(() => {
    handleFetchJobs(page);
  }, [searchParams, page]);

  // 🚀 XỬ LÝ CHUYỂN TRANG AN TOÀN BẢO TOÀN BỘ LỌC CŨ (Sửa lỗi mất mảng types)
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      // Dùng constructor URLSearchParams sao chép nguyên vẹn URL cũ (Giữ vững cấu trúc mảng types)
      const newParams = new URLSearchParams(searchParams);
      
      if (newPage === 1) {
        newParams.delete('page'); // Nếu về trang 1, xóa param "page" đi cho URL tinh gọn
      } else {
        newParams.set('page', newPage); // Đè số trang mới vào URL
      }

      // Cập nhật lại thanh địa chỉ URL, kích hoạt useEffect tải trang mới
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full container mx-auto px-4 py-6 space-y-6">
      {/* Khối Banner Search đầu trang */}
      <Banner 
        searchParams={searchParams} 
        setSearchParams={setSearchParams} 
      />
      <div className="flex gap-5 items-start">
        {/* Khối Bộ lọc Sidebar trái */}
        <SidebarLeft 
          searchParams={searchParams} 
          setSearchParams={setSearchParams} 
        />
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Việc tìm nổi bật</h2>
            <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">Xem tất cả</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-500">Đang tải danh sách việc làm thông minh...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
              <p className="text-sm text-red-600 font-medium">{error}</p>
              <button 
                onClick={() => handleFetchJobs(page)} 
                className="mt-2 text-xs bg-red-600 text-white px-3 py-1.5 rounded-xl hover:bg-red-700 transition"
              >
                Thử lại
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-slate-500">
              Không tìm thấy tin tuyển dụng nào khả dụng.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 items-stretch">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* THANH PHÂN TRANG CỐ ĐỊNH */}
              <div className="flex justify-center items-center space-x-1.5 pt-6 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-xs"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      type="button"
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 text-xs font-bold rounded-xl transition shadow-xs ${
                        page === pageNum
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-600'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-xs"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <SidebarRight />
      </div>
    </div>
  );
}