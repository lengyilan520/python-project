const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('petAPI', {
  move: (x, y) => ipcRenderer.send('pet:move', { x, y }),
  getPosition: () => ipcRenderer.invoke('pet:get-position'),
  showContextMenu: () => ipcRenderer.send('pet:context-menu'),
  submit: (text) => ipcRenderer.invoke('pet:submit', text),
  setSize: (width, height) => ipcRenderer.invoke('pet:set-size', { width, height }),
  onOpenInput: (cb) => ipcRenderer.on('pet:open-input', () => cb()),
});
