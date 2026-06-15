import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Chèn Interceptor để TỰ ĐỘNG đính kèm token vào TẤT CẢ các API gửi đi
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Hoặc nơi bạn lưu token khi đăng nhập thành công
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const toggleSaveJob = async (jobId) => {
  const response = await api.post(`save-job/${jobId}`); // Chỉnh lại đúng route của bạn
  return response.data;
};

