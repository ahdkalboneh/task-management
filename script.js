const inputTask = document.getElementById("task");
const list = document.getElementById("added-tasks");
const taskForm = document.getElementById("task-form");
const filterButton = document.querySelectorAll(".filter");
let counter = document.getElementById("counter");
let currentFilter = "all";

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function showTasks() {

    list.innerHTML = "";
    tasks.forEach(task => {
        const shouldShow = currentFilter === "all" ||(currentFilter === "active" && !task.completed) || (currentFilter === "completed" && task.completed);

        if (!shouldShow) {
            return;
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;


        const label = document.createElement("label");
        label.textContent = task.text;
        if (task.completed) {
            label.style.textDecoration = "line-through";
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "x";
        deleteButton.classList.add("delete-button");

        deleteButton.addEventListener("click", function() {
            const index = tasks.indexOf(task);
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            showTasks();
            setCounter();
        });


        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            showTasks();
        });

        const taskItem = document.createElement("div");
        taskItem.appendChild(checkbox);
        taskItem.appendChild(label);
        taskItem.appendChild(deleteButton);

        list.appendChild(taskItem);
        list.appendChild(document.createElement("hr"));
        setCounter();
    });
}

function setCounter(){
    let count;
    if (currentFilter === "all") {
        count = tasks.length;
    } else if (currentFilter === "active") {
        count = tasks.filter(task => !task.completed).length;
    } else if (currentFilter === "completed") {
        count = tasks.filter(task => task.completed).length;
    }

    counter.textContent = `${count} tasks left`
}

function addTask(taskText) {
    if(taskText.trim() === ""){
        alert("Enter a task.")
        return;
    }

    tasks.push({
        text: taskText.trim(),
        completed: false
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    inputTask.value = "";
    showTasks();
}



taskForm.addEventListener("submit", function(event){
    event.preventDefault();

    addTask(inputTask.value);
});

filterButton.forEach(button => {
    button.addEventListener("click", function(event) {
        currentFilter = event.target.textContent.trim().toLowerCase();

        filterButton.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        showTasks();
        setCounter();
    });
});

showTasks();