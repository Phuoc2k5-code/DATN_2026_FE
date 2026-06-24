import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import AI_Nen from '../../assets/images/AI_Nen.png'; // Sử dụng lại ảnh nền giống trang Register

export default function ForgotPasswordPage() {
  // Quản lý dữ liệu Form
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // Quản lý trạng thái UI
  const [step, setStep] = useState(1); // step 1: Nhập Email, step 2: Nhập OTP, step 3: Đổi Password mới
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // BƯỚC 1: Gọi API gửi mã OTP về Email
  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    axios.post('http://127.0.0.1:8000/api/forgot-password/send-otp', { email }, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })
    .then(response => {
      setLoading(false);
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setStep(2); // Chuyển sang giao diện điền mã OTP
      }
    })
    .catch(err => {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Gửi OTP thất bại. Vui lòng thử lại.');
      } else {
        setError('Kết nối máy chủ thất bại. Vui lòng kiểm tra lại backend.');
      }
    });
  };

  // BƯỚC 2: Gọi API kiểm tra mã OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    axios.post('http://127.0.0.1:8000/api/forgot-password/verify-otp', { email, otp_code: otpCode }, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })
    .then(response => {
      setLoading(false);
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setStep(3); // Chuyển sang giao diện đổi mật khẩu mới
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

  // BƯỚC 3: Gọi API đặt lại Mật khẩu mới
  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Mật khẩu nhập lại không trùng khớp.');
      return;
    }

    setLoading(true);

    const resetData = {
      email,
      password,
      password_confirmation: passwordConfirmation
    };

    axios.post('http://127.0.0.1:8000/api/forgot-password/reset', resetData, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })
    .then(response => {
      setLoading(false);
      if (response.data.success) {
        alert('Cập nhật mật khẩu mới thành công! Bạn có thể đăng nhập ngay bây giờ.');
        navigate('/login'); // Chuyển hướng về trang đăng nhập
      }
    })
    .catch(err => {
      setLoading(false);
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          const firstError = Object.values(err.response.data.errors)[0][0];
          setError(firstError);
        } else {
          setError(err.response.data.message || 'Đổi mật khẩu thất bại.');
        }
      } else {
        setError('Kết nối máy chủ thất bại.');
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden min-h-[550px]">

        {/* LỚP ĐỒ HỌA BÊN TRÁI (Giữ nguyên đồng bộ với Đăng Ký / Đăng Nhập) */}
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
            <h3 className="text-xl font-bold mb-1">Khôi phục quyền truy cập</h3>
            <p className="text-xs text-blue-100/80">Hệ thống bảo mật thông minh giúp bảo vệ tài khoản của bạn mọi lúc.</p>
          </div>
        </div>

        {/* KHỐI FORM NHẬP LIỆU BÊN PHẢI */}
        <div className="w-full p-8 md:w-1/2 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">

            {/* Hiển thị lỗi động */}
            {error && (
              <div className="flex items-center gap-2 p-3.5 mb-5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Hiển thị thông báo thành công */}
            {successMessage && (
              <div className="flex items-center gap-2 p-3.5 mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium">
                <ShieldCheck size={16} className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* GIAO DIỆN BƯỚC 1: NHẬP EMAIL */}
            {step === 1 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Quên mật khẩu?</h2>
                  <p className="text-slate-400 text-xs mt-1">Đừng lo lắng! Vui lòng cung cấp Email đăng ký, chúng tôi sẽ gửi mã OTP khôi phục lại.</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-left text-xs font-semibold text-slate-600">Địa chỉ Email</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <Mail size={16} className="text-slate-400" />
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="0306...@caothang.edu.vn" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition shadow-md shadow-blue-500/10">
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><span className="text-xs">Gửi mã OTP khôi phục</span><ArrowRight size={16} /></>}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* GIAO DIỆN BƯỚC 2: XÁC THỰC MÃ OTP */}
            {step === 2 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Xác thực mã OTP</h2>
                  <p className="text-slate-400 text-xs mt-1">Vui lòng kiểm tra hộp thư của <strong className="text-slate-600">{email}</strong> và nhập mã xác thực gồm 6 chữ số vào ô bên dưới.</p>
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
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><span className="text-xs">Xác thực mã OTP</span><ArrowRight size={16} /></>}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* GIAO DIỆN BƯỚC 3: ĐẶT LẠI MẬT KHẨU MỚI */}
            {step === 3 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Đặt lại mật khẩu</h2>
                  <p className="text-slate-400 text-xs mt-1">Mã OTP hợp lệ! Hãy thiết lập mật khẩu bảo mật mới cho tài khoản của bạn.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-left text-xs font-semibold text-slate-600">Mật khẩu mới</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <Lock size={16} className="text-slate-400" />
                      <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="••••••••" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-left text-xs font-semibold text-slate-600">Xác nhận mật khẩu mới</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <Lock size={16} className="text-slate-400" />
                      <input required type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="w-full bg-transparent outline-none text-sm text-slate-700" placeholder="••••••••" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition shadow-md shadow-blue-500/10">
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><span className="text-xs">Đổi mật khẩu & Đăng nhập</span><ArrowRight size={16} /></>}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* FOOTER ĐIỀU HƯỚNG QUAY LẠI */}
            <div className="mt-6 text-center text-xs text-slate-500 flex justify-center items-center gap-1">
              <ArrowLeft size={14} className="text-slate-400" />
              Quay lại trang{' '}
              <a href="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">Đăng nhập</a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}