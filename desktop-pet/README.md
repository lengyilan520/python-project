# 桌面萌宠（原型）

一只常驻桌面的温馨小萌宠：它会在角落里陪着你，听你诉说困惑，给你安慰与建议。

## 运行

```bash
cd desktop-pet
npm install
npm start
```

> 首次 `npm install` 会下载 Electron，体积较大（约 100MB），请耐心等待。
>
> **常见问题**：如果报错 `Cannot read properties of undefined (reading 'whenReady')`，说明环境变量 `ELECTRON_RUN_AS_NODE` 被设成了 `1`（VSCode 扩展宿主环境常见）。先取消它再启动：
>
> - Git Bash：`unset ELECTRON_RUN_AS_NODE && npm start`
> - PowerShell：`Remove-Item Env:ELECTRON_RUN_AS_NODE; npm start`
> - CMD：`set ELECTRON_RUN_AS_NODE= && npm start`

## 怎么玩

| 操作 | 效果 |
| --- | --- |
| 按住左键拖动萌宠 | 移动它的位置 |
| 单击萌宠 | 开心反应 + 撒花 + 一句暖心的话 |
| 双击萌宠 / 点 💬 按钮 | 打开输入框 |
| 右键萌宠 | 弹出菜单（说心事 / 退出） |
| 输入困惑后回车或点「告诉它 💛」 | 萌宠“思考”后回复安慰的话 |

## 目录结构

```
desktop-pet/
├── main.js       Electron 主进程：透明无边框悬浮窗、拖拽、右键菜单、pet:submit 接口
├── preload.js    contextBridge 桥接，暴露 petAPI 给渲染进程
├── index.html    萌宠 UI（SVG 形象 + 气泡 + 输入面板）
├── styles.css    温馨风格样式与动画（呼吸 / 眨眼 / 点击反应）
├── renderer.js   渲染进程交互（拖拽、点击、打字机、提交流程）
├── engine.js     混合回复引擎（识别困境类型 → DeepSeek/离线 → 分类安慰 + 具体方法）
├── categories.json 困境分类（家庭/学业/人际/情感/工作/健康/经济/自我/情绪 → 安慰 + 解决方法）
├── knowledge.json 知识库（作品/理论 → 思想内核 + 金句）
└── README.md
```

## 回复引擎（已接入）

萌宠的回复由 `engine.js` 生成，先**识别困境类型**，再针对性给出「共情安慰 + 具体解决方法」：

1. **DeepSeek API**（推荐，可选）：配置了 `DEEPSEEK_API_KEY` 时，交给 DeepSeek 深度理解，回答最贴合处境、最具体。
2. **离线分类**（默认，无需配置）：没配 API 时，识别困境类型（家庭 / 学业 / 人际 / 情感 / 工作 / 健康 / 经济 / 自我成长 / 情绪 9 类），按类型给出「安慰 + 金句 + 可执行的解决方法」，不再是空话。
3. **Claude API**（备选）：配了 `ANTHROPIC_API_KEY`（且没有 DeepSeek key）时走 Claude。
4. **通用兜底**：实在识别不了时，引导用户多说一点。

### 开启 DeepSeek API（推荐，可选）

不配置也能用（离线分类已经能给具体方法）。想更聪明、更贴合处境：

```bash
# Git Bash
export DEEPSEEK_API_KEY="sk-..."        # 换成你的 key（platform.deepseek.com）
# 可选：指定模型（默认 deepseek-chat）
export DEEPSEEK_MODEL="deepseek-chat"
npm start
```

### 新增困境类型

往 `categories.json` 的 `categories` 数组加一条即可，字段：`id`、`label`（类型名）、`keywords`（触发词）、`comfort`（共情安慰）、`solutions`（2–4 条具体方法）。

### 新增作品 / 理论

直接往 `knowledge.json` 的 `entries` 数组里加一条即可，字段说明：

| 字段 | 含义 |
| --- | --- |
| `id` | 唯一标识（英文小写 + 连字符） |
| `source` | 作品 / 理论名（回复里引用金句时会带上） |
| `type` | `影视` / `书籍` / `思想` |
| `theme` | 一句话主题 |
| `keywords` | 触发它的词（用户输入里包含这些词就会命中，越长越具体） |
| `coreIdea` | 思想内核（归纳） |
| `quotes` | 金句数组（可空） |
| `comfort` | 安慰的话 |
| `solution` | 结合处境的行动建议 |

以后补充新影视时，重点填好 `keywords`（贴近大家会怎么描述这个困惑），匹配就会更准。
