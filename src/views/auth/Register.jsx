import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, UserCheck, ShieldCheck } from 'lucide-react';
import AI_Nen from '../../assets/images/AI_Nen.png';

export default function RegisterPage() {
  // Toàn bộ State quản lý dữ liệu Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('candidate'); // Mặc định ban đầu chọn Ứng viên
  const [otpCode, setOtpCode] = useState('');
  
  // Quản lý các trạng thái UI
  const [step, setStep] = useState(1); // step 1: Điền thông tin, step 2: Nhập mã OTP
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // BƯỚC 1: Xử lý gửi thông tin Đăng ký & Gửi OTP về Mail
  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    
    // Kiểm tra nhanh phía client trước khi gửi lên API
    if (password !== passwordConfirmation) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);

    const registerData = { 
      email, 
      password, 
      password_confirmation: passwordConfirmation, 
      role 
    };

    axios.post('http://127.0.0.1:8000/api/register', registerData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      setLoading(false);
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setStep(2); // Chuyển sang giao diện điền mã OTP luôn
      }
    })
    .catch(err => {
      setLoading(false);
      if (err.response && err.response.data) {
        // Lấy đúng mảng lỗi validate từ Laravel hoặc thông báo lỗi
        if (err.response.data.errors) {
          const firstError = Object.values(err.response.data.errors)[0][0];
          setError(firstError);
        } else {
          setError(err.response.data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        }
      } else {
        setError('Kết nối máy chủ thất bại. Vui lòng kiểm tra lại backend Laravel.');
      }
    });
  };

  // BƯỚC 2: Xử lý gửi mã OTP lên xác thực kích hoạt tài khoản
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const otpData = { email, otp_code: otpCode };

    axios.post('http://127.0.0.1:8000/api/verify-otp', otpData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      setLoading(false);
      if (response.data.success) {
        
        // KIỂM TRA VAI TRÒ ĐỂ PHÂN LUỒNG SAU KHI XÁC THỰC THÀNH CÔNG
        if (role === 'employer') {
          alert('Kích hoạt tài khoản Nhà tuyển dụng thành công! Vui lòng hoàn thiện thông tin công ty.');
          
          // Chuyển hướng sang trang điền thông tin công ty, đính kèm email để backend xử lý liên kết
          navigate('/create-company', { state: { email: email } });
        } else {
          alert('Tài khoản Ứng viên của bạn đã kích hoạt thành công! Hãy đăng nhập nhé.');
          
          // Ứng viên thì quay về trang đăng nhập thông thường
          navigate('/login');
        }

      }
    })
    .catch(err => {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Mã OTP không hợp lệ.');
      } else {
        setError('Kết nối máy chủ thất bại.');
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden min-h-[550px]">

        {/* LỚP ĐỒ HỌA BÊN TRÁI: Tông xanh trắng giữ nguyên giống Login */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>

          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <span className="text-blue-600 font-black text-lg">J</span>
            </div>
            <span className="text-white font-bold text-lg tracking-wider">JOBPORTAL</span>
          </div>

          <div className="flex items-center justify-center my-auto relative z-10">
            <img src={AI_Nen} alt="Tuyển dụng thông minh" className="w-4/5 object-contain rounded-xl mix-blend-luminosity" />
          </div>

          <div className="text-white/90 relative z-10">
            <h3 className="text-xl font-bold mb-1">Cơ hội mới đang chờ đón bạn</h3>
            <p className="text-xs text-blue-100/80">Tham gia hệ thống để trải nghiệm công nghệ kết nối việc làm bằng AI thông minh.</p>
          </div>
        </div>

        {/* KHỐI FORM NHẬP LIỆU BÊN PHẢI */}
        <div className="w-full p-8 md:w-1/2 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">

            {/* Hộp thông báo lỗi động */}
            {error && (
              <div className="flex items-center gap-2 p-3.5 mb-5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Hộp thông báo thành công khi gửi xong OTP bước 1 */}
            {successMessage && step === 2 && (
              <div className="flex items-center gap-2 p-3.5 mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium">
                <ShieldCheck size={16} className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* GIAO DIỆN BƯỚC 1: ĐIỀN FORM ĐĂNG KÝ */}
            {step === 1 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Tạo tài khoản mới</h2>
                  <p className="text-slate-400 text-xs mt-1">Đăng ký tài khoản để bắt đầu hành trình tìm kiếm việc làm.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Ô nhập Email */}
                  <div className="space-y-1">
                    <label className="block text-left text-xs font-semibold text-slate-600">Địa chỉ Email</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <Mail size={16} className="text-slate-400" />
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="name@example.com" />
                    </div>
                  </div>

                  {/* Chọn Vai trò (Option Select) */}
                  <div className="space-y-1">
                    <label className="block text-left text-xs font-semibold text-slate-600">Bạn là ai?</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <UserCheck size={16} className="text-slate-400" />
                      <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-transparent outline-none text-sm text-slate-700 cursor-pointer">
                        <option value="candidate">Ứng viên tìm việc (Candidate)</option>
                        <option value="employer">Nhà tuyển dụng (Employer)</option>
                      </select>
                    </div>
                  </div>

                  {/* Ô nhập Mật khẩu */}
                  <div className="space-y-1">
                    <label className="block text-left text-xs font-semibold text-slate-600">Mật khẩu</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <Lock size={16} className="text-slate-400" />
                      <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="••••••••" />
                    </div>
                  </div>

                  {/* Ô nhập Xác nhận mật khẩu */}
                  <div className="space-y-1">
                    <label className="block text-left text-xs font-semibold text-slate-600">Xác nhận mật khẩu</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <Lock size={16} className="text-slate-400" />
                      <input required type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="••••••••" />
                    </div>
                  </div>

                  {/* Nút gửi form */}
                  <div className="pt-2">
                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition shadow-md shadow-blue-500/10">
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><span className="text-xs">Tiếp tục nhận mã OTP</span><ArrowRight size={16} /></>}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500">
                  Đã có tài khoản?{' '}
                  <a href="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">Đăng nhập</a>
                </div>
              </>
            )}

            {/* GIAO DIỆN BƯỚC 2: NHẬP MÃ OTP ĐỂ XÁC THỰC */}
            {step === 2 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Xác thực OTP</h2>
                  <p className="text-slate-400 text-xs mt-1">Hệ thống đã gửi một mã xác thực đến email <strong className="text-slate-600">{email}</strong>. Vui lòng nhập để hoàn tất kích hoạt tài khoản.</p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-left text-xs font-semibold text-slate-600">Mã OTP (6 chữ số)</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <ShieldCheck size={16} className="text-slate-400" />
                      <input required type="text" maxLength="6" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="w-full bg-transparent outline-none text-center font-bold text-lg tracking-[10px] text-slate-700" placeholder="000000" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 transition shadow-md shadow-emerald-500/10">
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><span className="text-xs">Xác thực & Kích hoạt tài khoản</span><ArrowRight size={16} /></>}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500">
                  Không nhận được mã?{' '}
                  <button onClick={() => setStep(1)} className="font-bold text-blue-600 hover:text-blue-700 hover:underline bg-transparent border-none cursor-pointer">Quay lại gửi lại</button>
                </div>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}