import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GraduationCap, Code, User, Save, ArrowLeft, Search, X, Briefcase, Link, ShieldAlert, FolderGit2, Target, Loader2, RotateCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Cấu hình URL cơ sở của Laravel API
const API_BASE_URL = 'http://localhost:8000/api';
const token = localStorage.getItem('token');

const INITIAL_EMPTY_FORM = {
  category_id: '',
  category_name_input: '', // Lưu tên tạm thời khi user tự gõ danh mục mới
  cv_template_id: 1,
  title: '',
  full_name: '',
  gender: 'Nam',
  birthday: '',
  email: '',
  phone: '',
  address: '',
  avatar: null,
  avatar_url: '',
  summary: '',
  objective: '',
  links: { github: '', linkedin: '' },
  experience_years: 0,
  education: '',
  project: [
    { project_name: '', role: '', duration: '', description: '' }
  ],
  contact_reference: { name: '', phone: '', relationship: '' },
  skills: []
};

const LEVEL_OPTIONS = ['Cơ bản', 'Khá', 'Trung bình', 'Thành thạo', 'Chuyên gia'];

export default function CreateCV() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [mode, setMode] = useState('create'); // 'create' hoặc 'edit'
  const [loading, setLoading] = useState(true);
  const [addingCategory, setAddingCategory] = useState(false); // Trạng thái loading khi bấm thêm category
  const [addingSkill, setAddingSkill] = useState(false);       // Trạng thái loading khi bấm thêm skill
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');
  const [cvData, setCvData] = useState(INITIAL_EMPTY_FORM);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [errors, setErrors] = useState({}); // Lưu trữ lỗi từ backend để hiển thị trên form

  // Dữ liệu danh mục và kỹ năng lấy từ API hệ thống
  const [systemCategories, setSystemCategories] = useState([]);
  const [systemSkills, setSystemSkills] = useState([]);

  // ================= TỰ ĐỘNG NẠP DỮ LIỆU KHI VÀO TRANG =================
  useEffect(() => {
    const initPageData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Chức năng này yêu cầu đăng nhập. Vui lòng đăng nhập tài khoản ứng viên để tiếp tục!");
        navigate('/');
      }
      try {
        setLoading(true);

        // 1. Nạp danh mục và kỹ năng hệ thống trước phục vụ việc hiển thị form
        const formDataRes = await axios.get(`${API_BASE_URL}/get-category`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json'
          }
        });
        if (formDataRes.data.success) {
          setSystemCategories(formDataRes.data.data.categories || []);
          setSystemSkills(formDataRes.data.data.skills || []);
        }

        // 2. Kiểm tra thông tin của Hồ sơ ứng viên
        try {
          const candidateRes = await axios.get(`${API_BASE_URL}/show-candidate`, {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Accept': 'application/json'
            }
          });

          if (candidateRes.data.success && candidateRes.data.data) {
            const backendData = candidateRes.data.data;
            const hasFilledForm = candidateRes.data.has_filled_form;

            const parsedLinks = typeof backendData.links === 'string' ? JSON.parse(backendData.links) : backendData.links;
            const parsedReference = typeof backendData.contact_reference === 'string' ? JSON.parse(backendData.contact_reference) : backendData.contact_reference;

            if (hasFilledForm) {
              if (id) {
                setMode('edit');

                const parsedProjects = typeof backendData.project === 'string' ? JSON.parse(backendData.project) : backendData.project;
                const matchedCategory = (formDataRes.data.data.categories || []).find(c => c.id === backendData.category_id);

                setCvData({
                  ...INITIAL_EMPTY_FORM,
                  ...backendData,
                  birthday: backendData.birthday ? backendData.birthday.substring(0, 10) : '',
                  category_id: backendData.category_id ? String(backendData.category_id) : '',
                  category_name_input: matchedCategory ? matchedCategory.name : '',
                  links: { ...INITIAL_EMPTY_FORM.links, ...parsedLinks },
                  contact_reference: { ...INITIAL_EMPTY_FORM.contact_reference, ...parsedReference },
                  project: parsedProjects?.length ? parsedProjects : INITIAL_EMPTY_FORM.project,
                  skills: backendData.skills ? backendData.skills.map(s => ({
                    id: s.id,
                    name: s.name,
                    level: s.pivot?.level || 'Cơ bản'
                  })) : []
                });

                if (backendData.avatar_url) {
                  setAvatarPreview(`http://localhost:8000/${backendData.avatar_url}`);
                }

              } else {
                setShowWarningModal(true);
                window.cachedBackendData = backendData;
              }

            } else {
              setMode('create');
              const matchedCategory = (formDataRes.data.data.categories || []).find(c => c.id === backendData.category_id);

              setCvData({
                ...INITIAL_EMPTY_FORM,
                full_name: backendData.full_name || '',
                email: backendData.email || '',
                phone: backendData.phone || '',
                address: backendData.address || '',
                gender: backendData.gender || 'Nam',
                birthday: backendData.birthday || '',
                category_id: backendData.category_id ? String(backendData.category_id) : '',
                category_name_input: matchedCategory ? matchedCategory.name : '',
                links: { ...INITIAL_EMPTY_FORM.links, ...parsedLinks },
                contact_reference: { ...INITIAL_EMPTY_FORM.contact_reference, ...parsedReference }
              });

              if (backendData.avatar_url) {
                setAvatarPreview(`http://localhost:8000/${backendData.avatar_url}`);
              }
            }
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra hồ sơ ứng viên:", error);
          alert("Hệ thống không thể kiểm tra trạng thái hồ sơ ứng viên!");
        }

      } catch (err) {
        console.error("Lỗi tải dữ liệu hệ thống:", err);
        alert("Không thể kết nối đến máy chủ Backend!");
      } finally {
        setLoading(false);
      }
    };

    initPageData();
  }, [id]);

  // HÀM TẠO MỚI CATEGORY QUA API RIÊNG
  const handleCreateCategory = async () => {
    const nameToCreate = cvData.category_name_input?.trim();
    if (!nameToCreate) {
      alert("Vui lòng nhập tên danh mục/ngành nghề cần thêm!");
      return;
    }

    try {
      setAddingCategory(true);
      const res = await axios.post(`${API_BASE_URL}/create-category`, { name: nameToCreate }, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        }
      });

      if (res.data && res.data.success) {
        const newCategory = res.data.data;
        // Cập nhật danh sách hệ thống để datalist ghi nhận
        setSystemCategories(prev => {
          if (prev.some(c => c.id === newCategory.id)) return prev;
          return [...prev, newCategory];
        });
        // Điền luôn ID và Tên mới vào Form hiện tại để chuẩn bị lưu CV
        setCvData(prev => ({
          ...prev,
          category_id: String(newCategory.id),
          category_name_input: newCategory.name
        }));
        alert(res.data.message || "Đã thêm danh mục mới vào hệ thống thành công!");
      } else {
        alert("Có lỗi xảy ra: " + (res.data?.message || "Không rõ nguyên nhân"));
      }
    } catch (error) {
      console.error("Lỗi thêm danh mục:", error);
      alert("Không thể tạo danh mục mới, vui lòng thử lại!");
    } finally {
      setAddingCategory(false);
    }
  };

  // HÀM TẠO MỚI SKILL QUA API RIÊNG (Đã sửa lỗi hiển thị nhưng không chọn được)
  const handleCreateSkill = async () => {
    const nameToCreate = skillSearch.trim();
    if (!nameToCreate) return;

    try {
      setAddingSkill(true);
      const res = await axios.post(`${API_BASE_URL}/create-skill`, { name: nameToCreate }, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        }
      });

      if (res.data && res.data.success) {
        const newSkill = res.data.data;

        // 1. Đưa kỹ năng mới vào bộ nhớ hệ thống chung
        setSystemSkills(prev => {
          if (prev.some(s => s.id === newSkill.id)) return prev;
          return [...prev, newSkill];
        });

        // 2. Can thiệp đồng bộ: Đút trực tiếp skill mới vào danh sách lựa chọn của ứng viên (cvData.skills)
        setCvData(prev => {
          const isExist = prev.skills.some(s => s.id === newSkill.id);
          if (isExist) return prev;
          return {
            ...prev,
            skills: [...prev.skills, { id: newSkill.id, name: newSkill.name, level: 'Cơ bản' }]
          };
        });

        // 3. Xóa ô tìm kiếm để đóng menu gợi ý
        setSkillSearch('');
        alert(res.data.message || "Đã thêm kỹ năng mới thành công!");
      } else {
        alert("Có lỗi xảy ra: " + (res.data?.message || "Không rõ nguyên nhân"));
      }
    } catch (error) {
      console.error("Lỗi thêm kỹ năng:", error);
      alert("Không thể tạo kỹ năng mới, vui lòng thử lại!");
    } finally {
      setAddingSkill(false);
    }
  };

  // ================= XỬ LÝ EVENT GIAO DIỆN KHÁC =================
  const handleAcceptEdit = () => {
    setShowWarningModal(false);
    setMode('edit');
    const backendData = window.cachedBackendData;
    if (backendData) {
      const parsedLinks = typeof backendData.links === 'string' ? JSON.parse(backendData.links) : backendData.links;
      const parsedReference = typeof backendData.contact_reference === 'string' ? JSON.parse(backendData.contact_reference) : backendData.contact_reference;
      const parsedProjects = typeof backendData.project === 'string' ? JSON.parse(backendData.project) : backendData.project;
      const matchedCategory = systemCategories.find(c => c.id === backendData.category_id);

      setCvData({
        ...INITIAL_EMPTY_FORM,
        ...backendData,
        category_id: backendData.category_id ? String(backendData.category_id) : '',
        category_name_input: matchedCategory ? matchedCategory.name : '',
        links: { ...INITIAL_EMPTY_FORM.links, ...parsedLinks },
        contact_reference: { ...INITIAL_EMPTY_FORM.contact_reference, ...parsedReference },
        project: parsedProjects?.length ? parsedProjects : INITIAL_EMPTY_FORM.project,
        skills: backendData.skills ? backendData.skills.map(s => ({
          id: s.id,
          name: s.name,
          level: s.pivot?.level || 'Cơ bản'
        })) : []
      });

      if (backendData.avatar_url) {
        setAvatarPreview(`http://localhost:8000/${backendData.avatar_url}`);
      }
    }
  };

  const handleResetAndCreateNew = async () => {
    if (window.confirm("Hành động này sẽ xóa toàn bộ kỹ năng, dự án và thông tin CV cũ trên hệ thống. Xác nhận làm lại từ đầu?")) {
      try {
        setLoading(true);
        setShowWarningModal(false);
        const deleteRes = await axios.delete(`${API_BASE_URL}/delete-candidate`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Accept': 'application/json' }
        });
        if (deleteRes.status === 200 || deleteRes.data?.success) {
          setMode('create');
          const defaultInfo = deleteRes.data.data || {};
          setCvData({
            ...INITIAL_EMPTY_FORM,
            full_name: defaultInfo.full_name || '',
            email: defaultInfo.email || '',
            phone: defaultInfo.phone || '',
            address: defaultInfo.address || '',
            gender: defaultInfo.gender || 'Nam',
            birthday: defaultInfo.birthday || '',
            avatar_url: defaultInfo.avatar_url || '',
          });
          setAvatarPreview(defaultInfo.avatar_url ? `http://localhost:8000/${defaultInfo.avatar_url}` : '');
          alert("Mời bạn tiến hành điền hồ sơ mới từ đầu!");
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
        alert("Không thể làm mới hồ sơ, thử lại sau!");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetFormToBasic = () => {
    if (window.confirm("Xóa sạch mục tiêu, giới thiệu, học vấn và kỹ năng hiện tại trên form?")) {
      setCvData(prev => ({
        ...INITIAL_EMPTY_FORM,
        full_name: prev.full_name, gender: prev.gender, birthday: prev.birthday ? prev.birthday.substring(0, 10) : '',
        email: prev.email, phone: prev.phone, address: prev.address, avatar: prev.avatar, avatar_url: prev.avatar_url,
        category_id: prev.category_id, category_name_input: prev.category_name_input, cv_template_id: prev.cv_template_id,
        links: prev.links, contact_reference: prev.contact_reference
      }));
      setSkillSearch('');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvData(prev => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setCvData(prev => ({ ...prev, [name]: value }));
  };

  // Đồng bộ ô nhập Category với danh sách gợi ý sẵn có
  const handleCategoryInputChange = (e) => {
    const val = e.target.value;
    const matchedCat = systemCategories.find(c => c.name.toLowerCase() === val.toLowerCase());
    setCvData(prev => ({
      ...prev,
      category_name_input: val,
      category_id: matchedCat ? String(matchedCat.id) : '' // Tự gõ từ mới thì ID tạm thời để rỗng để bắt sự kiện hiện nút Thêm mới
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setCvData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...cvData.project];
    updatedProjects[index][field] = value;
    setCvData(prev => ({ ...prev, project: updatedProjects }));
  };

  const handleAddProject = () => {
    setCvData(prev => ({ ...prev, project: [...prev.project, { project_name: '', role: '', duration: '', description: '' }] }));
  };

  const handleRemoveProject = (index) => {
    if (cvData.project.length > 1) {
      setCvData(prev => ({ ...prev, project: prev.project.filter((_, i) => i !== index) }));
    }
  };

  const handleAddSkill = (skillItem) => {
    const isExist = cvData.skills.some(s => s.id === skillItem.id);
    if (!isExist) {
      setCvData(prev => ({
        ...prev,
        skills: [...prev.skills, { id: skillItem.id, name: skillItem.name, level: 'Cơ bản' }]
      }));
    }
    setSkillSearch('');
  };

  const handleLevelChange = (skillId, newLevel) => {
    setCvData(prev => ({ ...prev, skills: prev.skills.map(s => s.id === skillId ? { ...s, level: newLevel } : s) }));
  };

  const handleRemoveSkill = (skillId) => {
    setCvData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== skillId) }));
  };

  const filteredSkillSuggestions = skillSearch.trim() === ''
    ? []
    : systemSkills.filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()));

  const exactSkillMatch = systemSkills.some(s => s.name.toLowerCase() === skillSearch.trim().toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvData.category_id) {
      alert("Vui lòng chọn danh mục từ gợi ý hoặc ấn nút 'Thêm mới danh mục' bên cạnh ô nhập!");
      return;
    }
    if (!cvData.skills || cvData.skills.length === 0) {
      alert("Vui lòng thêm ít nhất một kỹ năng chuyên môn!");
      return;
    }

    const formData = new FormData();
    formData.append('title', cvData.title || '');
    formData.append('category_id', cvData.category_id || '');
    formData.append('cv_template_id', cvData.cv_template_id || 1);
    formData.append('full_name', cvData.full_name || '');
    formData.append('gender', cvData.gender || 'Nam');
    formData.append('birthday', cvData.birthday || '');
    formData.append('phone', cvData.phone || '');
    formData.append('email', cvData.email || '');
    formData.append('address', cvData.address || '');
    formData.append('summary', cvData.summary || '');
    formData.append('objective', cvData.objective || '');
    formData.append('experience_years', cvData.experience_years || 0);
    formData.append('education', cvData.education || '');
    if (cvData.avatar) formData.append('avatar', cvData.avatar);
    formData.append('links', JSON.stringify(cvData.links || { github: '', linkedin: '' }));
    formData.append('contact_reference', JSON.stringify(cvData.contact_reference || { name: '', phone: '', relationship: '' }));
    formData.append('project', JSON.stringify(cvData.project || []));
    formData.append('skills', JSON.stringify(cvData.skills.map(s => ({ id: s.id, level: s.level || 'Cơ bản' }))));

    try {
      const response = await axios.post(`${API_BASE_URL}/save`, formData, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        alert(mode === 'edit' ? 'Cập nhật hồ sơ thành công!' : 'Tạo mới hồ sơ ứng viên thành công!');
        navigate('/cv-management');
      }
    } catch (error) {
      console.error("Error saving CV Profile:", error);

      // 5. Xử lý lỗi trả về từ Laravel Validation (Thường là mã 422 Unprocessable Entity)
      if (error.response && error.response.status === 422 && error.response.data.errors) {
        const backendErrors = error.response.data.errors;
        const formattedErrors = {};

        // Chuyển đổi cấu trúc lỗi từ Laravel (mảng thông báo) thành chuỗi đơn lẻ để hiển thị trên UI React
        Object.keys(backendErrors).forEach(key => {
          formattedErrors[key] = backendErrors[key][0]; // Lấy câu thông báo lỗi đầu tiên của trường đó
        });

        if (typeof setErrors === 'function') {
          setErrors(formattedErrors);
        }

        // Cuộn mượt lên trên để người dùng thấy hộp cảnh báo lỗi tổng quát
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Các trường hợp lỗi đường truyền, lỗi 500 mạng hỏng hoặc mất kết nối database
        alert("Đã xảy ra lỗi hệ thống khi lưu dữ liệu. Vui lòng thử lại hoặc liên hệ quản trị viên!");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-sm font-semibold text-slate-500">Đang đồng bộ dữ liệu hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* BANNER HEADER */}
          <div className="rounded-2xl p-6 text-slate-800 shadow-sm border border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {mode === 'edit' ? 'Cập nhật Thông tin Hồ sơ' : 'Khai báo Thông tin Hồ sơ Ứng viên'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">Chế độ hiện tại: <span className="font-bold uppercase text-blue-600">{mode === 'edit' ? 'Cập nhật' : 'Tạo mới'}</span></p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/cv-management')}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-sm transition shadow-sm"
            >
              <ArrowLeft size={16} /> Quay lại quản lý
            </button>
          </div>

          {/* HỘP THÔNG BÁO TỔNG HỢP LỖI NẾU CÓ */}
          {errors && Object.keys(errors).length > 0 && (
            <div className="flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-medium">
              <ShieldAlert size={18} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Thông tin chưa hợp lệ:</span>
                <p className="text-xs text-rose-600/90 mt-0.5">Vui lòng kiểm tra lại các trường thông tin được đánh dấu lỗi màu đỏ ở phía dưới.</p>
              </div>
            </div>
          )}

          <div className="space-y-6">

            {/* THÔNG TIN CÁ NHÂN & LIÊN HỆ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={20} /></div>
                <h2 className="text-lg font-bold text-slate-800">Thông tin cá nhân & Liên hệ</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:border-blue-400 transition relative w-full max-w-sm mx-auto h-fit">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100 mb-3" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-200 flex flex-col items-center justify-center text-slate-400 mb-3">
                      <Briefcase size={32} />
                    </div>
                  )}
                  <label className="cursor-pointer bg-white border border-slate-200 shadow-sm text-xs font-semibold px-4 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 transition block text-center w-full max-w-[180px]">
                    <span>Chọn file ảnh mới</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                  {/* Lỗi ảnh đại diện */}
                  {errors?.avatar && <p className="text-xs text-rose-500 font-medium mt-2 text-center">{errors.avatar}</p>}
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 bg-blue-50/40 p-3 rounded-xl border border-blue-100/70">
                    <label className="block text-xs font-bold text-blue-700 mb-1 flex items-center gap-1.5">
                      <Briefcase size={14} /> VỊ TRÍ ỨNG TUYỂN / TIÊU ĐỀ CV *
                    </label>
                    <input
                      required
                      type="text"
                      name="title"
                      value={cvData.title || ''}
                      onChange={handleBaseChange}
                      placeholder="VD: Lập trình viên Fullstack / Chuyên viên Thiết kế đồ họa..."
                      className={`w-full px-3 py-2 bg-white border ${errors?.title ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-100' : 'border-blue-200 focus:border-blue-500'} rounded-xl text-sm font-semibold outline-none placeholder-slate-400 transition`}
                    />
                    {/* Gợi ý lỗi Tiêu đề */}
                    {errors?.title && <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1"><span className="w-1 h-1 bg-rose-500 rounded-full"></span>{errors.title}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Ngành nghề ứng tuyển * {cvData.category_id ? <span className="text-emerald-600 font-bold">(Đã khớp ID: {cvData.category_id})</span> : <span className="text-amber-600 font-medium">(Ngành nghề mới)</span>}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          required
                          type="text"
                          name="category_name_input"
                          list="categories-datalist"
                          value={cvData.category_name_input || ''}
                          onChange={handleCategoryInputChange}
                          placeholder="Chọn từ danh sách hoặc tự gõ ngành nghề mới..."
                          className={`w-full px-3 py-2 border ${errors?.category_id ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'} rounded-xl text-sm bg-white outline-none`}
                        />
                        <datalist id="categories-datalist">
                          {systemCategories.map(cat => (
                            <option key={cat.id} value={cat.name} />
                          ))}
                        </datalist>
                      </div>

                      {!cvData.category_id && cvData.category_name_input?.trim() && (
                        <button
                          type="button"
                          disabled={addingCategory}
                          onClick={handleCreateCategory}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shrink-0 shadow-sm"
                        >
                          {addingCategory ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                          Thêm mới danh mục
                        </button>
                      )}
                    </div>
                    {/* Gợi ý lỗi Danh mục */}
                    {errors?.category_id && <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1"><span className="w-1 h-1 bg-rose-500 rounded-full"></span>{errors.category_id}</p>}
                  </div>

                  {/* Họ và tên */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Họ và tên *</label>
                    <input required type="text" name="full_name" value={cvData.full_name || ''} onChange={handleBaseChange} className={`w-full px-3 py-2 border ${errors?.full_name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200'} rounded-xl text-sm outline-none`} />
                    {errors?.full_name && <p className="text-xs text-rose-500 font-medium mt-1">{errors.full_name}</p>}
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Số điện thoại *</label>
                    <input required type="tel" name="phone" value={cvData.phone || ''} onChange={handleBaseChange} className={`w-full px-3 py-2 border ${errors?.phone ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200'} rounded-xl text-sm outline-none`} />
                    {errors?.phone && <p className="text-xs text-rose-500 font-medium mt-1">{errors.phone}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Email *</label>
                    <input required type="email" name="email" value={cvData.email || ''} onChange={handleBaseChange} className={`w-full px-3 py-2 border ${errors?.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200'} rounded-xl text-sm outline-none`} />
                    {errors?.email && <p className="text-xs text-rose-500 font-medium mt-1">{errors.email}</p>}
                  </div>

                  {/* Giới tính & Ngày sinh */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Giới tính</label>
                      <select name="gender" value={cvData.gender || 'Nam'} onChange={handleBaseChange} className="w-full px-3 py-2 border rounded-xl text-sm bg-white outline-none">
                        <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option>
                      </select>
                      {errors?.gender && <p className="text-xs text-rose-500 font-medium mt-1">{errors.gender}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Ngày sinh</label>
                      <input type="date" name="birthday" value={cvData.birthday || ''} onChange={handleBaseChange} className="w-full px-3 py-2 border rounded-xl text-sm outline-none" />
                      {errors?.birthday && <p className="text-xs text-rose-500 font-medium mt-1">{errors.birthday}</p>}
                    </div>
                  </div>

                  {/* Địa chỉ */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Địa chỉ cư trú</label>
                    <input type="text" name="address" value={cvData.address || ''} onChange={handleBaseChange} className="w-full px-3 py-2 border rounded-xl text-sm outline-none" />
                    {errors?.address && <p className="text-xs text-rose-500 font-medium mt-1">{errors.address}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* LIÊN KẾT & THAM CHIẾU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b text-indigo-600"><Link size={18} /> <h3 className="font-bold text-slate-800 text-base">Liên kết mạng xã hội</h3></div>
                <div className="space-y-3">
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1">GitHub</label><input type="url" value={cvData.links?.github || ''} onChange={(e) => handleNestedChange('links', 'github', e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none" /></div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1">LinkedIn</label><input type="url" value={cvData.links?.linkedin || ''} onChange={(e) => handleNestedChange('links', 'linkedin', e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none" /></div>
                  {errors?.links && <p className="text-xs text-rose-500 font-medium mt-1">{errors.links}</p>}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b text-rose-600"><ShieldAlert size={18} /> <h3 className="font-bold text-slate-800 text-base">Người tham chiếu</h3></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="block text-xs font-semibold text-slate-500 mb-1">Họ tên</label><input type="text" value={cvData.contact_reference?.name || ''} onChange={(e) => handleNestedChange('contact_reference', 'name', e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none" /></div>
                    <div><label className="block text-xs font-semibold text-slate-500 mb-1">Mối quan hệ</label><input type="text" value={cvData.contact_reference?.relationship || ''} onChange={(e) => handleNestedChange('contact_reference', 'relationship', e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none" /></div>
                  </div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1">Điện thoại</label><input type="tel" value={cvData.contact_reference?.phone || ''} onChange={(e) => handleNestedChange('contact_reference', 'phone', e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm outline-none" /></div>
                  {errors?.contact_reference && <p className="text-xs text-rose-500 font-medium mt-1">{errors.contact_reference}</p>}
                </div>
              </div>
            </div>

            {/* GIỚI THIỆU & MỤC TIÊU */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 pb-3 mb-3 border-b text-blue-600"><User size={18} /> <h3 className="font-bold text-slate-800 text-base">Giới thiệu bản thân *</h3></div>
                <textarea required rows="4" name="summary" value={cvData.summary || ''} onChange={handleBaseChange} className={`w-full px-3 py-2 border ${errors?.summary ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200'} rounded-xl text-sm resize-none outline-none`} placeholder="Tóm tắt ngắn gọn về kinh nghiệm, thế mạnh bản thân..." />
                {errors?.summary && <p className="text-xs text-rose-500 font-medium mt-1">{errors.summary}</p>}
              </div>
              <div>
                <div className="flex items-center gap-2 pb-3 mb-3 border-b text-emerald-600"><Target size={18} /> <h3 className="font-bold text-slate-800 text-base">Mục tiêu nghề nghiệp</h3></div>
                <textarea rows="4" name="objective" value={cvData.objective || ''} onChange={handleBaseChange} className={`w-full px-3 py-2 border ${errors?.objective ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200'} rounded-xl text-sm resize-none outline-none`} placeholder="Mục tiêu ngắn hạn và dài hạn trong sự nghiệp..." />
                {errors?.objective && <p className="text-xs text-rose-500 font-medium mt-1">{errors.objective}</p>}
              </div>
            </div>

            {/* HỌC VẤN */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2.5 pb-3 mb-3 border-b text-sky-600"><GraduationCap size={20} /><h2 className="text-base font-bold text-slate-800">Trình độ học vấn</h2></div>
              <textarea rows="4" name="education" value={cvData.education || ''} onChange={handleBaseChange} className={`w-full px-3 py-2 border ${errors?.education ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200'} rounded-xl text-sm resize-none outline-none`} placeholder="Thông tin trường học, ngành học, chứng chỉ..." />
              {errors?.education && <p className="text-xs text-rose-500 font-medium mt-1">{errors.education}</p>}
            </div>

            {/* DỰ ÁN THỰC TẾ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5 text-amber-600"><FolderGit2 size={20} /><h2 className="text-lg font-bold text-slate-800">Dự án Thực tế</h2></div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-500">Số năm KN:</label>
                  <input type="number" min="0" name="experience_years" value={cvData.experience_years || 0} onChange={handleBaseChange} className="w-16 px-2 py-1 border rounded-lg text-sm text-center outline-none" />
                </div>
              </div>
              {errors?.experience_years && <p className="text-xs text-rose-500 font-medium">{errors.experience_years}</p>}
              {errors?.project && <p className="text-xs text-rose-500 font-medium">{errors.project}</p>}

              <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2">
                {(cvData.project || []).map((item, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 relative space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">Dự án #{index + 1}</span>
                      {cvData.project?.length > 1 && (
                        <button type="button" onClick={() => handleRemoveProject(index)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div><label className="block text-[11px] font-semibold text-slate-500 mb-1">Tên dự án *</label><input required type="text" value={item.project_name || ''} onChange={(e) => handleProjectChange(index, 'project_name', e.target.value)} className="w-full px-3 py-2 bg-white border rounded-lg text-sm outline-none" /></div>
                      <div><label className="block text-[11px] font-semibold text-slate-500 mb-1">Vai trò *</label><input required type="text" value={item.role || ''} onChange={(e) => handleProjectChange(index, 'role', e.target.value)} className="w-full px-3 py-2 bg-white border rounded-lg text-sm outline-none" /></div>
                      <div><label className="block text-[11px] font-semibold text-slate-500 mb-1">Thời gian *</label><input required type="text" value={item.duration || ''} onChange={(e) => handleProjectChange(index, 'duration', e.target.value)} className="w-full px-3 py-2 bg-white border rounded-lg text-sm outline-none" /></div>
                    </div>
                    <div><label className="block text-[11px] font-semibold text-slate-500 mb-1">Mô tả chi tiết *</label><textarea required rows="3" value={item.description || ''} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs resize-none outline-none" /></div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={handleAddProject} className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-amber-500 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5"><Plus size={14} /> Thêm dự án</button>
            </div>

            {/* KỸ NĂNG CHUYÊN MÔN */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Code size={20} /></div>
                <h2 className="text-lg font-bold text-slate-800">Kỹ năng Chuyên môn & Cặp độ *</h2>
              </div>

              {/* Cảnh báo lỗi kĩ năng chung */}
              {errors?.skills && <p className="text-xs text-rose-500 font-bold p-2 bg-rose-50 rounded-lg flex items-center gap-1.5"><ShieldAlert size={14} /> {errors.skills}</p>}

              <div className="space-y-1.5 relative">
                <span className="text-xs font-bold text-blue-600 block">Bước 1: Tìm kiếm kỹ năng</span>
                <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus-within:bg-white transition gap-2">
                  <Search size={16} className="text-slate-400" />
                  <input type="text" value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)} placeholder="Nhập tên kỹ năng..." className="w-full bg-transparent outline-none text-sm text-slate-700" />
                </div>

                {/* MENU GỢI Ý SKILLS */}
                {skillSearch.trim() !== '' && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-56 overflow-y-auto divide-y">
                    {filteredSkillSuggestions.map((skill) => {
                      const isChosen = (cvData.skills || []).some(s => s.id === skill.id);
                      return (
                        <button key={skill.id} type="button" disabled={isChosen} onClick={() => handleAddSkill(skill)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex justify-between items-center">
                          <span className={isChosen ? 'text-slate-400' : 'text-slate-700 font-medium'}>{skill.name}</span>
                          {!isChosen && <span className="text-xs text-blue-600 font-bold">+ Chọn</span>}
                        </button>
                      );
                    })}

                    {!exactSkillMatch && (
                      <button
                        type="button"
                        disabled={addingSkill}
                        onClick={handleCreateSkill}
                        className="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 text-left text-xs font-bold text-purple-700 flex items-center justify-between transition"
                      >
                        <span className="flex items-center gap-1.5">
                          {addingSkill ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                          Không tìm thấy? Bấm để tự tạo kĩ năng mới: "{skillSearch}"
                        </span>
                        <span className="text-[10px] bg-purple-200 px-2 py-0.5 rounded text-purple-800">Tạo mới</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-500 block">Bước 2: Chọn cấp độ cho kỹ năng</span>
                {cvData.skills && cvData.skills.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cvData.skills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-sm font-bold text-slate-800">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <select value={skill.level || 'Cơ bản'} onChange={(e) => handleLevelChange(skill.id, e.target.value)} className="text-xs font-semibold bg-white border rounded-lg p-1.5 outline-none text-slate-700 shadow-sm">
                            {LEVEL_OPTIONS.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                          </select>
                          <button type="button" onClick={() => handleRemoveSkill(skill.id)} className="p-1 text-slate-400 hover:text-rose-600 rounded-md"><X size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed rounded-xl bg-slate-50/50"><p className="text-xs text-slate-400 italic">Chưa có kỹ năng nào được chọn (Bắt buộc).</p></div>
                )}
              </div>
            </div>

          </div>

          {/* ACTIONS FOOTER */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleResetFormToBasic}
              className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition duration-200"
            >
              <RotateCcw size={18} /> Làm mới form
            </button>

            <button type="submit" className={`inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow transition ${mode === 'edit' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              <Save size={18} /> {mode === 'edit' ? "Cập nhật hồ sơ" : "Lưu hồ sơ mới"}
            </button>
          </div>

        </form>
      </div>

      {/* WARNING MODAL */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Bạn đã khởi tạo hồ sơ CV!</h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                Hệ thống ghi nhận bạn đã hoàn thiện thông tin hồ sơ trực tuyến trước đó. Bạn muốn tiếp tục cập nhật dữ liệu hay xóa hẳn để làm mới?
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button type="button" onClick={handleAcceptEdit} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md">Tiếp tục Chỉnh sửa / Cập nhật hồ sơ cũ</button>
              <button type="button" onClick={handleResetAndCreateNew} className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-sm font-semibold">Xóa hồ sơ cũ &rarr; Tạo mới hoàn toàn</button>
              <button type="button" onClick={() => navigate('/cv-management')} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-medium">Hủy bỏ và Quay lại</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}