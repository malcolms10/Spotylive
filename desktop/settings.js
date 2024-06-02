const Store = require("electron-store");

const store = new Store({
  cwd: "./tmp'",
  encryptionKey: "my-secret-keydnfd",
});

const getStoreValue = (key) => {
  const value = store.get(key);
  if (value) return value || null;
};

const setStore = (key, value) => {
  store.set(key, value);
  return getStoreValue(key);
};

module.exports = {
  getStoreValue,
  setStore,
};
