# 🚀 快速开始指南

> 10 分钟完成 Supabase 数据库初始化

---

## ✅ 前置条件

- [x] Supabase 项目已创建
- [x] 项目 URL: `https://urfsdaxibssuvgbukqxa.supabase.co`
- [x] Anon Key 已获取

---

## 📋 Step 1: 在 Supabase 中执行 SQL

### 1.1 访问 SQL Editor

1. 打开 Supabase Dashboard
2. 进入项目：https://supabase.com/dashboard/project/urfsdaxibssuvgbukqxa
3. 点击左侧菜单：**SQL Editor**

### 1.2 执行迁移文件（按顺序）

**第 1 步：创建 leads 表**

复制 `supabase/migrations/20250105_001_create_leads.sql` 的内容，粘贴到 SQL Editor，点击 **Run**

**第 2 步：创建 lead_packages 表**

复制 `supabase/migrations/20250105_002_create_packages.sql` 的内容，粘贴到 SQL Editor，点击 **Run**

**第 3 步：创建 agents 表**

复制 `supabase/migrations/20250105_003_create_agents.sql` 的内容，粘贴到 SQL Editor，点击 **Run**

**第 4 步：创建触发器**

复制 `supabase/migrations/20250105_004_create_triggers.sql` 的内容，粘贴到 SQL Editor，点击 **Run**

**第 5 步：插入测试数据（可选）**

复制 `supabase/seed.sql` 的内容，粘贴到 SQL Editor，点击 **Run**

---

## ✅ Step 2: 验证数据库

### 2.1 检查表是否创建成功

在 SQL Editor 中运行：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

应该看到：
- ✅ leads
- ✅ lead_packages
- ✅ agents

### 2.2 检查测试数据

```sql
-- 检查数据包
SELECT * FROM lead_packages;

-- 检查线索
SELECT * FROM leads;

-- 检查座席
SELECT * FROM agents;
```

如果能看到数据，说明初始化成功！🎉

---

## 🎨 Step 3: 配置环境变量（准备开发）

### 3.1 创建 .env 文件

```bash
cd call-center-data-platform-supabase
cp .env.example .env
```

### 3.2 填写真实的密钥

编辑 `.env` 文件：

```env
VITE_SUPABASE_URL=https://urfsdaxibssuvgbukqxa.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZnNkYXhpYnNzdXZnYnVrcXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTcyNjUsImV4cCI6MjA3NzkzMzI2NX0.Tty22c9dhUj1t8Uj_u3JNbxr5SwVk4OgNRizCnhmyiw
```

⚠️ **注意**：不要将 `.env` 文件提交到 Git（已在 `.gitignore` 中排除）

---

## 🧪 Step 4: 测试 Supabase 连接

### 4.1 使用 curl 测试 REST API

```bash
curl 'https://urfsdaxibssuvgbukqxa.supabase.co/rest/v1/leads?select=*' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZnNkYXhpYnNzdXZnYnVrcXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTcyNjUsImV4cCI6MjA3NzkzMzI2NX0.Tty22c9dhUj1t8Uj_u3JNbxr5SwVk4OgNRizCnhmyiw" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZnNkYXhpYnNzdXZnYnVrcXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTcyNjUsImV4cCI6MjA3NzkzMzI2NX0.Tty22c9dhUj1t8Uj_u3JNbxr5SwVk4OgNRizCnhmyiw"
```

如果返回 JSON 数据，说明 API 正常！

### 4.2 在浏览器中测试

访问：https://urfsdaxibssuvgbukqxa.supabase.co/rest/v1/lead_packages?select=*

（需要在 Headers 中添加 apikey，推荐用 Postman）

---

## 🎯 下一步

现在数据库已经准备好了！接下来：

### 选项 A：创建管理前端（推荐）

继续开发 React 管理界面，可视化操作数据

```bash
# 后续会创建 admin-frontend 目录
cd admin-frontend
npm install
npm run dev
```

### 选项 B：直接在其他项目中使用

在线索管理系统或其他项目中接入 Supabase：

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://urfsdaxibssuvgbukqxa.supabase.co',
  'your-anon-key'
)

// 立即可用！
const { data } = await supabase.from('leads').select('*')
```

---

## 📚 参考资料

- [Supabase 官方文档](https://supabase.com/docs)
- [JavaScript SDK 文档](https://supabase.com/docs/reference/javascript/introduction)
- [SQL Editor 使用指南](https://supabase.com/docs/guides/database/overview)

---

## ⚠️ 常见问题

### Q: SQL 执行失败怎么办？

A: 检查是否按顺序执行，如果已经创建过表，可以先删除：

```sql
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS lead_packages CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
```

然后重新执行迁移文件。

### Q: 如何重置数据库？

A: 在 Supabase Dashboard → Settings → Database → Reset Database

⚠️ 注意：这会删除所有数据！

---

**准备好了吗？开始执行 SQL 吧！** 🚀

