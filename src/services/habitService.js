import axios from 'axios';

// Định nghĩa URL cơ sở cho API
const API_BASE_URL = 'https://laravelbackend-main-pfitfw.laravel.cloud/api';

/**
 * Service quản lý các API calls liên quan đến thói quen
 */
const habitService = {
  /**
   * Lấy danh sách tất cả thói quen
   * @returns {Promise} Promise chứa danh sách thói quen
   */
  getAllHabits: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/habits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching habits:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết của một thói quen
   * @param {string|number} id - ID của thói quen
   * @returns {Promise} Promise chứa thông tin thói quen
   */
  getHabitById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/habits/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching habit ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tạo thói quen mới
   * @param {Object} habitData - Dữ liệu thói quen mới
   * @returns {Promise} Promise chứa thông tin thói quen đã tạo
   */
  createHabit: async (habitData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/habits`, habitData);
      return response.data;
    } catch (error) {
      console.error('Error creating habit:', error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin thói quen
   * @param {string|number} id - ID của thói quen
   * @param {Object} habitData - Dữ liệu cập nhật
   * @returns {Promise} Promise chứa thông tin thói quen đã cập nhật
   */
  updateHabit: async (id, habitData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/habits/${id}`, habitData);
      return response.data;
    } catch (error) {
      console.error(`Error updating habit ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa thói quen
   * @param {string|number} id - ID của thói quen
   * @returns {Promise} Promise chứa kết quả xóa
   */
  deleteHabit: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/habits/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting habit ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lấy tiến độ của một thói quen
   * @param {string|number} id - ID của thói quen
   * @returns {Promise} Promise chứa thông tin tiến độ
   */
  getHabitProgress: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/habits/${id}/progress`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress for habit ${id}:`, error);
      throw error;
    }
  },

  /**
   * Đánh dấu tiến độ cho một thói quen (check/uncheck ngày)
   * @param {string|number} id - ID của thói quen
   * @param {Object} progressData - Dữ liệu tiến độ (ngày đánh dấu)
   * @returns {Promise} Promise chứa kết quả cập nhật tiến độ
   */
  markProgress: async (id, progressData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/habits/${id}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error(`Error marking progress for habit ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa tiến độ của một ngày cụ thể
   * @param {string|number} id - ID của thói quen
   * @param {string} date - Ngày cần xóa tiến độ (định dạng YYYY-MM-DD)
   * @returns {Promise} Promise chứa kết quả xóa tiến độ
   */
  deleteProgress: async (id, date) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/habits/${id}/progress/${date}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting progress for habit ${id} on date ${date}:`, error);
      throw error;
    }
  },

  /**
   * Lấy danh sách thành tựu
   * @returns {Promise} Promise chứa danh sách thành tựu
   */
  getAchievements: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/achievements`);
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  }
};

export default habitService;