# nicep 项目进度

## 项目概述
一个无压力的数字空间——在这里，你不需要表现给谁看。

---

## 当前状态

### ✅ 已完成

| 模块 | 功能 | 状态 |
|------|------|------|
| 基础架构 | Vite + React 19 + TypeScript + shadcn/ui + Tailwind | 完成 |
| 首页入口 | 4种情绪状态选择 | 完成 |
| 接纳路径 | 身体锚点呼吸引导 | 完成 |
| 接纳路径 | 三层允许练习 | 完成 |
| 接纳路径 | 轻量叙事输入 | 完成 |
| 启动路径 | 最小意义探测 | 完成 |
| 启动路径 | 身体感受追问 | 完成 |
| 启动路径 | 荒谬地小的行动拆解 | 完成 |
| 苏格拉底式提问 | 负面词检测与重构引导 | 完成 |
| 退出仪式 | 模板告别语 + DeepSeek AI 生成 | 完成 |
| 延留空间 | 呼吸静默页面 | 完成 |
| 话墙 | 历史记录 + 导出功能 | 完成 |
| 本地记忆 | localStorage 记住昨日记录 | 完成 |
| **i18n 国际化** | **react-i18next 集成** | **完成** |
| i18n | 中文源文件 (182 条字符串) | 完成 |
| i18n | 英文翻译 | 完成 |
| i18n | 西班牙文翻译 | 完成 |
| i18n | 语言切换器（首页右上角） | 完成 |
| i18n | 字体自适应（中文/西文） | 完成 |
| i18n | 负面词检测多语言支持 | 完成 |
| i18n | 微小版本关键词匹配多语言 | 完成 |
| i18n | DeepSeek 批量翻译脚本 (`npm run translate`) | 完成 |
| **部署** | **Vercel 生产部署** | **完成** |
| 部署 | vercel.json 配置 | 完成 |
| 部署 | SPA rewrite 规则 | 完成 |

### 🔧 技术细节

- **框架**: Vite + React 19 SPA（状态驱动屏幕切换，无 URL 路由）
- **样式**: 暖色调设计 (#faf6f1), 呼吸动画效果, Tailwind CSS v3
- **i18n**: react-i18next, localStorage 存储语言偏好, 浏览器语言自动检测
- **翻译文件**: `src/i18n/locales/` 下 zh-CN.json / en.json / es.json（182 keys 完全同步）
- **AI**: DeepSeek API 生成退出告别语（仅中文，未来可扩展）
- **数据**: localStorage 会话记录 + 话墙（最近 7 天，最多 100 条）
- **组件库**: shadcn/ui (new-york style), Radix UI, Framer Motion
- **Vite 入口**: `index.html` → `<div id="root">` → `src/main.tsx`
- **独立 HTML 版**: `standalone.html`（原始原型，不做 i18n）

### 📦 部署信息

- **线上地址**: https://nicep.vercel.app
- **Vercel 项目**: langaijuns-projects/nicep
- **仓库**: https://github.com/langaijun/nicep
- **远程方式**: SSH (git@github.com:langaijun/nicep.git)
- **当前分支**: main
- **构建命令**: `npm run build` (tsc -b && vite build)
- **输出目录**: dist/

---

## i18n 架构文档

### 文件结构
```
src/
├── i18n/
│   ├── index.ts              # i18next 初始化 + 语言切换监听
│   └── locales/
│       ├── zh-CN.json         # 中文（源语言，182 keys）
│       ├── en.json            # 英文
│       └── es.json            # 西班牙文（tú 亲切语气）
├── scripts/
│   └── translate.ts           # DeepSeek 批量翻译脚本
├── components/
│   └── LanguageSwitcher.tsx   # 语言切换组件
├── screens/                   # 12 个屏幕组件（全部使用 useTranslation）
└── hooks/
    └── useMemory.ts           # 多语言负面词检测 + 微小版本生成
```

### 使用方式
```tsx
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
<p>{t('home.title1')}</p>
<p>{t('sparkBody.recall', { text: '...' })}</p>
```

### 添加新语言的流程
1. 复制 zh-CN.json 结构，创建新语言 JSON
2. 在 `src/i18n/index.ts` 的 resources 中注册
3. 在 `LanguageSwitcher.tsx` 的 LANGUAGES 中添加
4. 在 `useMemory.ts` 的 NEGATIVE_WORDS 和 TINY_KEYWORDS 中添加对应语言映射
5. 或使用 `npm run translate` 自动生成初稿

---

## SEO 方案

详细方案见 `SEO_PLAN.md`。

### 核心方向
- **对齐 Calm**：放松/减压/呼吸/平静，不做 self-reflection/journaling/tracking
- **蓝海切入点**：gentle relaxation, pressure-free space, mental break, unwind app
- **差异化**：Calm 需要你"做冥想"，NiceP 只需要你"待一会儿"

### 待做
- [ ] 选定域名（推荐 nicep.app / nicep.com）
- [ ] SEO 着陆页需 SSR/SSG（当前 SPA 无法被搜索引擎爬取）
- [ ] 创建博客 + 着陆页（Astro 或迁移到 Next.js）
- [ ] 写第一批内容（呼吸练习、放松技巧）
- [ ] Google Search Console 配置

---

## 规划中

### 📋 待探索方向

- [x] 多语言支持（中文/英文/西班牙文 — 已完成）
- [ ] 自定义域名绑定
- [ ] SEO 着陆页 + 博客系统（需 SSR/SSG）
- [ ] 深色模式
- [ ] 语音输入/输出
- [ ] 统计数据可视化（可选）
- [ ] ExitScreen AI 对话多语言支持

---

## 设计理念

这不是一个"自我提升工具"，而是一个"允许自己待一会儿"的地方。

- **无评分**: 不收集分数，不显示进度条
- **无比较**: 不与他人数据对比
- **无强制**: 每一步都可以随时退出

---

## 更新日志

### 2026-07-19 (更新)
- **SSR/SSG 迁移完成**：Astro 5 混合架构（静态 SEO 页面 + React SPA）
- 三语言 SEO 首页（`/` 中文、`/en` 英文、`/es` 西班牙文）
- 三个功能着陆页（`/relax`、`/breathe`、`/unwind`）
- 博客系统搭建（MDX + 2 篇文章 + Article Schema）
- XML Sitemap 自动生成（@astrojs/sitemap）
- 清理 53 个未使用的 shadcn/ui 组件（CSS 包减少 84%）
- 移除 138 个未使用的 npm 包
- 完整 SEO 标签：title/description/OG/Twitter/hreflang/canonical/JSON-LD
- SPA 迁移到 `/app` 路径，Vite base 设为 `/app/`
- 构建命令改为 `astro build && vite build`
- Vercel 路由更新（`/app/*` SPA 兜底）

### 2026-07-19 (i18n)
- 完整 i18n 国际化实施（react-i18next + 三语言 + 翻译脚本）
- 12 个 Screen 组件 + useMemory hook 全部国际化
- 修复 8 个 i18n 相关 bug（语言代码归一化、翻译键同步、标点符号等）
- Vercel 生产部署成功 (https://nicep.vercel.app)
- 竞品 SEO 分析完成（7 个竞品）
- 制定 Calm 方向 SEO 方案（详见 SEO_PLAN.md）
- 备份 standalone.html（原始 HTML 原型）

### 2026-05-09
- 初始化项目
- 推送到 GitHub
- 创建进度文档
