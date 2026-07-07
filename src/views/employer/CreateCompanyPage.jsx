import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, FileText, Globe, AlignLeft, 
  Briefcase, Users, Calendar, MapPin, Gift, AlertCircle, Upload, Image as ImageIcon
} from 'lucide-react';

export default function CreateCompanyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy email ẩn được truyền từ trang đăng ký / OTP qua state của react-router-dom
  const userEmail = location.state?.email || '';

  // Quản lý dữ liệu Form văn bản (Đã loại bỏ business_license ra khỏi đây)
  const [formData, setFormData] = useState({
    company_name: '',
    tax_code: '',
    website_url: '',
    industry: '',
    size: '',
    founded_year: '',
    address: '',
    description: '',
    benefits: ''
  });

  // State quản lý file Logo và link xem trước
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('http://127.0.0.1:8000/logoCompany/logo-default.png');

  // 🚀 STATE MỚI: Quản lý file ảnh Giấy phép kinh doanh và link xem trước
  const [licenseFile, setLicenseFile] = useState(null);
  const [licensePreview, setLicensePreview] = useState('');

  // Quản lý trạng thái UI
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Bảo vệ Route
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

  // Hàm xử lý chọn ảnh logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Vui lòng chỉ chọn file hình ảnh cho Logo (png, jpg, jpeg...).');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Dung lượng ảnh logo không được vượt quá 2MB.');
        return;
      }
      setError('');
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // 🚀 HÀM MỚI: Xử lý chọn ảnh Giấy phép kinh doanh
  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Vui lòng chỉ chọn file hình ảnh cho Giấy phép kinh doanh (png, jpg, jpeg...).');
        return;
      }
      if (file.size > 4 * 1024 * 1024) { // Cho phép ảnh GPKD tối đa 4MB vì cần độ nét cao
        setError('Dung lượng ảnh Giấy phép kinh doanh không được vượt quá 4MB.');
        return;
      }
      setError('');
      setLicenseFile(file);
      setLicensePreview(URL.createObjectURL(file));
    }
  };

  // Hàm gọi API khi bấm Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Bắt buộc kiểm tra xem đã upload ảnh GPKD chưa (Nếu backend của bạn yêu cầu trường này)
    if (!licenseFile) {
      setError('Vui lòng tải lên ảnh Giấy phép kinh doanh để xác thực doanh nghiệp.');
      return;
    }

    setLoading(true);

    const dataToSend = new FormData();
    
    // 1. Đưa thông tin tài khoản liên kết vào
    dataToSend.append('email', userEmail);
    
    // 2. Đổ toàn bộ các thông tin văn bản từ state formData vào
    Object.keys(formData).forEach(key => {
      dataToSend.append(key, formData[key]);
    });

    // 3. Đính kèm file ảnh Logo (nếu có)
    if (logoFile) {
      dataToSend.append('logo', logoFile);
    }

    // 4. 🚀 Đính kèm file ảnh Giấy phép kinh doanh vào trường business_license
    if (licenseFile) {
      dataToSend.append('business_license', licenseFile);
    }

    axios.post('http://127.0.0.1:8000/api/companies/register', dataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      setLoading(false);
      if (response.data.success) {
        alert('Tạo hồ sơ công ty thành công! Vui lòng tiến hành đăng nhập vào hệ thống.');
        navigate('/login');
      }
    })
    .catch(err => {
      setLoading(false);
      if (err.response && err.response.data) {
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

        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

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
              onChange={handleLogoChange}
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

          {/* Nhóm 2: GIẤY PHÉP KINH DOANH (DẠNG ẢNH) & WEBSITE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 🚀 THAY ĐỔI: Giao diện chọn ảnh Giấy phép kinh doanh */}
            <div className="space-y-1">
              <label className="block text-left text-xs font-semibold text-slate-600">Giấy phép kinh doanh (Bản ảnh) <span className="text-rose-500">*</span></label>
              <div className="flex items-center gap-3 p-2 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white transition h-[46px]">
                <input 
                  id="license-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleLicenseChange}
                  className="hidden" 
                />
                <label htmlFor="license-upload" className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 cursor-pointer shadow-sm hover:bg-slate-50 flex items-center gap-1 shrink-0">
                  <Upload size={14} /> Tải ảnh lên
                </label>
                <div className="text-xs text-slate-500 truncate flex items-center gap-1 w-full">
                  {licenseFile ? (
                    <span className="text-emerald-600 font-medium truncate flex items-center gap-1">
                      <ImageIcon size={14} /> {licenseFile.name}
                    </span>
                  ) : (
                    'Chưa chọn tệp ảnh GPKD...'
                  )}
                </div>
              </div>
              
              {/* Vùng hiển thị xem trước thu nhỏ của GPKD nếu đã chọn file */}
              {licensePreview && (
                <div className="mt-2 p-2 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center max-h-[140px] overflow-hidden">
                  <img src={licensePreview} alt="License Preview" className="max-h-[120px] rounded object-contain shadow-sm bg-white" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-left text-xs font-semibold text-slate-600">Đường dẫn Website</label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition grid-disabled-alignment">
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