import React, { useState } from 'react'; // Bỏ chữ 'use' bị thừa để tránh lỗi
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Reset lại lỗi cũ trước khi bấm đăng nhập

    // Gọi API đăng nhập
    fetch('http://127.0.0.1:8000/api/login-admin', {
      method: 'POST',
      headers: {  
        'Content-Type': 'application/json',
        // Lúc đăng nhập thì chưa cần gửi Token kèm theo, nên có thể bỏ dòng Authorization ở đây
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
      // Kiểm tra nếu API trả về có cả token và thông tin user
      if (data.token && data.user) {
        
        // 1. Lưu token vào localStorage
        localStorage.setItem('token', data.token);
        
        // 2. LƯU THÊM USER OBJECT (Có chứa role) để thằng Layout.jsx đọc được
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // 3. Chuyển hướng đến trang Admin chính thức
        navigate('/admin/dashboard'); 
        
      } else {
        setError(data.message || 'Đăng nhập thất bại. Tài khoản không có quyền Admin.');
      }
    })
    .catch(error => {
      console.error('Lỗi khi đăng nhập:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Phần Hình ảnh minh họa (Chỉ hiện trên màn hình md trở lên) */}
        <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" // Đã thay bằng 1 cái ảnh demo nghệ thuật cho đẹp bài
            alt="Đăng nhập minh họa" 
            className="w-3/4 object-contain"
          />
        </div>

        {/* Phần Form Đăng nhập */}
        <div className="w-full p-8 md:w-1/2 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Chào mừng trở lại!</h2>
          
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-left">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email" // Sửa thành type="email" để trình duyệt tự check định dạng @ cho chuẩn
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="you@example.com"
                required // Thêm thuộc tính yêu cầu bắt buộc nhập
              />
            </div>
            
            <div className='text-left'>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="••••••••"
                required // Thêm thuộc tính yêu cầu bắt buộc nhập
              />
            </div>

            <div className="flex items-center justify-between">      
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Quên mật khẩu?</a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}