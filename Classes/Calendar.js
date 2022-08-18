//Calendar layout
class Calendar {
	constructor() {
		this.date = new Date(); // Current date
		this.year = 0; //Current year
		this.firstDay = 0; //Weekday of January 1st
		this.currentDay = this.date.getDate(); // Day selected in calendar
		this.currentMonth = this.date.getMonth(); // Month shown in calendar
		this.year = 0; //Current year
		this.months = []; //Array of months
	}

	// Create a new calendar
	create(id) {
		//Set current year
		this.year = this.date.getFullYear();
		//Fill months of year
		this.createMonths();
		//Create HTML
		this.display(id);
		//Select current date
		this.select(this.currentDay, this.currentMonth);
	}

	//Get first day of month
	firstDayOfMonth(monthNumber, type) {
		// type: 1="Sunday first", 2="Monday first"
		let firstDay = new Date(monthNumber + " 1, " + this.year);

		// Days: 0:Sunday --> 6:Saturday
		if (type == 1) {
			return firstDay.getDay();
		}
		// Days: 0:Monday --> 6:Sunday
		else {
			switch (firstDay.getDay()) {
				case 0:
					return 6;
				default:
					return firstDay.getDay() - 1;
			}
		}
	}

	//Fill month knowing 1st weekday
	createMonths() {
		//Loop through all the months in a year
		for (let j = 1; j <= 12; j++) {
			//Variables
			let days = [];
			let index = 0;

			//Get month 1st day
			let firstDay = this.firstDayOfMonth(j, 2);

			//Loop trough days before 1st day visible on month
			for (let i = 0 - firstDay; i < 0; i++) {
				//Restart initial date
				let date = new Date(j + " 1, " + this.year);
				//Get dates
				date.setDate(date.getDate() + i);
				days.push(date.getDate());
				index++;
			}

			//Loop through rest of days visible on month
			for (let i = 0; i < 43 - firstDay; i++) {
				//Restart initial date
				let date = new Date(j + " 1, " + this.year);
				//Get dates
				date.setDate(date.getDate() + i);
				days.push(date.getDate());
				index++;
			}

			//Copy to array
			this.months.push(days);
		}
	}

	display(id) {
		//Create div

		//Create Container
		let container = document.createElement("div");
		id.appendChild(container);
		container.classList.add("calendarContainer");

		//Create title
		let title = document.createElement("div");
		container.appendChild(title);
		title.classList.add("calendarTitle");

		//Create left title arrow
		let leftArrow = document.createElement("div");
		leftArrow.innerHTML = "<";
		title.appendChild(leftArrow);
		leftArrow.classList.add("calendarLeftArrow");
		//Create month name
		let monthName = document.createElement("div");
		monthName.innerHTML = this.monthName(this.currentMonth);
		title.appendChild(monthName);
		monthName.classList.add("calendarMonthName");
		monthName.setAttribute("id", "calendarMonthName");
		//Create right title arrow
		let rightArrow = document.createElement("div");
		rightArrow.innerHTML = ">";
		title.appendChild(rightArrow);
		rightArrow.classList.add("calendarRightArrow");

		//Create day names
		let dayNames = document.createElement("div");
		container.appendChild(dayNames);
		dayNames.classList.add("calendarDayNames");

		//Create Monday
		let monday = document.createElement("div");
		monday.innerHTML = "L";
		dayNames.appendChild(monday);
		monday.classList.add("calendarDayName");
		//Create Tuesday
		let tuesday = document.createElement("div");
		tuesday.innerHTML = "M";
		dayNames.appendChild(tuesday);
		tuesday.classList.add("calendarDayName");
		//Create Wednesday
		let wednesday = document.createElement("div");
		wednesday.innerHTML = "X";
		dayNames.appendChild(wednesday);
		wednesday.classList.add("calendarDayName");
		//Create Thursday
		let thursady = document.createElement("div");
		thursady.innerHTML = "J";
		dayNames.appendChild(thursady);
		thursady.classList.add("calendarDayName");
		//Create Friday
		let friday = document.createElement("div");
		friday.innerHTML = "V";
		dayNames.appendChild(friday);
		friday.classList.add("calendarDayName");
		//Create Saturday
		let saturday = document.createElement("div");
		saturday.innerHTML = "S";
		dayNames.appendChild(saturday);
		saturday.classList.add("calendarDayName");
		//Create Sunday
		let sunday = document.createElement("div");
		sunday.innerHTML = "D";
		dayNames.appendChild(sunday);
		sunday.classList.add("calendarDayName");

		//Create day list
		let dayList = document.createElement("div");
		container.appendChild(dayList);
		dayList.setAttribute("id", "dayList");
		dayList.classList.add("calendarDays");
	}

	//Update display
	update(month) {
		//Change month name
		const monthDiv = document.getElementById("calendarMonthName");
		monthDiv.innerHTML = this.monthName(month);

		//Delete all days
		const div = document.getElementById("dayList");
		while (div.firstChild) {
			div.removeChild(div.lastChild);
		}
		//Create day list and number of days
		let days = [];
		let nDays = new Date(this.year, month + 1, 0).getDate();
		let first = false;
		let last = false;

		//Loop through all 42 days shown
		for (let i = 0; i < 42; i++) {
			days.push(document.createElement("div"));
			days[i].innerHTML = this.months[month][i];
			dayList.appendChild(days[i]);
			days[i].classList.add("calendarDay");

			//Last day of month passed
			if (first == true && last == false && this.months[month][i] == 1) {
				last = true;
			}
			//First day of month passed
			if (first == false && this.months[month][i] == 1) {
				first = true;
			}

			//Mark current day
			if (days[i].innerHTML == this.currentDay && last == false) {
				days[i].classList.add("currentDay");
			}
			//Mark other months days as grey
			if (first == false || last == true) {
				days[i].classList.add("otherMonthDay");
			}
		}
	}

	//Select date
	select(day, month) {
		//Get current date
		this.currentDay = day;
		this.currentMonth = month;
		//Display current date
		this.update(this.currentMonth);
	}

	//Month name
	monthName(month) {
		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		const d = new Date(this.year, month);
		return monthNames[d.getMonth()];
	}
}

//Exports
module.exports = Calendar;
