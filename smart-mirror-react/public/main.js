const { app, BrowserWindow } = require("electron");
const axios = require("axios");

const winurl = "http://localhost:3000";
let interval = null;

const startApp = (win) => {
  axios.get(winurl, { timeout: 1000 }).then((res) => {
    if (res.status === 200) {
      if (interval) {
        clearInterval(interval);
      }
      win.loadURL(winurl);
    }
  });
};

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    fullscreen: true,
    backgroundColor: "#000000",
  });
  win.webContents.openDevTools();

  //load the index.html from a url
  startApp(win);
  interval = setInterval(() => {
    startApp(win);
  }, 5000);
}

//app.commandLine.appendSwitch("trace-warnings");
app.whenReady().then(createWindow);
