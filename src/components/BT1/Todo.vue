<template>
    <div class="todo-container">
        <h1>Todo List</h1>
        <div class="add-todo">
            <input 
                type="text" 
                :value="todoStore.currentInput"
                @input="updateInput"
                placeholder="Add a todo"
                class="todo-input"
                @keyup.enter="addTodo"
            >
            <button @click="addTodo" class="add-btn">Add</button>
        </div>
        <ul class="todo-list">
            <li v-for="todo in todoStore.todos" :key="todo.id" class="todo-item">
                <span :class="{ 'completed': todo.completed }">{{ todo.text }}</span>
                <div class="todo-actions">
                    <button @click="toggleTodo(todo)" class="action-btn">
                        {{ todo.completed ? 'Undo' : 'Complete' }}
                    </button>
                    <button @click="removeTodo(todo.id)" class="action-btn remove-btn">Remove</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useTodoStore } from '../stores/todoStore'
import { ref, watch } from 'vue'

const todoStore = useTodoStore()

const updateInput = (event) => {
    todoStore.setCurrentInput(event.target.value)
}

const addTodo = () => {
    if (todoStore.currentInput.trim()) {
        todoStore.add({
            id: Date.now(),
            text: todoStore.currentInput,
            completed: false
        })
    }
}

const removeTodo = (id) => {
    todoStore.remove(id)
}

const toggleTodo = (todo) => {
    todoStore.update({
        ...todo,
        completed: !todo.completed
    })
}
</script>

<style scoped>
.todo-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.add-todo {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.todo-input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.todo-input:focus {
    outline: none;
    border-color: #4CAF50;
}

.add-btn {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-btn:hover {
    background-color: #45a049;
}

.todo-list {
    list-style: none;
    padding: 0;
}

.todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: white;
}

.todo-actions {
    display: flex;
    gap: 10px;
}

.action-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.action-btn:hover {
    opacity: 0.8;
}

.remove-btn {
    background-color: #f44336;
    color: white;
}

.completed {
    text-decoration: line-through;
    color: #888;
}
</style>