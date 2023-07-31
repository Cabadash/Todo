'use strict';

const form = document.querySelector('#form');
const input = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);

taskList.addEventListener('click', delTask);

taskList.addEventListener('click', doneTask);

function doneTask(e) {
    if (e.target.dataset.action !== 'done') return;
    
    const parentNode = e.target.closest('.list-group-item');
    const id = +parentNode.id;
    const task = tasks.find(item => item.id === id);
    
    task.done = !task.done;
    
    saveLocalStorage();
    
    const statusTask = parentNode.querySelector('.task-title');
    
    statusTask.classList.toggle('task-title--done');
}

function delTask(e) {
    if (e.target.dataset.action !== 'delete') return;
    
    const parentNode = e.target.closest('.list-group-item');
    
    const id = +parentNode.id;
    
    const index = tasks.findIndex(item => item.id === id);
    
    tasks.splice(index, 1);
    
    checkEmptyList();
    
    saveLocalStorage();
    
    parentNode.remove();
}

function addTask(e) {
    e.preventDefault();
    
    const textTask = input.value;
    
    const newTask = {
        id: Date.now(),
        text: textTask,
        done: false,
    };
    
    tasks.push(newTask);
    
    checkEmptyList();
    
    renderTask(newTask);
    
    saveLocalStorage();
    
    input.value = '';
    input.focus();
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyHTML = `
        <li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">Список дел пуст</div>
        </li>`;
        
        taskList.insertAdjacentHTML('afterbegin', emptyHTML);
    } 
    
    if (tasks.length > 0) {
        const empty = document.querySelector('#emptyList');
        
        empty ? empty.remove() : null;
    }
}

function renderTask(task) {
    let taskStatus = (task.done) ? 'task-title task-title--done' : 'task-title';
    
    const taskHTML = `
        <li class="list-group-item d-flex justify-content-between task-item" id='${task.id}'>
            <span class="${taskStatus}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>`;
        
    taskList.insertAdjacentHTML('beforeend', taskHTML);
}

function saveLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}