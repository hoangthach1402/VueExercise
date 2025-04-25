import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    sentences: [
      { eng: "Hello world", vietnamese: "Xin chào thế giới" },
      { eng: "How are you today?", vietnamese: "Hôm nay bạn thế nào?" },
      { eng: "I am learning English", vietnamese: "Tôi đang học tiếng Anh" },
      { eng: "This is a great application", vietnamese: "Đây là một ứng dụng tuyệt vời" },
      { eng: "Practice makes perfect", vietnamese: "Thực hành tạo nên sự hoàn hảo" },
      { eng: "I love learning languages", vietnamese: "Tôi thích học ngôn ngữ" },
      { eng: "The weather is nice today", vietnamese: "Thời tiết hôm nay đẹp" },
      { eng: "What time is it?", vietnamese: "Bây giờ là mấy giờ?" },
      { eng: "Where is the library?", vietnamese: "Thư viện ở đâu?" },
      { eng: "Can you help me please?", vietnamese: "Bạn có thể giúp tôi được không?" }
    ],
    currentMode: 'readVietnameseTypeEnglish',
    currentDifficulty: 'easy',
    currentSentenceIndex: 0,
    userStats: {
      correctAnswers: 0,
      totalAttempts: 0
    }
  }),
  
  getters: {
    currentSentence: (state) => state.sentences[state.currentSentenceIndex],
    progressPercentage: (state) => {
      if (state.userStats.totalAttempts === 0) return 0;
      return Math.round((state.userStats.correctAnswers / state.userStats.totalAttempts) * 100);
    }
  },
  
  actions: {
    setMode(mode) {
      this.currentMode = mode;
    },
    setDifficulty(difficulty) {
      this.currentDifficulty = difficulty;
    },
    nextSentence() {
      this.currentSentenceIndex = (this.currentSentenceIndex + 1) % this.sentences.length;
    },
    recordAttempt(isCorrect) {
      this.userStats.totalAttempts++;
      if (isCorrect) {
        this.userStats.correctAnswers++;
      }
    },
    resetStats() {
      this.userStats.correctAnswers = 0;
      this.userStats.totalAttempts = 0;
    },
    // Thêm câu mới vào kho dữ liệu
    addSentence(engText, vietnameseText) {
      this.sentences.push({
        eng: engText,
        vietnamese: vietnameseText
      });
    }
  }
});