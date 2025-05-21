let tasks = [];

// Theme toggle + task loading
document.addEventListener("DOMContentLoaded", () => {
    // Load stored tasks
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = storedTasks;
        updateTaskList();
        updateStats();
    }

    // Apply stored theme
    const storedTheme = localStorage.getItem("theme");
    const body = document.body;
    const toggleBtn = document.getElementById("themeToggle");

    if (storedTheme === "light") {
        body.classList.add("light");
        toggleBtn.innerText = "🌞";
    } else {
        toggleBtn.innerText = "🌙";
    }

    // Toggle theme on button click
    toggleBtn.addEventListener("click", () => {
        body.classList.toggle("light");
        const isLight = body.classList.contains("light");
        localStorage.setItem("theme", isLight ? "light" : "dark");
        toggleBtn.innerText = isLight ? "🌞" : "🌙";
    });
});

// Save tasks
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Add a task
const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const text = taskInput.value.trim();
    const priority = priorityInput.value;

    if (text) {
        tasks.push({
            text,
            completed: false,
            priority
        });
        taskInput.value = '';
        priorityInput.value = 'low';
        updateTaskList();
        updateStats();
        saveTasks();
    }
};

// Toggle task completion
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    updateStats();
    saveTasks();
};

// Delete task
const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

// Edit task
const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    taskInput.value = tasks[index].text;
    priorityInput.value = tasks[index].priority || 'low';

    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

// Update stats
const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completeTasks / totalTasks) * 100 : 0;

    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById('numbers').innerHTML = `${completeTasks}/${totalTasks}`;

    if (tasks.length && completeTasks === totalTasks) {
        blaskConfetti();
    }
};

// Render task list
const updateTaskList = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} />
                    <p>${task.text}</p>
                </div>
                <div class="priority-badge priority-${task.priority}">${task.priority}</div>
                <div class="icons">
                    <img src="./images/edit.png" alt="edit_icon" onclick="editTask(${index})" />
                    <img src="./images/bin.png" alt="delete_icon" onclick="deleteTask(${index})">
                </div>
            </div>
        `;

        listItem.querySelector('input[type="checkbox"]').addEventListener("change", () => toggleTaskComplete(index));
        taskList.appendChild(listItem);
    });
};

// Add task button
document.getElementById("newTask").addEventListener('click', function (e) {
    e.preventDefault();
    addTask();
});

// Confetti on all tasks complete
const blaskConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};
