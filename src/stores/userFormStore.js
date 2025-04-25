import { defineStore } from 'pinia'

export const useUserFormStore = defineStore('userForm',{
    state:()=>{
        return {
            currentStep:1,
            name:'',
            age:'',
            email:'',
            address:''
        }
    },
    actions:{       
        nextStep(){
            if(this.currentStep < 4){
                this.currentStep++  
                console.log(this.name)
            }
        },
        prevStep(){
            if(this.currentStep > 1){
                this.currentStep--
            }
        },
        setCurrentStep(step) {
            if (step >= 1 && step <= 4) {
                this.currentStep = step
            }
        },
        handleInput(field,value){
            this[field] = value
        },
        reset(){
            this.currentStep = 1
            this.name = ''
            this.age = ''
            this.email = ''
            this.address = ''
            localStorage.removeItem('userForm')
        }
    }

})