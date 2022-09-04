const { app, BrowserWindow } = require("electron");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    fullscreen: true,
    // webPreferences: {
    //   nodeIntegration: true,
    // },
    backgroundColor: "#000000",
  });
  //win.webContents.openDevTools();

  //load the index.html from a url
  win.loadURL("http://localhost:3000");
}

//app.commandLine.appendSwitch("trace-warnings");
app.whenReady().then(createWindow);
