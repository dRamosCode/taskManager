// Require
const jetpack = require("../../../../../fs-jetpack/main");

// Task Class
class Task {
	constructor() {
		this.description = "";
		this.started = false;
		this.start_year = "";
		this.start_month = "";
		this.start_day = "";
		this.start_hour = "";
		this.start_minute = "";
		this.start_second = "";
		this.end_year = "";
		this.end_month = "";
		this.end_day = "";
		this.end_hour = "";
		this.end_minute = "";
		this.end_second = "";
		this.time = "";
	}

	//Calculate time spent on task
	time_spent() {
		let hours_spent;
		let minutes_spent;
		let seconds_spent;
		let time_spent_string = "";

		//Calculate time spent
		let date = new Date();
		hours_spent = date.getHours() - this.start_hour;
		minutes_spent = date.getMinutes() - this.start_minute;
		seconds_spent = date.getSeconds() - this.start_second;

		//Get total of time spent
		[hours_spent, minutes_spent, seconds_spent] = Task.invert(
			hours_spent,
			minutes_spent,
			seconds_spent
		);

		//Format time into string
		time_spent_string = time_spent_string.concat(
			hours_spent + "h " + minutes_spent + "m " + seconds_spent + "s"
		);

		this.time = time_spent_string;

		return time_spent_string;
	}

	//Invert negative time values
	static invert(hours, minutes, seconds) {
		//Seconds spent
		if (hours < 0) {
			hours = 24 - Math.abs(hours);
		}
		if (minutes < 0) {
			minutes = 60 - Math.abs(minutes);
			if (hours > 0) {
				hours = hours - 1;
			}
		}
		if (seconds < 0) {
			seconds = 60 - Math.abs(seconds);
			if (minutes > 0) {
				minutes = minutes - 1;
			}
		}
		return [hours, minutes, seconds];
	}

	//Update task list with all tasks
	updateTasks(date, div) {
		//Initialize variables
		let filename; //JSON file name
		let tasks; //Task list stored in JSON

		//Set .JSON file name (current day)
		filename = this.jsonFileName(date);

		//Delete previous data
		this.empty(div);

		//If .JSON exists get data
		if (jetpack.exists("../dist/resources/app/Data/Dates/" + filename + ".json") != false) {
			//Get task list
			tasks = jetpack.read("../dist/resources/app/Data/Dates/" + filename + ".json", "json");

			//Loop through tasks
			for (let i = 0; i < tasks.length; i++) {
				//Create divs
				let divTask = document.createElement("div");
				let divTaskTitle = document.createElement("div");
				let divTaskDescription = document.createElement("div");
				let divTaskTimeSpent = document.createElement("div");
				let divTaskInformation = document.createElement("div");
				let divTaskTime = document.createElement("div");
				let divTaskCopy = document.createElement("div");

				//Fill divs
				divTaskDescription.innerHTML = tasks[i].description;
				divTaskTimeSpent.innerHTML = tasks[i].time;
				divTaskTime.innerHTML =
					tasks[i].start_hour.toString() +
					":" +
					tasks[i].start_minute.toString() +
					":" +
					tasks[i].start_second.toString() +
					" - " +
					tasks[i].end_hour.toString() +
					":" +
					tasks[i].end_minute.toString() +
					":" +
					tasks[i].end_second.toString();

				//Append divs to HTML
				div.appendChild(divTask);
				divTask.appendChild(divTaskTitle);
				divTaskTitle.appendChild(divTaskDescription);
				divTaskTitle.appendChild(divTaskTimeSpent);
				divTask.appendChild(divTaskInformation);
				divTaskInformation.appendChild(divTaskTime);
				divTaskInformation.appendChild(divTaskCopy);

				//Add classes
				divTask.classList.add("task");
				divTask.tabIndex = -1;
				divTaskTitle.classList.add("taskTitle");
				divTaskDescription.classList.add("taskDescription");
				divTaskTimeSpent.classList.add("taskTimeSpent");
				divTaskInformation.classList.add("taskInformation");
				divTaskTime.classList.add("taskTime");
				divTaskCopy.classList.add("taskCopy");
			}
		}
	}

	//Start new task
	start() {
		//Get current date
		let date = new Date();

		//If there is no task running save initial date
		if (this.started == false) {
			this.start_year = date.getFullYear();
			this.start_month = date.getMonth();
			this.start_day = date.getDay();
			this.start_hour = date.getHours();
			this.start_minute = date.getMinutes();
			this.start_second = date.getSeconds();
			//Task started
			this.started = true;
			//Hide PLAY button, show STOP button
			document.getElementById("play").style.visibility = "hidden";
			document.getElementById("pause").style.visibility = "visible";
			//Task description
			this.description = document.getElementById("description").value;
			//Disable description text
			document.getElementById("description").readOnly = true;
			document.getElementById("description").blur();
			document.getElementById("description").style.pointerEvents = "none";
			document.getElementById("description").style.backgroundColor =
				"var(--primaryLight)";
			document.getElementById("description").style.color = "var(--basicDark)";
		}
	}

	//Stop current task
	stop() {
		//Initialize variables
		let tasks = [];
		//Get current date
		let date = new Date();

		//Save end date
		this.end_year = date.getFullYear();
		this.end_month = date.getMonth();
		this.end_day = date.getDay();
		this.end_hour = date.getHours();
		this.end_minute = date.getMinutes();
		this.end_second = date.getSeconds();

		//Set .JSON name (current day)
		let filename = this.jsonFileName(date);

		//If .JSON exists get data to update
		if (jetpack.exists("../dist/resources/app/Data/Dates/" + filename + ".json") != false) {
			tasks = jetpack.read("../dist/resources/app/Data/Dates/" + filename + ".json", "json");
		}

		//Update data with current task finished
		tasks.push(this);
		//Write to .JSON new data
		jetpack.write("../dist/resources/app/Data/Dates/" + filename + ".json", tasks);
		//Stop task
		this.started = false;

		//Hide STOP button, show PLAY button
		document.getElementById("play").style.visibility = "visible";
		document.getElementById("pause").style.visibility = "hidden";

		//Enable description text
		document.getElementById("description").readOnly = false;
		document.getElementById("description").focus();
		document.getElementById("description").style.pointerEvents = "all";
		document.getElementById("description").style.backgroundColor =
			"var(--basicLight)";
		document.getElementById("description").style.color =
			"var(--basicContrastText)";
		document.getElementById("description").value = "";

		//Update div text
		const div = document.getElementById("time");
		div.textContent = "";
	}

	//Empty task list
	empty(div) {
		//Delete all children
		while (div.firstChild) {
			div.removeChild(div.lastChild);
		}
	}

	//Generate JSON file name
	jsonFileName(date) {
		return (
			date.getDate().toString() +
			"_" +
			(date.getMonth() + 1).toString() +
			"_" +
			date.getFullYear().toString()
		);
	}
}

//Exports
module.exports = Task;
