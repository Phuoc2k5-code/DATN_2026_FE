import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, FileText, Globe, AlignLeft, 
  Briefcase, Users, Calendar, MapPin, Gift, AlertCircle, Upload
} from 'lucide-react';

export default function CreateCompanyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy email ẩn được truyền từ trang đăng ký / OTP qua state của react-router-dom
  const userEmail = location.state?.email || '';

  // Quản lý dữ liệu Form dựa theo cấu trúc bảng companies
  const [formData, setFormData] = useState({
    company_name: '',
    tax_code: '',
    business_license: '',
    website_url: '',
    industry: '',
    size: '',
    founded_year: '',
    address: '',
    description: '',
    benefits: ''
  });

  // State quản lý file thực tế và link xem trước hình ảnh (Preview)
  const [logoFile, setLogoFile] = useState(null);
  // Sử dụng đường dẫn logo mặc định từ Laravel public làm giá trị ban đầu
  const [logoPreview, setLogoPreview] = useState('http://127.0.0.1:8000/logoCompany/logo-default.png');

  // Quản lý trạng thái UI
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Bảo vệ Route: Nếu không có email (truy cập lụi), đá người dùng về trang đăng ký
  useEffect(() => {
    if (!userEmail) {
      alert('Không tìm thấy thông tin đăng ký tài khoản. Vui lòng đăng ký lại.');
      navigate('/register');
    }
  }, [userEmail, navigate]);

  // Hàm xử lý thay đổi dữ liệu trong các ô input text/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hàm xử lý chọn ảnh logo và tạo link preview tạm thời
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng nhanh phía Client
      if (!file.type.match('image.*')) {
        setError('Vui lòng chỉ chọn file hình ảnh (png, jpg, jpeg...).');
        return;
      }
      // Kiểm tra dung lượng file (2MB = 2048 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        setError('Dung lượng ảnh logo không được vượt quá 2MB.');
        return;
      }

      setError('');
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file)); // Tạo Blob URL hiển thị tức thì trên giao diện
    }
  };

  // Hàm gọi API khi bấm Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // BẮT BUỘC: Tạo đối tượng FormData để có thể truyền file lẫn văn bản lên Laravel cùng lúc
    const dataToSend = new FormData();
    
    // 1. Đưa thông tin tài khoản liên kết vào
    dataToSend.append('email', userEmail);
    
    // 2. Đổ toàn bộ các thông tin văn bản từ state formData vào
    Object.keys(formData).forEach(key => {
      dataToSend.append(key, formData[key]);
    });

    // 3. Nếu người dùng chọn file mới, đính kèm file đó vào FormData, ngược lại backend tự lấy ảnh mặc định
    if (logoFile) {
      dataToSend.append('logo', logoFile);
    }

    // Gửi yêu cầu post tới API theo cấu trúc của hai bạn
    axios.post('http://127.0.0.1:8000/api/companies/register', dataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data', // Bắt buộc đổi header sang loại này khi có File
        'Accept': 'application/json'
      }
    })
    .then(response => {
      setLoading(false);
      if (response.data.success) {
        alert('Tạo hồ sơ công ty thành công! Vui lòng tiến hành đăng nhập vào hệ thống.');
        navigate('/login'); // Chuyển hướng sang trang đăng nhập chính thức
      }
    })
    .catch(err => {
      setLoading(false);
      if (err.response && err.response.data) {
        // Nếu backend trả về lỗi validate cụ thể từng trường
        if (err.response.data.errors) {
          const firstError = Object.values(err.response.data.errors)[0][0];
          setError(firstError);
        } else {
          setError(err.response.data.message || 'Tạo hồ sơ công ty thất bại.');
        }
      } else {
        setError('Kết nối máy chủ thất bại. Vui lòng kiểm tra lại backend.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8">
        
        {/* Tiêu đề trang */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
            <Building2 className="text-blue-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Thông tin nhà tuyển dụng</h2>
          <p className="text-slate-400 text-xs mt-1">
            Tài khoản liên kết: <strong className="text-slate-600">{userEmail}</strong>. Vui lòng hoàn tất hồ sơ doanh nghiệp của bạn.
          </p>
        </div>

        {/* Hiển thị lỗi động nếu có */}
        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* KHU VỰC UPLOAD LOGO VÀ XEM TRƯỚC */}
          <div className="flex flex-col items-center justify-center bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-5 transition hover:bg-slate-50">
            <label className="block text-xs font-semibold text-slate-600 mb-3">Logo Công Ty</label>
            <div className="relative group mb-3">
              <img 
                src={logoPreview} 
                alt="Logo Preview" 
                className="w-24 h-24 object-cover rounded-full border-2 border-slate-200 shadow-sm"
              />
              <label htmlFor="logo-upload" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <Upload size={18} />
              </label>
            </div>
            
            <input 
              id="logo-upload"
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" 
            />
            
            <label htmlFor="logo-upload" className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 cursor-pointer shadow-sm hover:bg-slate-50">
              Chọn ảnh làm logo
            </label>
            <p className="text-[10px] text-slate-400 mt-1.5">Hỗ trợ định dạng JPG, PNG. Dung lượng tối đa 2MB.</p>
          </div>
          
          {/* Nhóm 1: Tên công ty & Mã số thuế */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-left text-xs font-semibold text-slate-600">Tên công ty <span className="text-rose-500">*</span></label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                <Building2 size={16} className="text-slate-400" />
                <input required type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="Công ty TNHH JobPortal Việt Nam" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-left text-xs font-semibold text-slate-600">Mã số thuế <span className="text-rose-500">*</span></label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                <FileText size={16} className="text-slate-400" />
                <input required type="text" name="tax_code" value={formData.tax_code} onChange={handleChange} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="0102345678" />
              </div>
            </div>
          </div>

          {/* Nhóm 2: Giấy phép kinh doanh & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-left text-xs font-semibold text-slate-600">Số GPKD / Giấy phép liên quan</label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                <FileText size={16} className="text-slate-400" />
                <input type="text" name="business_license" value={formData.business_license} onChange={handleChange} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="GPKD-9999" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-left text-xs font-semibold text-slate-600">Đường dẫn Website</label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                <Globe size={16} className="text-slate-400" />
                <input type="url" name="website_url" value={formData.website_url} onChange={handleChange} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="https://company.com" />
              </div>
            </div>
          </div>

          {/* Nhóm 3: Ngành nghề, Quy mô & Năm thành lập */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-left text-xs font-semibold text-slate-600">Lĩnh vực hoạt động <span className="text-rose-500">*</span></label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                <Briefcase size={16} className="text-slate-400" />
                <input required type="text" name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="Công nghệ phần mềm, Fintech..." />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-left text-xs font-semibold text-slate-600">Quy mô nhân sự <span className="text-rose-500">*</span></label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                <Users size={16} className="text-slate-400" />
                <select required name="size" value={formData.size} onChange={handleChange} className="w-full bg-transparent outline-none text-sm text-slate-700">
                  <option value="">Chọn quy mô...</option>
                  <option value="1-50 nhân viên">1-50 nhân viên</option>
                  <option value="50-200 nhân viên">50-200 nhân viên</option>
                  <option value="200-500 nhân viên">200-500 nhân viên</option>
                  <option value="Trên 500 nhân viên">Trên 500 nhân viên</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-left text-xs font-semibold text-slate-600">Năm thành lập</label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                <Calendar size={16} className="text-slate-400" />
                <input type="number" name="founded_year" min="1900" max={new Date().getFullYear()} value={formData.founded_year} onChange={handleChange} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="2020" />
              </div>
            </div>
          </div>

          {/* Địa chỉ công ty */}
          <div className="space-y-1">
            <label className="block text-left text-xs font-semibold text-slate-600">Địa chỉ trụ sở công ty <span className="text-rose-500">*</span></label>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
              <MapPin size={16} className="text-slate-400" />
              <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="65 Huỳnh Thúc Kháng, Phường Bến Nghé, Quận 1, TP. HCM" />
            </div>
          </div>

          {/* Mô tả chi tiết */}
          <div className="space-y-1">
            <label className="block text-left text-xs font-semibold text-slate-600">Giới thiệu về công ty</label>
            <div className="flex gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
              <AlignLeft size={16} className="text-slate-400 mt-1 shrink-0" />
              <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full bg-transparent outline-none text-sm text-slate-700 resize-none" placeholder="Mô tả tóm tắt về lịch sử hình thành, văn hóa doanh nghiệp hoặc sứ mệnh..." />
            </div>
          </div>

          {/* Phúc lợi công ty */}
          <div className="space-y-1">
            <label className="block text-left text-xs font-semibold text-slate-600">Chế độ đãi ngộ & Phúc lợi</label>
            <div className="flex gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
              <Gift size={16} className="text-slate-400 mt-1 shrink-0" />
              <textarea name="benefits" rows="2" value={formData.benefits} onChange={handleChange} className="w-full bg-transparent outline-none text-sm text-slate-700 resize-none" placeholder="Ví dụ: Lương tháng 13, Bảo hiểm PVI, Du lịch hàng năm, Cấp Laptop riêng..." />
            </div>
          </div>

          {/* Nút gửi dữ liệu */}
          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition shadow-md shadow-blue-500/10">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="text-xs">Hoàn tất đăng ký & Lưu hồ sơ công ty</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}