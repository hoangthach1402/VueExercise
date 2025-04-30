import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router'; // Import router để điều hướng

// Định nghĩa URL cơ sở cho API của bạn
const API_BASE_URL = 'https://laravelbackend-main-pfitfw.laravel.cloud/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null, // Lấy token từ localStorage nếu có
    user: JSON.parse(localStorage.getItem('authUser')) || null, // Lấy user từ localStorage nếu có
    loginError: null,
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token, // Kiểm tra xem người dùng đã đăng nhập chưa
    userName: (state) => state.user?.name || 'Guest', // Lấy tên người dùng, mặc định là Guest
  },
  actions: {
    /**
     * Xử lý đăng nhập người dùng.
     * @param {object} credentials - Thông tin đăng nhập (ví dụ: { email, password }).
     */
    async login(credentials) {
      this.isLoading = true;
      this.loginError = null;
      try {
        // Gửi yêu cầu POST đến API login
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);

        // Kiểm tra cấu trúc response và lấy token
        if (response.data && response.data.access_token) {
          this.token = response.data.access_token;
          localStorage.setItem('authToken', this.token); // Lưu token vào localStorage
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`; // Thiết lập header Authorization mặc định cho các request sau

          // Sau khi có token, gọi API để lấy thông tin người dùng
          await this.fetchUser();

          // Đăng nhập thành công, điều hướng đến trang chủ
          router.push('/'); // Hoặc route bạn muốn sau khi login thành công
        } else {
          // Xử lý trường hợp response không có access_token
          console.error('Login response missing access_token:', response.data);
          this.loginError = 'Định dạng phản hồi đăng nhập không hợp lệ.';
          this.clearAuthData(); // Xóa dữ liệu nếu có lỗi
        }
      } catch (error) {
        console.error('Login failed:', error.response || error.message);
        this.loginError = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        this.clearAuthData(); // Xóa dữ liệu nếu có lỗi
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Lấy thông tin người dùng từ API.
     */
    async fetchUser() {
      if (!this.token) return; // Không thực hiện nếu không có token

      this.isLoading = true;
      try {
        // Giả sử API endpoint để lấy thông tin user là /user
        // Bạn cần thay đổi endpoint này cho phù hợp với backend của bạn
        const response = await axios.get(`${API_BASE_URL}/user`); // Hoặc /profile, /me,...

        if (response.data) {
          this.user = response.data; // Lưu thông tin người dùng
          localStorage.setItem('authUser', JSON.stringify(this.user)); // Lưu user vào localStorage
        } else {
          console.error('Fetch user response missing data:', response.data);
          // Có thể logout nếu không lấy được thông tin user
          // this.logout();
        }
      } catch (error) {
        console.error('Failed to fetch user:', error.response || error.message);
        // Nếu lỗi (ví dụ: token hết hạn), thực hiện logout
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.logout();
        }
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Xử lý đăng xuất người dùng.
     */
    logout() {
      // Gọi API logout của backend nếu có (tùy chọn)
      // Ví dụ: await axios.post(`${API_BASE_URL}/logout`);

      this.clearAuthData();
      router.push('/login'); // Điều hướng về trang login
    },

    /**
     * Xóa dữ liệu xác thực khỏi state và localStorage.
     */
    clearAuthData() {
        this.token = null;
        this.user = null;
        this.loginError = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        delete axios.defaults.headers.common['Authorization']; // Xóa header Authorization
    },

    /**
     * Kiểm tra và khôi phục trạng thái đăng nhập khi tải ứng dụng.
     */
    async checkAuth() {
        if (this.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            // Nếu có token, thử fetch lại thông tin user để đảm bảo token còn hợp lệ
            await this.fetchUser();
        }
    }
  },
});