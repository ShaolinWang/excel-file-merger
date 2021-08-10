'use strict';

const { app, BrowserWindow, ipcMain: ipc, dialog, shell } = require('electron');
const mergeExcel = require('./server/CreateExcel').mergeExcel;
const directoryWalk = require('./server/DirectoryWalker').directoryWalk;

var startApplication = function startApplication() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		}
	});

	// and load the index.html of the app.
	mainWindow.loadFile('index.html');
	//mainWindow.loadUrl('http://localhost:3000');

	// Open the DevTools.
	mainWindow.openDevTools();

	ipc.on('open-dir-dialog', function (event, arg) {
		dialog.showOpenDialog(mainWindow, {
			properties: ['openDirectory', 'multiSelections'],
		})
			.then(function ({ filePaths }) {
				event.reply('open-dir-dialog-reply', filePaths);
			})
	});

	ipc.on('open-finder', function (event, arg) {
		shell.showItemInFolder(arg.path)
	});

	ipc.on('create-excle', function (event, files, path) {
		mergeExcel(files, path)
			.then(function () {
				event.sender.send('merge-reply', true);
			})
			.catch(function () {
				event.sender.send('merge-reply', false);
			});
	})

	ipc.on('directory-walk', function (event, path) {
		directoryWalk(path)
			.then(function (entries) {
				event.reply('directory-walk-reply', entries)
			})
			.catch(function (err) {
				event.reply('directory-walk-reply', null, err)
			})
	})
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
	startApplication()

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) startApplication()
	})
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform != 'darwin') {
		app.quit();
	}
});
