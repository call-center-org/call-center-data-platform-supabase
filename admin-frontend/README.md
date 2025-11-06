# Admin Frontend

基于 React + Vite + Tailwind CSS 的管理前端，用于可视化管理 Supabase 数据平台。

## ✨ 功能规划

- 📊 首页看板：核心指标、快捷入口、实时提醒
- 📱 线索管理：读取 `leads` 表，支持筛选、批量操作（TODO #6）
- 📦 数据包管理：展示 `lead_packages`，提供层级分配与登记入口
- 👥 座席表现：关联 `agents` 指标，展示排行与趋势
- ⚙️ 系统设置：管理 Supabase 密钥、微服务回调等配置

当前版本为骨架阶段，主要完成：

- 全局布局（侧边栏 + 顶部导航 + 响应式支持）
- React Router 路由结构以及页面占位
- React Query、Supabase SDK 初始化
- Tailwind CSS 基础样式配置

## 🚀 快速开始

```bash
cd admin-frontend
cp .env.example .env  # 写入 Supabase URL 与 Anon Key
npm install
npm run dev
```

### 环境变量

在 `.env` 中配置：

```bash
VITE_SUPABASE_URL=https://urfsdaxibssuvgbukqxa.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

## 📁 目录结构

```
src/
├── components/
│   └── layout/        # 布局组件（侧边栏、顶部导航、布局容器）
├── pages/             # 页面占位
├── lib/supabaseClient.js
├── App.jsx            # 路由定义
└── main.jsx           # React 入口，包含 QueryClientProvider
```

## 🗺️ 下一步

- [ ] TODO #6：在 `Leads` 页面接入 Supabase 数据表
- [ ] TODO #7：实现 CRUD、筛选、批量操作
- [ ] TODO #8：加入 Supabase Realtime，提供实时刷新
- [ ] 图表与指标组件化，联动各微服务数据

欢迎直接在主仓库顶层 README 的「管理前端」章节中补充更多开发规范。
