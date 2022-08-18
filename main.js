// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const electron = require("electron");
const path = require("path");

//require("electron-reload")(__dirname);

let mainWindow;
function createWindow() {

	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1020,
		height: 650,
		resizable: false,
		movable: false,
		frame: false,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, "renderer.js"),
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile("index.html");

	// Open the DevTools.
	//mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("close", (evt, arg) => {
	app.quit();
});
ipcMain.on("mode_footer", (evt, arg) => {
	mainWindow.setContentSize(700, 60, true);
	let display = electron.screen.getPrimaryDisplay();
	let height = display.bounds.height;
	let width = display.bounds.width;
	mainWindow.setPosition(width - 710, height - 110, true);
	mainWindow.setAlwaysOnTop(true);
});
ipcMain.on("mode_max", (evt, arg) => {
	mainWindow.setContentSize(1020, 650, true);
	mainWindow.center();
	mainWindow.setAlwaysOnTop(false);
});
ipcMain.on("mode_min", (evt, arg) => {
	mainWindow.minimize();
});
