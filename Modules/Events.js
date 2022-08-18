//Require
const { ipcRenderer } = require("electron");

function events(calendar, task) {
	//Initialize variables
	let descriptionFocused = false;

	//Play button - Start new task
	document.getElementById("play").addEventListener("click", function () {
		task.start();
	});

	//Pause button - Stop task and update list
	document.getElementById("pause").addEventListener("click", function () {
		task.stop(task);
		//Update list if current day is selected
		if (
			calendar.currentDay == new Date().getDate() &&
			calendar.currentMonth == new Date().getMonth()
		) {
			task.updateTasks(new Date(), document.getElementById("taskList"));
		}
	});

	//Click events
	document.addEventListener("click", function (event) {
		//Date on calendar - change shown date
		if (event.target.className == "calendarDay") {
			//Get clicked date
			let day = event.target.innerHTML;
			calendar.select(day, calendar.currentMonth);
			task.updateTasks(
				new Date(calendar.year, calendar.currentMonth, calendar.currentDay),
				document.getElementById("taskList")
			);
		}

		//Calendar left arrow - show previous month
		if (event.target.className == "calendarLeftArrow") {
			//Limit to first month
			if (calendar.currentMonth > 0) {
				calendar.select(1, calendar.currentMonth - 1);
				task.updateTasks(
					new Date(calendar.year, calendar.currentMonth, calendar.currentDay),
					document.getElementById("taskList")
				);
			}
		}

		//Calendar right arrow - show next month
		if (event.target.className == "calendarRightArrow") {
			//Limit to last month
			if (calendar.currentMonth < 11) {
				calendar.select(1, calendar.currentMonth + 1);
				task.updateTasks(
					new Date(calendar.year, calendar.currentMonth, calendar.currentDay),
					document.getElementById("taskList")
				);
			}
		}

		//Today button - Change to today date
		if (event.target.className == "today") {
			let today = new Date();
			calendar.select(today.getDate(), today.getMonth());
			task.updateTasks(
				new Date(calendar.year, calendar.currentMonth, calendar.currentDay),
				document.getElementById("taskList")
			);
		}

		//Focus on Task writing
		if (event.target.className == "description") {
			descriptionFocused = true;
		} else {
			descriptionFocused = false;
		}

		//Copy to clipboard
		if (event.target.className == "taskCopy") {
			//Format string
			let copyDescription =
				event.target.parentElement.parentElement.firstChild.firstChild
					.innerHTML;
			let copyHours =
				event.target.parentElement.parentElement.firstChild.lastChild.innerHTML;
			let copyPosition = copyHours.search("m");
			copyHours = copyHours.substring(0, copyPosition + 1);
			let string = copyDescription.concat(" - " + copyHours);
			//Copy string to clipboard
			navigator.clipboard.writeText(string);
		}
	});

	//Keyboard events
	document.addEventListener("keyup", function (event) {
		//Enter key pressed
		if (event.keyCode === 13) {
			//Stop current task if started
			if (task.started == true) {
				task.stop(task);
				//Update list if current day is selected
				if (
					calendar.currentDay == new Date().getDate() &&
					calendar.currentMonth == new Date().getMonth()
				) {
					task.updateTasks(new Date(), document.getElementById("taskList"));
				}
				return;
			}

			//If description is on focus start new task
			if (descriptionFocused) {
				task.start();
			}
		}
	});

	//Close app
	document.getElementById("close").addEventListener("click", function () {
		//Stop task if currently active
		if (task.started) {
			task.stop(task);
			//Update list if current day is selected
			if (
				calendar.currentDay == new Date().getDate() &&
				calendar.currentMonth == new Date().getMonth()
			) {
				task.updateTasks(new Date(), document.getElementById("taskList"));
			}
		}
		ipcRenderer.send("close");
	});
	//Footer app
	document.getElementById("mode_footer").addEventListener("click", function () {
		document.getElementById("navigation").style.display = "none";
		document.getElementById("content").style.display = "none";
		document.getElementById("footer").style.height = "100vh";
		document.getElementById("mode_max").style.display = "block";
		ipcRenderer.send("mode_footer");
	});
	//Maximize app
	document.getElementById("mode_max").addEventListener("click", function () {
		document.getElementById("navigation").style.display = "flex";
		document.getElementById("content").style.display = "flex";
		document.getElementById("footer").style.height = "10vh";
		document.getElementById("mode_max").style.display = "none";
		ipcRenderer.send("mode_max");
	});
	//Minimize app
	document.getElementById("mode_min").addEventListener("click", function () {
		ipcRenderer.send("mode_min");
	});
}

module.exports = events;
