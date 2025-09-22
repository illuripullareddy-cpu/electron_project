const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // allow ipcRenderer
    },
  });

  win.loadFile('index.html');
}

// Delete all files in D:/My Data
ipcMain.on('delete-all-files', (event) => {
  const targetDir = "D:/My Data";

  try {
    if (fs.existsSync(targetDir)) {
      const files = fs.readdirSync(targetDir);
      let deletedCount = 0;

      files.forEach((file) => {
        const filePath = path.join(targetDir, file);

        if (fs.lstatSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      });

      event.reply('delete-status', `✅ Deleted ${deletedCount} files from "${targetDir}".`);
    } else {
      event.reply('delete-status', `⚠️ Directory not found: ${targetDir}`);
    }
  } catch (err) {
    event.reply('delete-status', `❌ Error: ${err.message}`);
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
