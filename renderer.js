const { ipcRenderer } = require('electron');

function deleteAll() {
  if (confirm("⚠️ Are you sure? This will delete ALL files in D:/My Data permanently!")) {
    ipcRenderer.send("delete-all-files");
  }
}

ipcRenderer.on("delete-status", (event, message) => {
  document.getElementById("status").innerText = message;
});
