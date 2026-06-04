import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GraduationCap, Code, User, Save, Check, Target, Link, ShieldAlert, FolderGit2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// 1. CẤU TRÚC FORM TRỐNG CHUẨN ĐỒNG BỘ BACKEND LARAVEL
const INITIAL_EMPTY_FORM = {
  fullName: '',
  gender: 'Nam',
  birthday: '',
  email: '',        // Email hiển thị trên profile CV
  phone: '',
  address: '',
  avatarUrl: '',
  links: { github: '', linkedin: '' }, // Lưu dạng JSON Object
  summary: '',      // Giới thiệu bản thân (Gộp chung quá trình/kinh nghiệm làm việc tổng quát)
  objective: '',    // Mục tiêu nghề nghiệp
  experienceYears: 0,
  education: '',    // Thông tin học vấn dạng Text lớn
  skills: [],       // Mảng chứa các thẻ Tag kỹ năng chuyên môn
  // Trường projects lưu cấu trúc JSON mảng chứa nhiều đồ án như hai em đề xuất
  projects: [
    { project_name: '', role: '', duration: '', description: '' }
  ],
  contactReference: { name: '', phone: '', relationship: '' }, // Người liên hệ dạng JSON Object
  cvTemplateId: 'modern',
  categoryId: 1     // Mã danh mục ngành nghề mặc định
};

// Danh sách Kỹ năng chuẩn hệ thống dùng cho Bước 1 (Gợi ý tự động)
const SYSTEM_SUGGESTED_SKILLS = [
  'ReactJS', 'Node.js', 'Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 
  'JavaScript', 'Python', 'Git', 'UI/UX Design', 'English Communication'
];

export default function CreateCV() {
  const { id } = useParams(); // Lấy ID nếu ở route chỉnh sửa: /edit-cv/:id
  const navigate = useNavigate();

  const [mode, setMode] = useState('create');
  const [skillInput, setSkillInput] = useState('');
  const [cvData, setCvData] = useState(INITIAL_EMPTY_FORM);

  // Danh sách các mẫu giao diện hiển thị CV
  const cvTemplates = [
    { id: 'classic', name: 'Mẫu Truyền Thống', desc: 'Thanh lịch, chuẩn mực cho mọi ngành nghề', color: 'bg-slate-700', preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&auto=format&fit=crop&q=60' },
    { id: 'modern', name: 'Mẫu Hiện Đại', desc: 'Thiết kế 2 cột tối ưu diện tích, trẻ trung', color: 'bg-blue-600', preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=60' },
    { id: 'creative', name: 'Mẫu Sáng Tạo', desc: 'Phá cách, phù hợp ngành Marketing, Design', color: 'bg-purple-600', preview: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=300&auto=format&fit=crop&q=60' }
  ];

  // 2. TỰ ĐỘNG NẠP MOCK DATA NẾU LÀ TRẠNG THÁI EDIT (PHỤC VỤ DEMO TUẦN 4)
  useEffect(() => {
    if (id) {
      setMode('edit');
      setCvData({
        fullName: 'Nguyễn Văn A',
        gender: 'Nam',
        birthday: '2004-05-15',
        email: 'nguyenvana.cv@gmail.com',
        phone: '0901234567',
        address: 'Quận 5, TP. Hồ Chí Minh',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        links: { github: 'https://github.com/nguyenvana', linkedin: 'https://linkedin.com/in/nguyenvana' },
        summary: 'Lập trình viên Fullstack năng động với hơn 1 năm làm các đồ án thực tế. Đã từng làm việc cộng tác ngắn hạn tại công ty công nghệ ABC ở vị trí thực tập sinh Frontend.',
        objective: 'Tích lũy thêm kinh nghiệm thực chiến với hệ thống lớn và trở thành Fullstack Engineer trong vòng 3 năm tới.',
        experienceYears: 1,
        education: '- Cao đẳng Kỹ thuật Cao Thắng (2023 - 2026)\nChuyên ngành: Công nghệ thông tin\nGPA đạt được: 3.45/4.0',
        skills: ['ReactJS', 'Laravel', 'Tailwind CSS', 'JavaScript', 'Git', 'MySQL'],
        // Nhập cấu trúc nhiều dự án giả lập như thiết kế JSON
        projects: [
          { 
            project_name: 'Hệ thống Quản lý và Hỗ trợ Viết CV', 
            role: 'Fullstack Developer (Trưởng nhóm)', 
            duration: '01/2026 - 05/2026', 
            description: 'Phối hợp thiết kế giao diện ReactJS, xây dựng API quản lý bằng Laravel. Tối ưu hóa cơ sở dữ liệu MySQL lưu dạng JSON mảng.' 
          },
          { 
            project_name: 'Website Thương mại Điện tử Đồ gia dụng', 
            role: 'Backend Developer', 
            duration: '09/2025 - 12/2025', 
            description: 'Thiết kế cơ sở dữ liệu, viết API xử lý giỏ hàng, đặt hàng và tích hợp thành công cổng thanh toán VNPAY.' 
          }
        ],
        contactReference: { name: 'Nguyễn Văn B', phone: '0907654321', relationship: 'Anh trai' },
        cvTemplateId: 'modern',
        categoryId: 1
      });
    } else {
      setMode('create');
      setCvData(INITIAL_EMPTY_FORM);
    }
  }, [id]);

  const handleResetForm = () => {
    if(window.confirm("Bạn có chắc chắn muốn xóa sạch toàn bộ dữ liệu đang nhập không?")) {
      setCvData(INITIAL_EMPTY_FORM);
    }
  };

  // Thay đổi các trường văn bản cơ bản ở tầng nông
  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setCvData({ ...cvData, [name]: value });
  };

  // Thay đổi dữ liệu của các Object JSON lồng sâu (links, contactReference)
  const handleNestedChange = (section, field, value) => {
    setCvData({
      ...cvData,
      [section]: {
        ...cvData[section],
        [field]: value
      }
    });
  };

  // 3. LOGIC XỬ LÝ DYNAMIC FORM MẢNG JSON DỰ ÁN/ĐỒ ÁN (Ý TƯỞNG CỦA PHÚC & PHƯỚC)
  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...cvData.projects];
    updatedProjects[index][field] = value;
    setCvData({ ...cvData, projects: updatedProjects });
  };

  const handleAddProject = () => {
    setCvData({
      ...cvData,
      projects: [...cvData.projects, { project_name: '', role: '', duration: '', description: '' }]
    });
  };

  const handleRemoveProject = (index) => {
    if (cvData.projects.length > 1) {
      const updatedProjects = cvData.projects.filter((_, i) => i !== index);
      setCvData({ ...cvData, projects: updatedProjects });
    }
  };

  // 4. LOGIC XỬ LÝ HỆ THỐNG KỸ NĂNG THEO LUỒNG 3 BƯỚC THÔNG MINH
  const handleSelectSuggestedSkill = (skill) => {
    if (!cvData.skills.includes(skill)) {
      setCvData({ ...cvData, skills: [...cvData.skills, skill] });
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = skillInput.trim().replace(',', '');
      if (trimmed && !cvData.skills.includes(trimmed)) {
        setCvData({ ...cvData, skills: [...cvData.skills, trimmed] });
      }
      setSkillInput('');
    }
  };

  const removeSkillTag = (skillToRemove) => {
    setCvData({
      ...cvData,
      skills: cvData.skills.filter((skill) => skill !== skillToRemove)
    });
  };

  // 5. GỬI DỮ LIỆU LÊN SERVER BACKEND LARAVEL
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('DỮ LIỆU ĐÓNG GÓI CHUẨN JSON TRƯỚC KHI GỬI LÊN LARAVEL:', cvData);
    
    if (mode === 'edit') {
      alert(`[API PUT] Cập nhật thành công thông tin hồ sơ của ứng viên: ${cvData.fullName}!`);
    } else {
      alert(`[API POST] Tạo mới thành công thông tin hồ sơ của ứng viên: ${cvData.fullName}!`);
    }
    navigate('/candidate/manage-cv'); // Chuyển hướng sau khi xử lý thành công
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* BANNER HEADER DỰA TRÊN BIẾN TRẠNG THÁI MODE */}
          <div className={`rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 from-amber-100 to-orange-100 bg-gradient-to-r`}>
            <div>
              <h1 className="text-2xl font-bold">
                {mode === 'edit' ? 'Cập nhật Thông tin & CV Ứng viên' : 'Thiết lập Thông tin & CV Ứng viên'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {mode === 'edit' ? `Mã ID hồ sơ đang chọn hệ thống: ${id}` : 'Dữ liệu được đóng gói tự động thành chuỗi JSON đồng bộ cấu trúc API Laravel.'}
              </p>
            </div>
          </div>

          {/* BƯỚC 1: KHAI BÁO THÔNG TIN THEO DATABASE MỚI */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Bước 1: Khai báo thông tin hồ sơ</h3>

            {/* PHẦN 1. THÔNG TIN CÁ NHÂN & LIÊN HỆ CƠ BẢN */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={20} /></div>
                <h2 className="text-lg font-bold text-slate-800">Thông tin cá nhân & Liên hệ</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Khu vực Upload / Hiển thị Avatar */}
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:border-blue-400 transition relative w-full max-w-sm mx-auto h-fit">
                  {cvData.avatarUrl ? (
                    <img src={cvData.avatarUrl} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100 mb-3" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-200 flex flex-col items-center justify-center text-slate-400 mb-3 ring-4 ring-slate-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                  )}
                  <label className="cursor-pointer bg-white border border-slate-200 shadow-sm text-xs font-semibold px-4 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 transition block text-center w-full max-w-[180px]">
                    <span>Chọn ảnh đại diện</span>
                    <input type="file" accept="image/*" className="hidden" onChange={() => setCvData({...cvData, avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'})} />
                  </label>
                </div>

                {/* Các ô nhập liệu thông tin cơ bản */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Họ và tên ứng viên *</label>
                    <input required type="text" name="fullName" value={cvData.fullName} onChange={handleBaseChange} placeholder="VD: Nguyễn Văn A" className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Số điện thoại liên hệ *</label>
                    <input required type="tel" name="phone" value={cvData.phone} onChange={handleBaseChange} placeholder="VD: 0901234567" className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Địa chỉ Email hiển thị trên CV *</label>
                    <input required type="email" name="email" value={cvData.email} onChange={handleBaseChange} placeholder="VD: nguyenvana@gmail.com" className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Giới tính</label>
                      <select name="gender" value={cvData.gender} onChange={handleBaseChange} className="w-full px-3 py-2 border rounded-xl text-sm bg-white outline-none">
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Ngày sinh</label>
                      <input type="date" name="birthday" value={cvData.birthday} onChange={handleBaseChange} className="w-full px-3 py-2 border rounded-xl text-sm outline-none" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Địa chỉ cư trú hiện tại</label>
                    <input type="text" name="address" value={cvData.address} onChange={handleBaseChange} placeholder="VD: Quận 5, TP. Hồ Chí Minh" className="w-full px-3 py-2 border rounded-xl text-sm outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* PHẦN 2. MẠNG XÃ HỘI & NGƯỜI LIÊN HỆ KHẨN CẤP (LƯU DẠNG CẤU TRÚC JSON OBJECT) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box liên kết MXH */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b text-indigo-600">
                  <Link size={18} /> <h3 className="font-bold text-slate-800 text-base">Liên kết hồ sơ mạng xã hội (Json)</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Đường dẫn tài khoản GitHub</label>
                    <input type="url" value={cvData.links.github} onChange={(e) => handleNestedChange('links', 'github', e.target.value)} placeholder="https://github.com/username" className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Đường dẫn tài khoản LinkedIn</label>
                    <input type="url" value={cvData.links.linkedin} onChange={(e) => handleNestedChange('links', 'linkedin', e.target.value)} placeholder="https://linkedin.com/in/username" className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                </div>
              </div>

              {/* Box người liên hệ khẩn cấp */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b text-rose-600">
                  <ShieldAlert size={18} /> <h3 className="font-bold text-slate-800 text-base">Thông tin người liên hệ tham chiếu (Json)</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Họ tên người liên hệ</label>
                      <input type="text" value={cvData.contactReference.name} onChange={(e) => handleNestedChange('contactReference', 'name', e.target.value)} placeholder="VD: Nguyễn Văn B" className="w-full px-3 py-2 border rounded-xl text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Mối quan hệ xác thực</label>
                      <input type="text" value={cvData.contactReference.relationship} onChange={(e) => handleNestedChange('contactReference', 'relationship', e.target.value)} placeholder="VD: Anh trai, Quản lý cũ" className="w-full px-3 py-2 border rounded-xl text-sm outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Số điện thoại liên hệ xác minh</label>
                    <input type="tel" value={cvData.contactReference.phone} onChange={(e) => handleNestedChange('contactReference', 'phone', e.target.value)} placeholder="VD: 0907654321" className="w-full px-3 py-2 border rounded-xl text-sm outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* PHẦN 3. MỤC TIÊU NGHỀ NGHIỆP & GIỚI THIỆU BẢN THÂN (GỘP KINH NGHIỆM CHUNG) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 pb-3 mb-3 border-b text-blue-600">
                  <User size={18} /> <h3 className="font-bold text-slate-800 text-base">Giới thiệu bản thân & Lịch sử làm việc tổng quát</h3>
                </div>
                <textarea rows="5" name="summary" value={cvData.summary} onChange={handleBaseChange} placeholder="Tóm tắt ngắn gọn thế mạnh nổi bật và sơ lược lịch sử các công ty bạn đã từng đi làm hoặc cộng tác..." className="w-full px-3 py-2 border rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div>
                <div className="flex items-center gap-2 pb-3 mb-3 border-b text-emerald-600">
                  <Target size={18} /> <h3 className="font-bold text-slate-800 text-base">Mục tiêu nghề nghiệp tương lai</h3>
                </div>
                <textarea rows="5" name="objective" value={cvData.objective} onChange={handleBaseChange} placeholder="Nêu rõ định hướng đóng góp và mục tiêu thăng tiến ngắn hạn/dài hạn trong công việc sắp tới..." className="w-full px-3 py-2 border rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
            </div>

            {/* PHẦN 4. TRÌNH ĐỘ HỌC VẤN (TEXT) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2.5 pb-3 mb-3 border-b text-sky-600">
                <GraduationCap size={20} />
                <h2 className="text-base font-bold text-slate-800">Trình độ học vấn / Bằng cấp chứng chỉ liên quan</h2>
              </div>
              <textarea rows="4" name="education" value={cvData.education} onChange={handleBaseChange} placeholder="Khai báo chi tiết thông tin trường học, chuyên ngành học, niên khóa tốt nghiệp và điểm số GPA nếu có..." className="w-full px-3 py-2 border rounded-xl text-sm resize-none bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-sky-500/20" />
            </div>

            {/* PHẦN 5. QUẢN LÝ DANH SÁCH DỰ ÁN & ĐỒ ÁN (CẤU TRÚC MẢNG JSON ĐỘNG LINH HOẠT - Ý PHÚC PHƯỚC) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5 text-amber-600">
                  <FolderGit2 size={20} />
                  <h2 className="text-lg font-bold text-slate-800">Danh sách Dự án & Đồ án Thực tế (Mảng JSON)</h2>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Tổng năm KN:</label>
                  <input type="number" min="0" name="experienceYears" value={cvData.experienceYears} onChange={handleBaseChange} className="w-16 px-2 py-1 border rounded-lg text-sm text-center outline-none focus:ring-2 focus:ring-amber-500/20" />
                </div>
              </div>

              {/* Vòng lặp map sinh khối Form nhập liệu động cho từng đồ án */}
              <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2">
                {cvData.projects.map((item, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 relative space-y-3 group hover:border-amber-300 transition">
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                        Dự án / Đồ án độc lập #{index + 1}
                      </span>
                      {cvData.projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(index)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                          title="Xóa bỏ khối dự án này"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tên công ty / Tên đồ án *</label>
                        <input required type="text" value={item.project_name} onChange={(e) => handleProjectChange(index, 'project_name', e.target.value)} placeholder="VD: Hệ Thống Website Tìm Việc Làm" className="w-full px-3 py-2 bg-white border rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Vị trí / Vai trò đảm nhiệm *</label>
                        <input required type="text" value={item.role} onChange={(e) => handleProjectChange(index, 'role', e.target.value)} placeholder="VD: Fullstack Engineer" className="w-full px-3 py-2 bg-white border rounded-lg text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Khoảng thời gian thực hiện *</label>
                        <input required type="text" value={item.duration} onChange={(e) => handleProjectChange(index, 'duration', e.target.value)} placeholder="VD: 01/2026 - 05/2026" className="w-full px-3 py-2 bg-white border rounded-lg text-sm outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Mô tả chi tiết đồ án (Tính năng, công nghệ áp dụng) *</label>
                      <textarea required rows="3" value={item.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} placeholder="VD: Sử dụng ReactJS làm UI components, kết hợp Laravel xử lý APIs backend. Lưu cấu trúc dữ liệu projects dạng chuỗi JSON mảng..." className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs resize-none outline-none focus:ring-2 focus:ring-amber-500/20" />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddProject}
                className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-amber-500 hover:bg-amber-50/20 rounded-xl text-xs font-bold text-slate-600 hover:text-amber-700 transition flex items-center justify-center gap-1.5"
              >
                <Plus size={14} /> Bấm để thêm khối dự án / đồ án mới
              </button>
            </div>

            {/* PHẦN 6. THIẾT LẬP KỸ NĂNG CHUYÊN MÔN THEO 3 BƯỚC ĐẠT CHUẨN UX */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Code size={20} /></div>
                <h2 className="text-lg font-bold text-slate-800">Thiết lập Kỹ năng Chuyên môn</h2>
              </div>

              {/* BƯỚC 1 */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-purple-600 block">Bước 1: Chọn nhanh kỹ năng hệ thống gợi ý</span>
                <div className="flex flex-wrap gap-1.5">
                  {SYSTEM_SUGGESTED_SKILLS.map((skill, idx) => {
                    const isExist = cvData.skills.includes(skill);
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isExist}
                        onClick={() => handleSelectSuggestedSkill(skill)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition ${
                          isExist 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through' 
                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                        }`}
                      >
                        + {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BƯỚC 2 */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-blue-600 block">Bước 2: Tìm kiếm hoặc tự tạo kỹ năng mới</span>
                <div className="border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition">
                  <input 
                    type="text" 
                    value={skillInput} 
                    onChange={(e) => setSkillInput(e.target.value)} 
                    onKeyDown={handleSkillKeyDown} 
                    placeholder="Gõ kỹ năng mong muốn (Ví dụ: Git, Docker) rồi nhấn 'Enter' để lưu..." 
                    className="w-full bg-transparent outline-none text-sm text-slate-700" 
                  />
                </div>
              </div>

              {/* BƯỚC 3 */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-slate-500 block">Bước 3: Danh sách các kỹ năng bạn đã chọn ({cvData.skills.length})</span>
                {cvData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    {cvData.skills.map((skill, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm">
                        {skill}
                        <button type="button" onClick={() => removeSkillTag(skill)} className="hover:bg-blue-700 text-blue-200 hover:text-white rounded w-4 h-4 flex items-center justify-center text-xs font-bold transition">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Chưa có kỹ năng nào được chọn. Hãy dùng Bước 1 hoặc Bước 2 ở trên để thiết lập.</p>
                )}
              </div>
            </div>
          </div>

          {/* BƯỚC 2: CHỌN MẪU GIAO DIỆN HIỂN THỊ CV KHÔNG ĐỔI */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Bước 2: Chọn mẫu giao diện hiển thị CV</h3>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {cvTemplates.map((tpl) => {
                  const isSelected = cvData.cvTemplateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setCvData({ ...cvData, cvTemplateId: tpl.id })}
                      className={`group relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 bg-slate-50 flex flex-col ${isSelected
                        ? 'border-blue-600 ring-4 ring-blue-50 shadow-md transform -translate-y-1'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-200 border-b">
                        <img src={tpl.preview} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                            <span className="bg-blue-600 text-white p-2 rounded-full shadow-lg"><Check size={20} strokeWidth={3} /></span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${tpl.color}`} />
                          <h4 className="font-bold text-slate-800 text-sm">{tpl.name}</h4>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">{tpl.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* HÀNH ĐỘNG ĐIỀU KHIỂN CHÍNH (ACTIONS FOOTER) */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            {mode === 'create' && (
              <button type="button" onClick={handleResetForm} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-sm text-slate-700 hover:bg-slate-50 transition shadow-sm">
                Xóa sạch dữ liệu form
              </button>
            )}
            
            <button type="submit" className={`inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow transition ${
              mode === 'edit' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}>
              <Save size={18} /> 
              {mode === 'edit' ? "Cập nhật CV ngay" : "Tạo và Lưu trữ hồ sơ"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}