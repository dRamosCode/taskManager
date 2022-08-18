// Requires
const { ipcRenderer } = require("electron");
const electron = require("electron");
const jetpack = require("../../../../fs-jetpack/main");
const CalendarClass = require("./Classes/Calendar");
const TaskClass = require("./Classes/Task");
const { timeSpent } = require("./Modules/Periodic");
const events = require("./Modules/Events");

//On document load execute...
window.addEventListener("DOMContentLoaded", function () {
	// Initialize classes
	let Calendario = new CalendarClass();
	let CurrentTask = new TaskClass();

	//Initialize events
	events(Calendario, CurrentTask);

	//Initialize periodic functions
	setInterval(function () {
		timeSpent(CurrentTask, "time");
	}, 1000);

	//Create Calendar
	Calendario.create(document.getElementById("calendario"));

	//Update task list
	CurrentTask.updateTasks(new Date(), document.getElementById("taskList"));
});
