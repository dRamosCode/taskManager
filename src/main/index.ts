import { app, shell, BrowserWindow, ipcMain, globalShortcut, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import * as fs from 'fs'
import icon from '../../resources/icon.png?asset'

const dataFilePath = join(app.getPath('userData'), 'data.json')

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    frame: false,
    resizable: true,
    show: true,
    backgroundColor: '#F4F6FA',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('close', (event) => {
    event.preventDefault()
    mainWindow?.hide()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createTray(): void {
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Task Manager (Ctrl+Shift+T)',
      click: () => {
        mainWindow?.show()
        mainWindow?.focus()
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        mainWindow?.destroy()
        app.quit()
      }
    }
  ])

  tray.setToolTip('TaskManager')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })
}

function registerGlobalShortcut(): void {
  globalShortcut.register('Control+Shift+T', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.focus()
    } else {
      mainWindow?.show()
      mainWindow?.focus()
    }
    mainWindow?.webContents.send('show-tasks-tab')
  })

  globalShortcut.register('Control+Shift+Q', () => {
    mainWindow?.destroy()
    app.quit()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('load-tasks', () => {
    try {
      if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath, 'utf-8')
        return JSON.parse(data)
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
    return []
  })

  ipcMain.on('save-tasks', (_event, tasks) => {
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2))
    } catch (error) {
      console.error('Error saving tasks:', error)
    }
  })

  ipcMain.on('show-window', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })

  ipcMain.on('hide-window', () => {
    mainWindow?.hide()
  })

  ipcMain.on('minimize-window', () => {
    mainWindow?.minimize()
  })

  ipcMain.on('show-tasks-tab', () => {
    mainWindow?.webContents.send('show-tasks-tab')
  })

  ipcMain.on('close-app', () => {
    mainWindow?.destroy()
    app.quit()
  })

  createWindow()
  createTray()
  registerGlobalShortcut()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // Keep running in system tray on all platforms
})

app.on('before-quit', () => {
  globalShortcut.unregisterAll()
  tray?.destroy()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
