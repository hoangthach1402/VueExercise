import { defineStore } from 'pinia'

export const useCountStore = defineStore('count', {
    state:()=>{
        return {
            count:0
        }
    },
    actions:{
        increment(){
            this.count++
        },
        decrement(){
            this.count--
        }
    }   
    
})

