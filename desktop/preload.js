const { contextBridge, ipcRenderer } = require("electron");

const { getStoreValue, setStore } = require("./settings");

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
});

contextBridge.exposeInMainWorld("configStore", {
  getSecret: (value) => getStoreValue(value),
  setUser: (key, value) => setStore(key, value),
});
