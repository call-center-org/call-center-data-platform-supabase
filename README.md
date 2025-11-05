# Call Center Data Platform - Supabase

> **统一数据中心** - 基于 Supabase 的微服务数据平台

---

## 📋 项目简介

本项目是 [Call Center Organization](https://github.com/call-center-org) 的**统一数据中心**，为所有微服务提供：

- 📊 **统一的数据库**（PostgreSQL）
- 🔐 **统一的认证系统**（Supabase Auth）
- 📡 **自动生成的 REST API**（无需手写 CRUD）
- ⚡ **实时数据同步**（WebSocket）
- 📁 **文件存储服务**（录音、文档等）
- 🎨 **可视化管理界面**（本仓库的管理前端）

---

## 🏗️ 项目定位

### 为什么需要这个项目？

在微服务架构中，我们有多个子系统：
- 📦 线索管理系统
- 📊 外呼数据系统
- 🖥️ 桌面小部件
- 📈 未来更多微服务...

**之前的问题**：
- ❌ 每个服务各自管理数据库
- ❌ 数据不互通，需要复杂的 API 对接
- ❌ 每个服务都要写大量 CRUD 代码
- ❌ 数据同步困难

**现在的解决方案**：
- ✅ 统一到 Supabase 数据平台
- ✅ 所有服务共享同一数据库
- ✅ 自动生成 REST/GraphQL API
- ✅ 实时数据同步

---

## 🛠️ 技术栈

### 后端（Supabase）
- **数据库**: PostgreSQL 15
- **认证**: Supabase Auth
- **存储**: Supabase Storage
- **API**: Auto-generated REST + GraphQL
- **实时**: PostgreSQL Realtime

### 前端（管理界面）
- **框架**: React 18 + Vite 5
- **样式**: Tailwind CSS 3
- **SDK**: @supabase/supabase-js
- **路由**: React Router DOM 6
- **状态管理**: React Hooks + SWR

---

## 📁 项目结构

```
call-center-data-platform-supabase/
├── README.md                    # 本文档
├── .env.example                 # 环境变量模板
├── .gitignore
│
├── docs/                        # 文档目录
│   ├── 01-项目规划.md
│   ├── 02-Schema设计.md
│   ├── 03-迁移计划.md
│   ├── 04-API使用指南.md
│   └── 05-最佳实践.md
│
├── supabase/                    # Supabase 配置
│   ├── migrations/              # SQL 迁移文件
│   │   ├── 20250105_001_create_leads.sql
│   │   ├── 20250105_002_create_packages.sql
│   │   └── ...
│   ├── functions/               # Edge Functions
│   └── seed.sql                # 测试数据
│
├── admin-frontend/              # 管理前端
│   ├── src/
│   │   ├── components/         # React 组件
│   │   ├── pages/              # 页面
│   │   ├── utils/              # 工具函数
│   │   │   └── supabaseClient.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── scripts/                     # 工具脚本
    ├── export-schema.py        # 从现有数据库导出 Schema
    ├── import-to-supabase.py   # 导入数据到 Supabase
    └── migrate-data.py         # 数据迁移脚本
```

---

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/call-center-org/call-center-data-platform-supabase.git
cd call-center-data-platform-supabase
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
VITE_SUPABASE_URL=https://urfsdaxibssuvgbukqxa.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 启动管理前端

```bash
cd admin-frontend
npm install
npm run dev
```

访问：http://localhost:5173

---

## 📊 数据库设计

### 核心表

| 表名 | 说明 | 主键 |
|------|------|------|
| `leads` | 线索表 | `phone` (电话号码) |
| `lead_packages` | 数据包表 | `id` |
| `dial_tasks` | 外呼任务表 | `id` |
| `call_records` | 通话记录表 | `id` |
| `agents` | 座席表 | `id` |
| `devices` | 设备表 | `id` |
| `calculator_history` | 计算器历史表 | `id` |

详细设计见：[docs/02-Schema设计.md](./docs/02-Schema设计.md)

---

## 🔌 如何在其他项目中使用

### 方法 1：直接使用 Supabase SDK（推荐）

```javascript
// 在任何前端项目中
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://urfsdaxibssuvgbukqxa.supabase.co',
  'your-anon-key'
)

// 读取线索数据
const { data: leads } = await supabase
  .from('leads')
  .select('*')
  .eq('is_success', true)

// 创建数据包
const { data } = await supabase
  .from('lead_packages')
  .insert([{ name: '测试数据包', source: '抖音' }])
```

### 方法 2：使用 REST API

```bash
curl 'https://urfsdaxibssuvgbukqxa.supabase.co/rest/v1/leads?select=*' \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"
```

### 方法 3：直接连接 PostgreSQL

```python
import psycopg2

conn = psycopg2.connect(
    host="db.urfsdaxibssuvgbukqxa.supabase.co",
    database="postgres",
    user="postgres",
    password="your-db-password",
    port="5432"
)
```

---

## 📈 迁移计划

### Phase 1：验证期（Week 1-2）
- [x] 创建 Supabase 项目
- [ ] 导入数据库 Schema
- [ ] 创建管理前端
- [ ] 验证 CRUD 功能
- [ ] 验证实时更新

### Phase 2：迁移期（Week 3-4）
- [ ] 迁移测试数据
- [ ] 线索管理系统对接
- [ ] 外呼数据系统对接
- [ ] 桌面小部件对接

### Phase 3：清理期（Week 5-6）
- [ ] 删除冗余 API 代码
- [ ] 优化数据库查询
- [ ] 性能测试
- [ ] 文档完善

详细计划见：[docs/03-迁移计划.md](./docs/03-迁移计划.md)

---

## 🎯 核心优势

| 对比项 | 之前（Flask + PostgreSQL） | 现在（Supabase） |
|--------|--------------------------|-----------------|
| CRUD API | 需要手写 50+ 个端点 | 自动生成 ✅ |
| 认证系统 | 需要写 JWT 逻辑 | 内置 Auth ✅ |
| 实时更新 | 需要 WebSocket 服务器 | 内置 Realtime ✅ |
| 文件存储 | 需要配置 OSS | 内置 Storage ✅ |
| API 文档 | 需要手写 | 自动生成 ✅ |
| 数据库管理 | 命令行 | 可视化界面 ✅ |
| 代码量 | ~2500 行 | ~500 行 ✅ |

---

## 📚 相关链接

- **Supabase 项目**: https://urfsdaxibssuvgbukqxa.supabase.co
- **Supabase Dashboard**: https://supabase.com/dashboard/project/urfsdaxibssuvgbukqxa
- **API 文档**: https://urfsdaxibssuvgbukqxa.supabase.co/rest/v1/
- **组织主页**: https://github.com/call-center-org

---

## 🤝 相关项目

- [线索管理系统](https://github.com/call-center-org/call-center-lead-management)
- [外呼数据系统](https://github.com/call-center-org/call-center-business-data)
- [桌面小部件](https://github.com/call-center-org/call-center-widget-mac)
- [文档仓库](https://github.com/call-center-org/call-center-docs)

---

## 📞 联系方式

**维护者**: Tom (@tom88115)  
**团队**: 江苏职场呼叫中心

---

## 📄 许可证

MIT License

---

**最后更新**: 2025-01-05  
**版本**: v0.1.0 (验证期)

