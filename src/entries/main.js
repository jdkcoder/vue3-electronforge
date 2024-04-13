import { app, BrowserWindow } from 'electron'
import squirrelStartup from 'electron-squirrel-startup';
import { render2Screen, getScreenSize, toggleDevTools } from './extras'
import path from 'node:path'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
squirrelStartup && app.quit();
function createWindow() {
  const screenSize = getScreenSize()
  // Create the browser window.
  if (screenSize) {
    const mainWindow = new BrowserWindow({
      ...screenSize,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    render2Screen(mainWindow)

    // Open the DevTools.
    toggleDevTools(mainWindow)
  }
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    BrowserWindow.getAllWindows().length === 0 && createWindow()
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  process.platform !== 'darwin' && app.quit()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
