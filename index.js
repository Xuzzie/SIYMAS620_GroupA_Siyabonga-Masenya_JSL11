// deleted my code multiple times had to cut and paste this version of code form my github from yesterday
// TASK: import helper functions from utils
//currently
import {
  getTasks,
  createNewTask,
  patchTask,
  putTask,
  deleteTask,
} from "./utils/taskFunctions.js";
import { initialData } from "./initialData.js";

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage

function initializeData() {
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify(initialData)); // The initialData is a problem  since its not intialzized  we imported the data utils
    localStorage.setItem("showSideBar", "true");
    localStorage.setItem("light-theme", "false"); // added this to intialize light theme functionality
    console.log("Data has been initialized and saved to localStorage.");
  } else {
    console.log("Data already exists in localStorage");
  }
}

initializeData(); // added intiatlize data call hopefully it will work

// TASK: Get elements from the DOM
const elements = {
  // got all these elements directly  from the  html  . They are stored as key value  pairs which will allow us to  get them later
  themeSwitch: document.getElementById("switch"),
  hideSideBarBtn: document.getElementById("hide-side-bar-btn"),
  showSideBarBtn: document.getElementById("show-side-bar-btn"),

  // re added the elements  somthing is wrong and maybe it was the elements being fetched
  //Update  the manner in which i added my elements  led to none of my code working i dont know how it fixed

  headerSectionContainer: document.getElementById("layout"),
  button: document.getElementById("dropdownBtn"),
  addNewTaskButton: document.getElementById("add-new-task-btn"),
  editButton: document.getElementById("edit-board-btn"),
  headerBoardName: document.getElementById("header-board-name"),
  deleteTaskButton: document.getElementById("deleteBoardBtn"),
  createNewTaskBtn: document.getElementById("add-new-task-btn"),

  columnDivs: document.querySelectorAll("column-div"),

  form: document.getElementById("new-task-modal-window"),
  input: document.getElementById("title-input"),
  textArea: document.getElementById("desc-input"),
  selectColumn: document.getElementById("select-status"),
  btnContainer: document.getElementById("button-group"),
  createTaskBtn: document.getElementById("create-task-btn"),
  cancelAddTaskBtn: document.getElementById("cancel-add-task-btn"),

  editModalTaskContainer: document.getElementById("edit-task-modal-window"),
  input: document.getElementById("edit-task-title-input"),
  editBtn: document.getElementById("edit-btn"),
  textArea: document.getElementById("edit-task-desc-input"),
  select: document.getElementById("edit-select-status"),
  btnContainer: document.getElementById("edit-task-div button-group"),
  saveTaskChangesBtn: document.getElementById("save-task-changes-btn"),
  cancelEditBtn: document.getElementById("cancel-edit-btn"),
  deleteTaskBtn: document.getElementById("delete-task-btn"),
  modalWindow: document.getElementById("new-task-modal-window"),

  editTaskModal: document.getElementById("new-task-modal-window"),

  filterDiv: document.getElementById("filterDiv"),
};

let activeBoard = "";

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  // The aim of this function is fetch and display the boards tasks within the code
  const tasks = getTasks(); // What this code will turn the  task function into variable
  const boards = [...new Set(tasks.map((task) => task.board).filter(Boolean))];
  displayBoards(boards); // this function is  written later in the code , therefore is considered a call back fu
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));
    activeBoard = localStorageBoard ? localStorageBoard : boards[0]; //syntax error  was found here
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ""; // Clears the container
  boards.forEach((board) => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", () => {
      //The click meant nothing without the event listener added
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board; //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      styleActiveBoard(activeBoard);
    });
    boardsContainer.appendChild(boardElement);
  });
}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter((task) => task.board === boardName); // we addded a  strict equality check because previously the code was assigning  boardName to task.board which would lead to an error

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach((column) => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks
      .filter((task) => task.status === status)
      .forEach((task) => {
        // we addded another strict equality check because previously the code was assigning  boardName to task.board which would lead to an error

        const taskElement = document.createElement("div");
        taskElement.classList.add("task-div");
        taskElement.textContent = task.title;
        taskElement.setAttribute("data-task-id", task.id);

        // Listen for a click event on each task and open a modal
        taskElement.addEventListener("click", () => {
          // this code lacked the "addEventListener"
          openEditTaskModal(task);
        });

        tasksContainer.appendChild(taskElement);
      });
  });
}

function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll(".board-btn").forEach((btn) => {
    if (btn.textContent === boardName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function addTaskToUI(task) {
  const column = document.querySelector(
    `.column-div[data-status="${task.status}"]`
  ); // this looks like a template literal
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector(".tasks-container");
  if (!tasksContainer) {
    console.warn(
      `Tasks container not found for status: ${task.status}, creating one.`
    );
    tasksContainer = document.createElement("div");
    tasksContainer.className = "tasks-container";
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement("div");
  taskElement.className = "task-div";
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute("data-task-id", task.id);

  tasksContainer.appendChild(taskElement);
}

function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  cancelEditBtn.addEventListener("click", () =>
    toggleModal(false, elements.editTaskModal)
  ); //added event listener and fixed syntax

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById("cancel-add-task-btn");
  cancelAddTaskBtn.addEventListener("click", () => {
    toggleModal(false);
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener("click", () => {
    toggleModal(false);
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener("click", () => toggleSidebar(false)); // added  event listeners to the code in this section
  elements.showSideBarBtn.addEventListener("click", () => toggleSidebar(true));

  // Theme switch event listener
  elements.themeSwitch.addEventListener("change", toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener("click", () => {
    toggleModal(true);
    elements.filterDiv.style.display = "block"; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener("submit", (event) => {
    addTask(event);
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? "block" : "none"; // self note  its a Ternary Operator (study more on this next week)
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault();

  //Assign user input to the task object
  const task = {
    title: elements.titleInput.value, /// im not sure whats better  using elements  or going straight to  document.getElementById but im taking the user input  and storing it in the task  object
    description: elements.descInput.value,
    status: elements.selectStatus.value,
    board: activeBoard,
  };

  const newTask = createNewTask(task);
  if (newTask) {
    addTaskToUI(newTask);
    toggleModal(false, elements.newTaskModal); // Ensure the correct modal is hidden
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
    event.target.reset();
    refreshTasksUI();
  }
}

function toggleSidebar(show) {
  elements.sideBar.style.display = show ? "block" : "none";
} //added code to toggle sidebar , I needed help with this since i forgot how to do this

function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("light-theme")) {
    // If the light theme  theme is active, switch to  remove it and place  dark theme visa versa

    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
  } else {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
  }
}

function openEditTaskModal(task) {
  // Set task details in modal inputs
  document.getElementById("editTaskTitle").value = task.title; // we are adding the existing details into the tasks
  document.getElementById("editTaskDescription").value = task.description;
  document.getElementById("editTaskDueDate").value = task.dueDate;

  // Get button elements from the task modal
  const saveChangesButton = document.getElementById("saveChangesButton"); // conencted elements for the buttons
  const deleteTaskButton = document.getElementById("deleteTaskButton");

  // Call saveTaskChanges upon click of Save Changes button
  saveChangesButton.onclick = function () {
    saveTaskChanges(task.id);
  };

  // Delete task using a helper function and close the task modal

  deleteTaskButton.onclick = function () {
    deleteTask(task.id);
    toggleModal(false, elements.editTaskModal); // have huge issues understanding false need to study further
  };

  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs

  const updatedTitle = document.getElementById("editTaskTitle").value;
  const updatedDescription = document.getElementById(
    "editTaskDescription"
  ).value;
  const updatedDueDate = document.getElementById("editTaskDueDate").value;

  // Create an object with the updated task details
  const updatedTask = {
    id: taskId,
    title: updatedTitle,
    description: updatedDescription,
    dueDate: updatedDueDate,
  };
  // Update task using a hlper functoin
  updateTask(updatedTask);

  // Close the modal and refresh the UI to reflect the changes

  refreshTasksUI();
}
toggleModal(false, elements.editTaskModal);
refreshTasksUI(); //struggled with section

/*************************************************************************************************************************************************/

document.addEventListener("DOMContentLoaded", function () {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem("showSideBar") === "true";
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem("light-theme") === "enabled";
  document.body.classList.toggle("light-theme", isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}
