import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import AI_Nen from '../../assets/images/AI_Nen.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Cấu hình data gửi đi
    const loginData = { email, password };

    // Gọi API bằng axios sạch sẽ
    axios.post('http://127.0.0.1:8000/api/login-user', loginData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json' // Ép Laravel luôn phản hồi dạng JSON, không trả về HTML bậy bạ
      }
    })
      .then(response => {
        setLoading(false);
        const data = response.data;

        if (data.token) {
          // Lưu thông tin vào localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          // Điều hướng thông minh dựa vào vai trò phân quyền
          if (data.user.role === 'candidate') {
            navigate('/');
          } else if (data.user.role === 'employer') {
            navigate('/employer');
          } else {
            setError('Vai trò người dùng không hợp lệ trên hệ thống.');
          }
        }
      })
      .catch(err => {
        setLoading(false);
        console.error('Lỗi khi đăng nhập:', err);

        // 💡 AXIOS CỨU CÁNH: Lấy đúng nội dung lỗi từ Backend Laravel trả về
        if (err.response && err.response.data) {
          setError(err.response.data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } else {
          setError('Kết nối máy chủ thất bại. Vui lòng kiểm tra lại backend Laravel.');
        }
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden min-h-[550px]">

        {/* LỚP ĐỒ HỌA BÊN TRÁI: Tông xanh trắng hiện đại (Chỉ hiển thị từ màn hình md) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-10 flex-col justify-between relative overflow-hidden">
          {/* Các vòng tròn trang trí mờ tạo chiều sâu */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>

          {/* Logo / Tên hệ thống */}
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <span className="text-blue-600 font-black text-lg">J</span>
            </div>
            <span className="text-white font-bold text-lg tracking-wider">JOBPORTAL</span>
          </div>

          {/* Hình ảnh minh họa vector không gian làm việc chuyên nghiệp */}
          <div className="flex items-center justify-center my-auto relative z-10">
            <img
              src={AI_Nen}
              alt="Tuyển dụng thông minh"
              className="w-4/5 object-contain rounded-xl mix-blend-luminosity"
            />
          </div>

          {/* Slogan thương hiệu */}
          <div className="text-white/90 relative z-10">
            <h3 className="text-xl font-bold mb-1">Kết nối sự nghiệp tương lai</h3>
            <p className="text-xs text-blue-100/80">Hệ thống hỗ trợ tạo CV và tối ưu hóa kết nối ứng viên bằng công nghệ số.</p>
          </div>
        </div>

        {/* KHỐI FORM NHẬP LIỆU BÊN PHẢI: Tông trắng tinh tế */}
        <div className="w-full p-8 md:w-1/2 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">

            {/* Tiêu đề chào mừng */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Chào mừng bạn trở lại!</h2>
              <p className="text-slate-400 text-xs mt-1">Vui lòng đăng nhập tài khoản để tiếp tục truy cập hệ thống.</p>
            </div>

            {/* Hộp thông báo lỗi động */}
            {error && (
              <div className="flex items-center gap-2 p-3.5 mb-5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium animate-shake">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form xử lý thông tin */}
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Ô nhập Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-left text-xs font-semibold text-slate-600">Địa chỉ Email</label>
                <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition duration-200">
                  <Mail size={16} className="text-slate-400" />
                  <input
                    required
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Ô nhập Mật khẩu */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-600">Mật khẩu</label>
                  <a href="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">Quên mật khẩu?</a>
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition duration-200">
                  <Lock size={16} className="text-slate-400" />
                  <input
                    required
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Nút Đăng nhập với trạng thái loading */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 active:transform active:scale-[0.99] transition shadow-md shadow-blue-500/10"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Đăng nhập hệ thống</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Chuyển hướng đăng ký hồ sơ */}
            <div className="mt-8 text-center text-xs text-slate-500">
              Bạn chưa có tài khoản thành viên?{' '}
              <a href="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition">
                Đăng ký ngay
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}