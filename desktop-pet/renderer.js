const petWrap = document.getElementById('pet-wrap');
const bubble = document.getElementById('bubble');
const panel = document.getElementById('input-panel');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');
const cancelBtn = document.getElementById('cancel');
const chatBtn = document.getElementById('chat-btn');
const sparkles = document.getElementById('sparkles');

// 萌宠主动打招呼的话（占位，后续可换成知识库里的金句）
const TIPS = [
  '嗨，我在这里陪着你 👋',
  '今天有什么想聊聊的吗？',
  '双击我，或者点右下角的小气泡，说说你的心事吧 💛',
  '累了吗？先陪我一起深呼吸一下 🌿',
  '无论发生什么，你都不是一个人。✨',
];

let bubbleTimer = null;

// ---------- 拖拽 vs 点击 ----------
let dragState = null;

petWrap.addEventListener('mousedown', async (e) => {
  if (e.button !== 0) return; // 只处理左键
  const winPos = await window.petAPI.getPosition();
  dragState = {
    startX: e.screenX,
    startY: e.screenY,
    winX: winPos.x,
    winY: winPos.y,
    moved: false,
  };
});

window.addEventListener('mousemove', (e) => {
  if (!dragState) return;
  const dx = e.screenX - dragState.startX;
  const dy = e.screenY - dragState.startY;
  if (Math.abs(dx) + Math.abs(dy) > 5) dragState.moved = true;
  if (dragState.moved) {
    window.petAPI.move(dragState.winX + dx, dragState.winY + dy);
  }
});

window.addEventListener('mouseup', () => {
  if (!dragState) return;
  const wasDrag = dragState.moved;
  dragState = null;
  if (!wasDrag) onPetClick();
});

petWrap.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  window.petAPI.showContextMenu();
});

petWrap.addEventListener('dblclick', () => openPanel());

// ---------- 交互 ----------
function onPetClick() {
  petWrap.classList.remove('happy');
  // 强制重排以重新触发动画
  void petWrap.offsetWidth;
  petWrap.classList.add('happy');
  setTimeout(() => petWrap.classList.remove('happy'), 600);
  spawnSparkles();
  showTip();
  doWave();
}

function spawnSparkles() {
  const emojis = ['✨', '⭐', '💫', '🦋', '🌸'];
  for (let i = 0; i < 5; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    s.style.left = 35 + Math.random() * 30 + '%';
    s.style.animationDelay = Math.random() * 0.25 + 's';
    sparkles.appendChild(s);
    setTimeout(() => s.remove(), 1800);
  }
}

function showTip() {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  showBubble(tip, { autoHide: 4200 });
}

// 挥手打招呼
function doWave() {
  petWrap.classList.remove('waving');
  void petWrap.offsetWidth;
  petWrap.classList.add('waving');
  setTimeout(() => petWrap.classList.remove('waving'), 2200);
}

// 俏皮地眨一下眼（单眼）
function doWink() {
  petWrap.classList.remove('wink');
  void petWrap.offsetWidth;
  petWrap.classList.add('wink');
  setTimeout(() => petWrap.classList.remove('wink'), 650);
}

// 回答时的开心反应：跳跃 + 星尘
function doAnswerReaction() {
  petWrap.classList.remove('waving', 'jump');
  void petWrap.offsetWidth;
  petWrap.classList.add('jump');
  setTimeout(() => petWrap.classList.remove('jump'), 800);
  spawnSparkles();
}

// ---------- 气泡 + 打字机 ----------
function showBubble(text, { autoHide = 0 } = {}) {
  clearTimeout(bubbleTimer);
  bubble.classList.remove('hidden');
  const bw = estimateWidth(text);                 // 1) 先想好内容 → 定宽度
  applySize(bw, estimateHeight(text, bw));        // 2) 按宽度撑高窗口，避免打字时被裁
  typewriter(text, bubble);
  setTimeout(fitBubble, text.length * 38 + 150);  // 3) 打完后按真实高度精确贴合
  if (autoHide > 0) {
    bubbleTimer = setTimeout(() => {
      bubble.classList.add('hidden');
      fitBubble();
    }, autoHide);
  }
}

function typewriter(text, el, speed = 38) {
  let i = 0;
  el.textContent = '';
  clearInterval(el._tw);
  el._tw = setInterval(() => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) clearInterval(el._tw);
  }, speed);
}

// —— 根据内容自适应尺寸（先想好内容 → 定宽度 → 再撑高窗口）——
const BUBBLE_BOTTOM = 250;  // 与 styles.css 里 .bubble 的 bottom 一致
const TOP_MARGIN = 24;      // 气泡顶部预留空隙
const H_MARGIN = 30;        // 窗口左右留白（气泡到窗口边缘）
const BUBBLE_MIN = 200;     // 气泡最小宽度（不小于小精灵）
const BUBBLE_MAX = 380;     // 气泡最大宽度
const BUBBLE_PAD = 36;      // 左右 padding(16*2) + 边框(2*2) + 余量
const LINE_HEIGHT = 23;     // 估算行高
const BASE_HEIGHT = 620;    // 与 main.js 初始高度一致（面板/空窗复位用）
const PANEL_WIDTH = 440;    // 输入面板打开时的窗口宽度（面板 380 + 留白）

// 用 canvas 精确测量文字宽度（与 .bubble 的 14px 字体保持一致）
const measurer = document.createElement('canvas').getContext('2d');
measurer.font = '14px "PingFang SC", "Microsoft YaHei", "Segoe UI", system-ui, sans-serif';
const measureW = (s) => measurer.measureText(s).width;

// 1) 先根据内容估算气泡宽度（取最宽一行，夹在 min/max 之间）
function estimateWidth(text) {
  let maxW = 0;
  for (const line of String(text).split('\n')) {
    maxW = Math.max(maxW, measureW(line));
  }
  return Math.max(BUBBLE_MIN, Math.min(BUBBLE_MAX, Math.ceil(maxW) + BUBBLE_PAD));
}

// 2) 给定气泡宽度后，估算换行后的高度
function estimateHeight(text, bubbleWidth) {
  const contentWidth = Math.max(bubbleWidth - BUBBLE_PAD, 1);
  let lines = 0;
  for (const raw of String(text).split('\n')) {
    lines += Math.max(1, Math.ceil(measureW(raw) / contentWidth));
  }
  return lines * LINE_HEIGHT + 30; // 30 = padding + 余量
}

// 让主进程调整窗口（水平中心不动、底部固定向上生长），并同步气泡宽度/可显示高度
async function applySize(bubbleWidth, contentHeight) {
  const winW = bubbleWidth + H_MARGIN * 2;
  const winH = BUBBLE_BOTTOM + contentHeight + TOP_MARGIN;
  const { width: finalW, height: finalH } = await window.petAPI.setSize(winW, winH);
  const bw = finalW - H_MARGIN * 2;
  bubble.style.width = bw + 'px';
  const avail = finalH - BUBBLE_BOTTOM - TOP_MARGIN;
  bubble.style.maxHeight = Math.max(avail, 120) + 'px';
  bubble.style.overflowY = 'hidden';
  return { bw, avail };
}

async function fitBubble() {
  if (bubble.classList.contains('hidden')) {
    await applySize(BUBBLE_MIN, 0);
    return;
  }
  const bw = estimateWidth(bubble.textContent);
  bubble.style.width = bw + 'px';           // 先定宽，让换行稳定
  const bh = bubble.scrollHeight;           // 该宽度下的真实高度
  const { avail } = await applySize(bw, bh);
  bubble.style.overflowY = bh > avail ? 'auto' : 'hidden';
}

// ---------- 输入面板 ----------
async function openPanel() {
  bubble.classList.add('hidden');
  await window.petAPI.setSize(PANEL_WIDTH, BASE_HEIGHT); // 复位窗口，给输入面板腾空间
  panel.classList.remove('hidden');
  input.focus();
}

function closePanel() {
  panel.classList.add('hidden');
  input.value = '';
}

chatBtn.addEventListener('click', openPanel);
cancelBtn.addEventListener('click', closePanel);

// 右键菜单里“说说你的心事”也会触发
window.petAPI.onOpenInput(() => openPanel());

sendBtn.addEventListener('click', async () => {
  const text = input.value.trim();
  if (!text) return;
  closePanel();
  showBubble('让我想想……', { autoHide: 0 });
  doWink(); // 思考时俏皮眨眼

  // 占位实现：真正的回复来自 main.js 的 pet:submit（后续接混合引擎）
  setTimeout(async () => {
    const reply = await window.petAPI.submit(text);
    doAnswerReaction(); // 回答时开心跳跃 + 星尘
    showBubble(reply, { autoHide: 0 });
  }, 1100);
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

// ---------- 启动时先打个招呼 ----------
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    showTip();
    doWave();
  }, 600);
});

// 偶尔俏皮地眨一下眼
setInterval(() => {
  if (Math.random() < 0.6) doWink();
}, 9000);
