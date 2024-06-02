const { app, BrowserWindow } = require("electron");
const path = require("path");
const { ipcMain } = require("electron/main");
const { setStore } = require("./settings");
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "ISPTUBE",
    width: 1000,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.webContents.openDevTools();

  mainWindow.loadURL("http://localhost:3000/");
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("key:set", async (e, opt) => {
  setStore(`${email}`, {
    email,
    password,
  });
});
