'use strict'

let taskContainer = document.querySelector('.task');
let taskContent = taskContainer.querySelector('.task__content');
let taskTitleTemplate = taskContainer.querySelector('#task-content').content.querySelector('.task__title');
let taskTextTemplate = taskContainer.querySelector('#task-content').content.querySelector('.task__text');
let taskButtonContainer = taskContainer.querySelector('.task__button-container');
let changeActivityButton = taskButtonContainer.querySelector('#change-button');
let setActivityButton = taskButtonContainer.querySelector('#set-button');
let houses = document.querySelectorAll('.house__checkbox');
let daysData;
let tasksData;

changeActivityButton.addEventListener('click', clickOnChangeActivityButton);
setActivityButton.addEventListener('click', clickOnSetActivityButton);


houses.forEach(function(house) {
    house.addEventListener('change', clickOnHouse);
})

getDataFromJSON();

function renderCheckedHouses() {
    // To render already turned on houses after reload
    let localDaysData = JSON.parse(window.localStorage.getItem(daysData));

    if (localDaysData) {
        houses.forEach(function(house) {
            let houseId = house.id - 1;

            if (localDaysData[houseId].isChecked === true) {
                house.checked = true;
            }
        })
    } else {
        alert("I'm that random bug that prevents you from enjoying the calendar! Boo! (Reload the page, please T_T)");
    }
}

function clickOnHouse(event) {
    let localDaysData = JSON.parse(window.localStorage.getItem(daysData));
    let houseId = event.currentTarget.id - 1;
    let taskTitle;
    let taskText;
    let canBeChanged = localDaysData[houseId].canBeChanged;
    // if the user is turning house on
    if (event.currentTarget.checked) {
        localDaysData[houseId].isChecked = true;
        taskTitle = localDaysData[houseId].day;
        taskText = getTaskText(houseId, localDaysData);
        updateLocalStorage(daysData, localDaysData);
    } else { // if the user is trying to turn house off
        event.preventDefault();
        event.currentTarget.checked = true;
        taskTitle = localDaysData[houseId].day;
        taskText = localDaysData[houseId].task;
    }

    drawTaskInfo(taskTitle, taskText, canBeChanged, houseId);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random()*(max-min+1))+min;
}

function getTaskText(houseId, localDaysData) {
    if (localDaysData[houseId].task !== "") {
        // Returning fixed task from days_data
        updateLocalStorage(daysData, localDaysData);
        return localDaysData[houseId].task;
    } else {
        // Assigning the task from the list
        let localTasksData = JSON.parse(window.localStorage.getItem(tasksData));
        let taskId = getRandomNumber(0, localTasksData.length);
        localDaysData[houseId].task = localTasksData[taskId].text;
        let taskText = localDaysData[houseId].task;
        return taskText;
    }
}

function clickOnChangeActivityButton(event) {
    let houseId = event.currentTarget.dataset.houseId;
    let localDaysData = JSON.parse(window.localStorage.getItem(daysData));
    let text = getTaskText(houseId, localDaysData);
    renderTaskText(text);
}

function clickOnSetActivityButton() {
    taskButtonContainer.classList.add('task__button-container--hidden');
    let localTasksData = JSON.parse(window.localStorage.getItem(tasksData));
    let localDaysData = JSON.parse(window.localStorage.getItem(daysData));
    let currentText = taskContent.querySelector('.task__text').textContent;
    let taskToBeSet = localTasksData.find(task => task.text === currentText);
    localTasksData.splice(taskToBeSet, 1);
    updateLocalStorage(tasksData, localTasksData);
    updateLocalStorage(daysData, localDaysData);
    console.log(localTasksData);
}

function updateLocalStorage(key, object) {
    window.localStorage.setItem(key , JSON.stringify(object));
}

function drawTaskInfo(title, text, canBeChanged, houseId) {
    renderTaskTitle(title);
    renderTaskText(text);
    renderTaskButtons(canBeChanged, houseId);
}

function renderTaskTitle(title) {
    let taskTitle = taskContainer.querySelector('.task__title');

    if (!taskTitle) {
        let newTaskTitle = taskTitleTemplate.cloneNode(true);
        newTaskTitle.textContent = title;
        taskContent.insertBefore(newTaskTitle, null);
    } else {
        taskTitle.textContent = title;
    }
}

function renderTaskText(text) {
    let taskText = taskContainer.querySelector('.task__text');

    if (!taskText) {
        let newTaskText = taskTextTemplate.cloneNode(true);
        newTaskText.textContent = text;
        taskContent.insertBefore(newTaskText, null);
    } else {
        taskText.textContent = text;
    }
}

function renderTaskButtons(canBeChanged, houseId) {
    if (taskButtonContainer.classList.contains('task__button-container--hidden')) {
        if (canBeChanged) {
            taskButtonContainer.classList.remove('task__button-container--hidden');
            changeActivityButton.dataset.houseId = houseId;
            setActivityButton.dataset.houseId = houseId;
        }
    } else {
        if (!canBeChanged) {
            taskButtonContainer.classList.add('task__button-container--hidden');
        }
    }
}

function getDataFromJSON() {
    // Function to get data from json into js
    if (localStorage.length === 0) {
        fetch('https://amgartseva.github.io/advent.github.io/build/json/days_data.json')
            .then((response) => response.json())
            .then((json) => daysData = json)
            .then(() => window.localStorage.setItem(daysData, JSON.stringify(daysData)));
        fetch('https://amgartseva.github.io/advent.github.io/build/json/tasks.json')
            .then((response) => response.json())
            .then((json) => tasksData = json)
            .then(() => window.localStorage.setItem(tasksData, JSON.stringify(tasksData)));
    } else {
        fetch('https://amgartseva.github.io/advent.github.io/build/json/days_data.json')
            .then((response) => response.json())
            .then((json) => daysData = json)
        fetch('https://amgartseva.github.io/advent.github.io/build/json/tasks.json')
            .then((response) => response.json())
            .then((json) => tasksData = json)
            .then(() => renderCheckedHouses());
    }
}