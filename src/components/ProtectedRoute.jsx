import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Thêm prop allowedRoles để nhận vào mảng các quyền hợp lệ (ví dụ: ['employer'], ['candidate'])
const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token'); 
    const userString = localStorage.getItem('user'); 
    const user = userString ? JSON.parse(userString) : null;

    // 1. Kiểm tra xem đã đăng nhập (có token) chưa
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Kiểm tra phân quyền (Role) nếu Route đó yêu cầu role cụ thể
    // Nếu có truyền allowedRoles VÀ role của user hiện tại không nằm trong danh sách được phép
    if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
        alert("Tài khoản của bạn không có quyền truy cập vào khu vực này!");
        
        // Đá người dùng về trang tương ứng với quyền của họ để tránh bị kẹt
        if (user?.role === 'employer') return <Navigate to="/employer" replace />;
        if (user?.role === 'admin') return <Navigate to="/admin" replace />;
        return <Navigate to="/" replace />; // Mặc định về trang chủ
    }

    // 3. Hợp lệ hoàn toàn thì cho đi tiếp
    return <Outlet />;
};

export default ProtectedRoute;