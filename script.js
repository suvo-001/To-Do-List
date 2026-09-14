/* =========================================
   TASKFLOW TODO APPLICATION
========================================= */


/* ===============================
   ELEMENTS
================================= */

const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");

const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

const userEmail = document.getElementById("userEmail");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const priority = document.getElementById("priority");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const filterButtons =
    document.querySelectorAll(".filter");


/* ===============================
   DATA
================================= */

let tasks = JSON.parse(
    localStorage.getItem("taskflowTasks")
) || [];

let currentFilter = "all";


/* ===============================
   LOGIN
================================= */

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();


    if (!email || !password) {

        alert("Please enter email and password.");

        return;
    }


    localStorage.setItem(
        "taskflowLoggedIn",
        "true"
    );

    localStorage.setItem(
        "taskflowUser",
        email
    );


    showApp();

});


/* ===============================
   SHOW APP
================================= */

function showApp() {

    const email =
        localStorage.getItem("taskflowUser");

    userEmail.textContent =
        email || "user@example.com";

    loginPage.classList.add("hidden");

    appPage.classList.remove("hidden");

    renderTasks();

}


/* ===============================
   LOGOUT
================================= */

logoutBtn.addEventListener("click", function() {

    localStorage.removeItem(
        "taskflowLoggedIn"
    );

    localStorage.removeItem(
        "taskflowUser"
    );


    appPage.classList.add("hidden");

    loginPage.classList.remove("hidden");

    loginForm.reset();

});


/* ===============================
   ADD TASK
================================= */

taskForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const title =
            taskInput.value.trim();

        const date =
            taskDate.value;

        const taskPriority =
            priority.value;


        if (!title || !date) {

            alert("Please enter task and date.");

            return;
        }


        const newTask = {

            id: Date.now(),

            title: title,

            date: date,

            priority: taskPriority,

            completed: false

        };


        tasks.push(newTask);


        saveTasks();

        renderTasks();


        taskForm.reset();


        priority.value = "Medium";

    }
);


/* ===============================
   SAVE TASKS
================================= */

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


/* ===============================
   RENDER TASKS
================================= */

function renderTasks() {

    taskList.innerHTML = "";


    let filteredTasks = tasks.filter(
        function(task) {

            if (currentFilter === "pending") {

                return !task.completed;

            }


            if (currentFilter === "completed") {

                return task.completed;

            }


            return true;

        }
    );


    /* Sort by date */

    filteredTasks.sort(
        function(a, b) {

            return new Date(a.date)
                - new Date(b.date);

        }
    );


    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    filteredTasks.forEach(
        function(task) {

            const taskElement =
                document.createElement("div");


            taskElement.className =
                "task-item";


            if (task.completed) {

                taskElement.classList.add(
                    "completed"
                );

            }


            taskElement.innerHTML = `

                <input
                    type="checkbox"
                    class="check-task"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <div class="task-content">

                    <h4>
                        ${escapeHTML(task.title)}
                    </h4>

                    <p>
                        📅 ${formatDate(task.date)}
                    </p>

                </div>

                <div class="task-actions">

                    <span class="priority ${task.priority}">
                        ${task.priority}
                    </span>

                    <button
                        class="delete-btn"
                        onclick="deleteTask(${task.id})"
                        title="Delete task"
                    >
                        🗑
                    </button>

                </div>

            `;


            taskList.appendChild(
                taskElement
            );

        }
    );


    updateStatistics();

}


/* ===============================
   TOGGLE TASK
================================= */

function toggleTask(id) {

    const task =
        tasks.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveTasks();

    renderTasks();

}


/* ===============================
   DELETE TASK
================================= */

function deleteTask(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) return;


    tasks =
        tasks.filter(
            function(task) {

                return task.id !== id;

            }
        );


    saveTasks();

    renderTasks();

}


/* ===============================
   FILTERS
================================= */

filterButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                filterButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    }
);


/* ===============================
   STATISTICS
================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function(task) {

                return task.completed;

            }
        ).length;


    const pending =
        total - completed;


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;

}


/* ===============================
   FORMAT DATE
================================= */

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* ===============================
   SECURITY
================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ===============================
   AUTO LOGIN
================================= */

window.addEventListener(
    "load",
    function() {

        const loggedIn =
            localStorage.getItem(
                "taskflowLoggedIn"
            );


        if (loggedIn === "true") {

            showApp();

        } else {

            loginPage.classList.remove(
                "hidden"
            );

            appPage.classList.add(
                "hidden"
            );

        }

    }
);