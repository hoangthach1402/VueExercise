import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        name: '',
        age: '',
        email: '',
        address: '',
        previousValues: {} , // Lưu giá trị cũ
        isLoggedIn: false 
    }),
    actions: {
        setField(field, value) {
            // Lưu giá trị cũ trước khi cập nhật
            this.previousValues[field] = this[field];
            // Cập nhật giá trị mới
            this[field] = value;
            // Log để kiểm tra
            console.log(`Field ${field} changed:`, {
                oldValue: this.previousValues[field],
                newValue: value
            });
        },
 
    }
    ,
    setCurrentStep(step){
        this.currentStep = step
    }
})