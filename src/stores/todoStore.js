import { defineStore } from 'pinia';

export const useTodoStore = defineStore('todo', {
    state: () => ({
        todos: [],
        currentInput: ''
    }),
    actions: {
        add(todo) {
            this.todos.push(todo)
            this.currentInput = ''
        },
        remove(id) {
            const index = this.todos.findIndex(todo => todo.id === id)
            if (index !== -1) {
                this.todos.splice(index, 1)
            } else {
                console.error('Todo not found with id:', id)
            }
        },
        update(todo) {
            const index = this.todos.findIndex(t => t.id === todo.id)
            if(index !== -1){
                this.todos[index] = todo
            }
        },
        setCurrentInput(value) {
            this.currentInput = value
        }
    }
})

