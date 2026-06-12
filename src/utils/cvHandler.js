import axios from 'axios';

/**
 * Hàm dùng chung để kích hoạt API xuất và tải CV dạng PDF từ Backend Laravel
 * @param {number|null} candidateId - Truyền ID ứng viên (nếu Nhà tuyển dụng/Admin xem), để trống nếu Ứng viên tự tải.
 * @param {function} [onLoadingChange] - Callback function tùy chọn để cập nhật trạng thái loading ở giao diện (true/false).
 * @param {function} [onError] - Callback function tùy chọn để truyền thông báo lỗi ra giao diện nếu gặp sự cố.
 */
export const handleDownloadAndSaveCV = async (candidateId = null, onLoadingChange = null, onError = null) => {
    // 1. Bật trạng thái loading ở giao diện (nếu bên giao diện có truyền hàm xử lý vào)
    if (onLoadingChange) onLoadingChange(true);
    if (onError) onError(null);

    try {
        // Tự động nhận diện URL: Nếu có ID thì gọi route xem hồ sơ, không có thì gọi route tự tải
        const url = candidateId 
            ? `http://localhost:8000/api/cv-management/download-cv/${candidateId}`
            : `http://localhost:8000/api/cv-management/download-cv`;

        // BẮT BUỘC: Đặt responseType là 'blob' để xử lý dòng dữ liệu nhị phân (Binary) của file PDF
        const response = await axios.get(url, {
            responseType: 'blob',
            headers: {
                // Đính kèm mã Token xác thực nếu hệ thống của bạn yêu cầu bảo mật đăng nhập
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });

        // 2. Chuyển đổi dữ liệu nhị phân trả về từ Laravel thành một đối tượng tệp (Blob) dạng PDF
        const file = new Blob([response.data], { type: 'application/pdf' });
        
        // 3. Tạo một đường dẫn URL tạm thời độc lập trên trình duyệt của client
        const fileURL = URL.createObjectURL(file);
        
        // 4. Mở một Tab mới tinh trên trình duyệt để hiển thị trực tiếp file CV PDF (Preview)
        window.open(fileURL, '_blank');

    } catch (err) {
        console.error("Lỗi hệ thống khi kết xuất CV:", err);
        if (onError) {
            onError('Có lỗi xảy ra trong quá trình xuất hoặc lưu trữ file PDF.');
        } else {
            alert('Có lỗi xảy ra trong quá trình xuất hoặc lưu trữ file PDF.');
        }
    } finally {
        // Tắt trạng thái loading ở giao diện khi đã xử lý xong (thành công hoặc thất bại)
        if (onLoadingChange) onLoadingChange(false);
    }
};