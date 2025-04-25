<template>
    <div class="tab-system">
      <!-- Tab navigation -->
      <div class="tab-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="{ 'active': activeTab === tab.id }"
          class="tab-button"
        >
          {{ tab.title }}
        </button>
      </div>
  
      <!-- Tab content -->
      <div class="tab-content">
        <div v-show="activeTab === 'intro'" class="tab-pane">
          <h2>Giới thiệu</h2>
          <p>Nội dung giới thiệu công ty/sản phẩm/dịch vụ...</p>
        </div>
        
        <div v-show="activeTab === 'info'" class="tab-pane">
          <h2>Thông tin</h2>
          <p>Thông tin chi tiết về sản phẩm/dịch vụ...</p>
        </div>
        
        <div v-show="activeTab === 'contact'" class="tab-pane">
          <h2>Liên hệ</h2>
          <p>Thông tin liên hệ: email, số điện thoại, địa chỉ...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activeTab: 'intro',
        tabs: [
          { id: 'intro', title: 'Giới thiệu' },
          { id: 'info', title: 'Thông tin' },
          { id: 'contact', title: 'Liên hệ' }
        ]
      };
    },
    // Nếu cần xử lý phức tạp hơn có thể dùng computed

  };
  </script>
  
  <style scoped>
  .tab-system {
    max-width: 800px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }
  
  .tab-nav {
    display: flex;
    border-bottom: 1px solid #ddd;
  }
  
  .tab-button {
    padding: 10px 20px;
    background: #f1f1f1;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 16px;
  }
  
  .tab-button:hover {
    background: #ddd;
  }
  
  .tab-button.active {
    background: #4CAF50;
    color: white;
    font-weight: bold;
  }
  
  .tab-content {
    padding: 20px;
    border: 1px solid #ddd;
    border-top: none;
  }
  
  .tab-pane {
    animation: fadeIn 0.5s;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  </style>