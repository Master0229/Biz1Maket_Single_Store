const { app, BrowserWindow, Menu, webFrame, Notification, ipcMain } = require('electron')
const url = require("url");
const path = require("path");
const electron = require('electron');
const { PosPrinter } = require("electron-pos-printer");
const database = require('./database')
const find = require('local-devices');
const ip = require('ip');

let mainWindow
let menu = Menu;

function redirect() {
  mainWindow.loadURL(`file://${__dirname}/dist/index.html`);
}



function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  var menu = Menu.buildFromTemplate([{
    label: 'Biz1Pos',
    submenu: [{
      label: 'Reload',
      // accelerator: "F5",
      accelerator: process.platform === 'darwin' ? 'Ctrl+R' : 'F5',
      click() { redirect(); }
    },
    {
      role: 'toggledevtools',
      accelerator: process.platform === 'darwin' ? 'Ctrl+T' : 'F12',

    },
    { role: 'togglefullscreen' },
    {
      role: 'close',
      accelerator: process.platform === 'darwin' ? 'F10' : 'Ctrl+Q',
    },
    { role: 'zoomIn' },
    { role: 'zoomOut' }
    ]
  }])
  Menu.setApplicationMenu(menu);
}

function createTray() {
  const iconPath = path.resolve(__dirname, 'Bizdomlogo.png')

  tray = new Tray(iconPath)

  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Preferences...',
      click: () => {
        win.show()
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setContextMenu(trayMenu)
}

const startAutoUpdater = (squirrelUrl) => {
  // The Squirrel application will watch the provided URL
  autoUpdater.setFeedURL(squirrelUrl);

  autoUpdater.addListener("update-available", () => {
      console.log("update-available")
      mainWindow.webContents.send("update-available", true)
  })
  // Display a success message on successful update
  autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName) => {
      console.log(`The release ${releaseName} has been downloaded`)
      mainWindow.webContents.send("update-downloaded", true)
      // ipcMain.emit("update-downloaded", true)
      // dialog.showMessageBox({ "message": `The release ${releaseName} has been downloaded` });
  });

  // Display an error message on update error
  autoUpdater.addListener("error", (error) => {
      console.log(error)
      mainWindow.webContents.send("update-error", error)
      // ipcMain.emit("update-error", error)
      // dialog.showMessageBox({ "message": "Auto updater error: " + error });
  });

  // tell squirrel to check for updates
  autoUpdater.checkForUpdates();
}


app.on('ready', createWindow, createTray)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})


//////////////////////////////////////PRINT/////////////////////////////////////////////////////////////
global.GetPrinters = function () {
  return mainWindow.webContents.getPrinters()
}
global.scanlan = function () {
  return find();
}
global.startserver = function () {
  return database.startserver();
}
global.database = function () {
  return database.app
}
global.removeclient = function (id) {
  return database.removeclient(id)
}
global.stopserver = function () {
  return database.stopserver()
}
// Print
global.print = function (count, printers, template) {
  console.log(printers)
  printers.forEach(printer => {
    const options = {
      preview: false, // Preview in window or print
      width: '300px', //  width of content body
      margin: '0 0 0 0', // margin of content body
      copies: count, // Number of copies to print
      printerName: printer, // printerName: string, check with webContent.getPrinters()
      timeOutPerLine: 5000,
      silent: true
      // pageSize: { height: 301000, width: 71000 }  // page size
    }
    const data = [{
      type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: template,
      style: ``,
      css: {}
    }]
    if (printer) {
      PosPrinter.print(data, options)
        .then(() => {
          console.log("Print Successfull")
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

}
global.barcodePrint = function (options, data) {
  PosPrinter.print(data, options).then(() => {
    console.log("Print Successfull");
  }).catch((error) => {
    console.log(error);
  });
}
ipcMain.on('start-update', (event, updateUrl) => {
  startAutoUpdater(updateUrl)
})

ipcMain.on('app-relaunch', (event, args) => {
  // console.log(args)
  autoUpdater.quitAndInstall()
})
