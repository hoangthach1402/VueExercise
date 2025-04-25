import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', {
  state: () => ({
    showStatus: false,
    userName: ''
  }),
  actions: {
    showLoginStatus(name) {
      this.userName = name;
      this.showStatus = true;
      setTimeout(() => {
        this.showStatus = false;
      }, 3000);
    }
  }
});