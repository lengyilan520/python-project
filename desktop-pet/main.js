const { app, BrowserWindow, ipcMain, Menu, screen } = require('electron');
const path = require('path');
const fs = require('fs');

// 加载 .env（可选本地配置，如 DEEPSEEK_API_KEY —— 放在 desktop-pet/.env 里，一行一个 key=value）
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key && process.env[key] === undefined) process.env[key] = val;
    }
  }
} catch (err) {
  console.error('读取 .env 失败：', err);
}

const { respond } = require('./engine.js');

let win = null;
const BASE_HEIGHT = 620;

function createWindow() {
  const { workArea } = screen.getPrimaryDisplay();

  win = new BrowserWindow({
    width: 440,
    height: BASE_HEIGHT,
    x: workArea.x + workArea.width - 480,
    y: workArea.y + workArea.height - 660,
    transparent: true,
    frame: false,
    resizable: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // screen-saver 级别置顶，确保萌宠始终浮在其它窗口之上
  win.setAlwaysOnTop(true, 'screen-saver');
  win.loadFile('index.html');
}

function buildContextMenu() {
  return Menu.buildFromTemplate([
    {
      label: '💬 说说你的心事',
      click: () => win && win.webContents.send('pet:open-input'),
    },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() },
  ]);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// —— 拖拽移动窗口 ——
ipcMain.on('pet:move', (_e, { x, y }) => {
  if (win && !win.isDestroyed()) win.setPosition(Math.round(x), Math.round(y));
});

ipcMain.handle('pet:get-position', () => {
  if (!win || win.isDestroyed()) return { x: 0, y: 0 };
  const [x, y] = win.getPosition();
  return { x, y };
});

// —— 根据内容自适应窗口尺寸（水平中心不动、底部固定向上生长）——
ipcMain.handle('pet:set-size', (_e, { width, height }) => {
  if (!win || win.isDestroyed()) return null;
  const { workArea } = screen.getPrimaryDisplay();
  const bounds = win.getBounds();

  const maxW = Math.min(workArea.width - 40, 600);
  const maxH = Math.min(workArea.height - 40, 1100);
  const targetW = Math.round(Math.min(Math.max(width || bounds.width, 260), maxW));
  const targetH = Math.round(Math.min(Math.max(height || BASE_HEIGHT, BASE_HEIGHT), maxH));

  // 保持窗口中心不动（水平），保持底部不动（垂直，向上生长）
  const centerX = bounds.x + bounds.width / 2;
  const bottomY = bounds.y + bounds.height;

  if (Math.abs(targetW - bounds.width) >= 2 || Math.abs(targetH - bounds.height) >= 2) {
    win.setBounds({
      x: Math.round(centerX - targetW / 2),
      y: Math.round(bottomY - targetH),
      width: targetW,
      height: targetH,
    });
  }
  return { width: targetW, height: targetH };
});

// —— 右键菜单 ——
ipcMain.on('pet:context-menu', () => {
  buildContextMenu().popup({ window: win });
});

// —— 提交困惑（混合引擎：DeepSeek 深度理解，未配 key 时走离线分类）——
ipcMain.handle('pet:submit', (_e, text) => respond(text));
