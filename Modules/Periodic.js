//Module for periodic execution functions

//Update time spent on current task
function timeSpent(task, id) {
	if (task.started) {
		//Update text
		const div = document.getElementById(id);
		div.textContent = task.time_spent();
	}
}

module.exports = { timeSpent };
