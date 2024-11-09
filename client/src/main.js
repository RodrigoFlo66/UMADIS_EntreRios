
const { BrowserWindow, Notification } = require("electron");
let window
function createWindow() {
    window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    window.loadFile("src/ui/index.html");
    window.maximize();
    //window.loadURL('http://localhost:8080');
}

module.exports = {
    createWindow,
}