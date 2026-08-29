// engine.js —— 混合回复引擎 v2
// 1. 识别困境类型（家庭 / 学业 / 人际 / 情感 / 工作 / 健康 / 经济 / 自我成长 / 情绪）
// 2. 按类型给出「共情安慰 + 具体解决方法」，并用知识库金句润色
// 3. 配置了 DeepSeek API key 时，交给 DeepSeek 深度理解（更贴合处境）

let categories = [];
let entries = [];
try {
  categories = require('./categories.json').categories;
} catch (e) {
  console.error('加载困境分类失败：', e);
}
try {
  entries = require('./knowledge.json').entries;
} catch (e) {
  console.error('加载知识库失败：', e);
}

// 通用兜底安慰（完全没匹配上时使用）
const DEFAULT_REPLIES = [
  '我听到了，谢谢你愿意说给我听。💛 能说说具体发生了什么吗？我好更懂你一些。',
  '先抱抱你。🫂 你现在的感受都是真实的、被允许的。想多讲一点吗？',
  '辛苦了。能撑到现在，你已经做得很好了。✨ 具体是哪里让你难受呢？',
];

const DEEPSEEK_SYSTEM_PROMPT = [
  '你是一只温暖又务实的桌面萌宠，在陪伴一位正处在困境中、向你诉说烦恼的朋友。',
  '请严格按下面的要求回答（用中文，温暖、口语化，但一定要具体、有用，坚决不说空话套话）：',
  '1. 先判断对方在说哪类困境（家庭 / 学业 / 人际 / 情感 / 工作 / 健康 / 经济 / 自我成长 / 情绪等）。',
  '2. 用 1–2 句真诚地共情安慰，先接住情绪，不评判、不说教、不灌鸡汤。',
  '3. 给出 3–4 条【具体、可立即执行】的解决方法，每条都要清楚到「照着做就行」，禁止出现「想开点」「加油」「别想太多」这类空话。',
  '4. 如果自然合适，可以引用一句经典作品或思想的金句来安慰（如史铁生《我与地坛》、阿德勒《被讨厌的勇气》、路遥、黑塞、加缪、斯多葛学派、奥德赛时期等），不要生硬堆砌。',
  '输出格式：先一句共情，再分点列方法（1. 2. 3.），最后一句温暖的收尾。整体简洁，控制在 200–300 字。',
].join('\n');

const CLAUDE_SYSTEM_PROMPT = DEEPSEEK_SYSTEM_PROMPT;

// —— 困境类型识别：按关键词命中（长词权重更高） ——
function detectCategory(text) {
  const t = String(text || '').toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const c of categories) {
    let score = 0;
    for (const kw of c.keywords || []) {
      const k = kw.toLowerCase();
      if (t.includes(k)) score += k.length;
    }
    if (score > bestScore) {
      best = c;
      bestScore = score;
    }
  }
  return bestScore > 0 ? { category: best, score: bestScore } : null;
}

// —— 知识库金句匹配（用于润色，不决定类别） ——
function matchKnowledge(text) {
  const t = String(text || '').toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const entry of entries) {
    let score = 0;
    for (const kw of entry.keywords || []) {
      const k = kw.toLowerCase();
      if (t.includes(k)) score += k.length;
    }
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  return bestScore > 0 ? { entry: best, score: bestScore } : null;
}

// —— 离线回复：分类安慰 + 金句 + 具体方法 ——
function buildOfflineReply(text) {
  const cat = detectCategory(text);
  const kb = matchKnowledge(text);
  const parts = [];

  if (cat) parts.push(cat.category.comfort);
  else if (kb) parts.push(kb.entry.comfort);
  else return defaultReply();

  if (kb && kb.entry.quotes && kb.entry.quotes.length) {
    parts.push(`「${kb.entry.quotes[0]}」 —— ${kb.entry.source}`);
  }

  if (cat && cat.category.solutions && cat.category.solutions.length) {
    const list = cat.category.solutions.map((s, i) => `${i + 1}. ${s}`).join('\n');
    parts.push('💡 试试这样做：\n' + list);
  }
  return parts.join('\n\n');
}

function defaultReply() {
  return DEFAULT_REPLIES[Math.floor(Math.random() * DEFAULT_REPLIES.length)];
}

// —— DeepSeek API（OpenAI 兼容） ——
async function callDeepSeek(text) {
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: DEEPSEEK_SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`DeepSeek API 请求失败（${res.status}）：${detail}`);
  }
  const data = await res.json();
  const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  return content ? content.trim() : defaultReply();
}

// —— Claude API（备用） ——
async function callClaude(text) {
  const model = process.env.CLAUDE_MODEL || 'claude-sonnet-5';
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 600,
      system: CLAUDE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: text }],
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Claude API 请求失败（${res.status}）：${detail}`);
  }
  const data = await res.json();
  const content = data.content && data.content[0] && data.content[0].text;
  return content ? content.trim() : defaultReply();
}

// 对外统一入口：DeepSeek（或 Claude）优先 → 离线分类回复 → 通用兜底
async function respond(text) {
  if (process.env.DEEPSEEK_API_KEY) {
    try {
      return await callDeepSeek(text);
    } catch (e) {
      console.error('DeepSeek 调用失败，回退离线：', e);
    }
  } else if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await callClaude(text);
    } catch (e) {
      console.error('Claude 调用失败，回退离线：', e);
    }
  }
  return buildOfflineReply(text);
}

module.exports = { respond, detectCategory, matchKnowledge, buildOfflineReply };
