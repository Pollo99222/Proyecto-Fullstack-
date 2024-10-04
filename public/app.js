// Lista de usuarios predefinidos
const usuarios = [
    { username: 'admin', password: 'admin' }
];

// Función para validar el inicio de sesión
function iniciarSesion(username, password) {
    return usuarios.some(user => user.username === username && user.password === password);
}

// Variables de autenticación
const authForm = document.getElementById('auth-form');
const authContainer = document.getElementById('auth-container');
const taskContainer = document.getElementById('task-container');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const logoutButton = document.getElementById('logout-button');

// Variables de tareas
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const descriptionInput = document.getElementById('description-input');
const pendingTasksList = document.getElementById('pending-tasks');
const completedTasksList = document.getElementById('completed-tasks');

// Función para cargar tareas del localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    pendingTasksList.innerHTML = '';
    completedTasksList.innerHTML = '';
    tasks.forEach(task => {
        if (task.completed) {
            addTaskToDOM(task, completedTasksList);
        } else {
            addTaskToDOM(task, pendingTasksList);
        }
    });
}

// Función para agregar una tarea al DOM
function addTaskToDOM(task, list) {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    li.innerHTML = `${task.text} - ${task.description} - Creada por: ${task.creator} - Fecha: ${task.date}`;

    // Botón de completar tarea
    const completeButton = document.createElement('button');
    completeButton.textContent = '✔';
    completeButton.classList.add('btn', 'btn-outline-success', 'btn-sm', 'me-2');
    completeButton.addEventListener('click', () => {
        completeTask(task.text);
    });

    // Botón de eliminar tarea
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '✖';
    deleteButton.classList.add('btn', 'btn-outline-danger', 'btn-sm');
    deleteButton.addEventListener('click', () => {
        deleteTask(task.text);
    });

    li.appendChild(completeButton);
    li.appendChild(deleteButton);
    list.appendChild(li);
}

// Función para marcar tarea como completada
function completeTask(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.text === taskText);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = true; // Cambiar estado a completado
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Guardar cambios en localStorage
        loadTasks(); // Recargar tareas
    }
}

// Función para eliminar una tarea
function deleteTask(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    loadTasks(); // Recargar tareas
}

// Evento para agregar nueva tarea
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskValue = taskInput.value.trim(); // Eliminar espacios en blanco
    const descriptionValue = descriptionInput.value.trim(); // Obtener descripción
    const creatorValue = usernameInput.value; // Obtener el creador (nombre de usuario)
    const dateValue = new Date().toLocaleString(); // Obtener la fecha de creación

    if (taskValue === '' || descriptionValue === '') {
        alert('La tarea y la descripción no pueden estar vacías.'); // Avisar si están vacías
        return;
    }

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (tasks.some(task => task.text === taskValue)) {
        alert('Esta tarea ya existe.'); // Avisar si la tarea ya existe
        return;
    }
    
    const newTask = { text: taskValue, description: descriptionValue, creator: creatorValue, date: dateValue, completed: false };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Guardar la nueva tarea
    addTaskToDOM(newTask, pendingTasksList); // Añadir la nueva tarea a la lista de pendientes
    taskInput.value = ''; // Limpiar el campo de entrada
    descriptionInput.value = ''; // Limpiar el campo de descripción
});

// Autenticación de usuario
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Validar las credenciales del usuario
    if (iniciarSesion(username, password)) {
        localStorage.setItem('username', username);
        authContainer.classList.add('d-none');
        taskContainer.classList.remove('d-none');
        loadTasks();
    } else {
        alert('Usuario o contraseña incorrectos. Intenta de nuevo.');
    }
});

// Cerrar sesión
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('username');
    authContainer.classList.remove('d-none');
    taskContainer.classList.add('d-none');
});

// Verificar si hay un usuario autenticado al cargar la página
if (localStorage.getItem('username')) {
    authContainer.classList.add('d-none');
    taskContainer.classList.remove('d-none');
    loadTasks();
}
