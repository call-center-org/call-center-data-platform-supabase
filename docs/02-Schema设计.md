# 数据库 Schema 设计

> 基于现有线索管理系统的数据库结构，迁移到 Supabase

---

## 📊 核心表设计

### 1. leads（线索表）

**设计理念**：以电话号码为主键，存储每个线索的聚合数据

```sql
CREATE TABLE leads (
  -- 主键
  phone VARCHAR(20) PRIMARY KEY,
  
  -- 聚合通话统计
  total_call_count INTEGER DEFAULT 0 NOT NULL,
  connected_call_count INTEGER DEFAULT 0 NOT NULL,
  total_call_duration INTEGER DEFAULT 0 NOT NULL,
  
  -- 最新通话信息
  latest_call_time TIMESTAMPTZ,
  latest_agent_name VARCHAR(100),
  intention_level VARCHAR(20),
  intention_tag VARCHAR(100),
  
  -- 最新通话录音和详情
  recording_url TEXT,
  detail TEXT,
  
  -- 转化状态
  is_success BOOLEAN DEFAULT FALSE NOT NULL,
  has_wechat BOOLEAN DEFAULT FALSE NOT NULL,
  wechat_id VARCHAR(100),
  wechat_added_date DATE,
  
  -- 标签（JSON）
  tags JSONB,
  
  -- 跟进状态
  is_followed BOOLEAN DEFAULT FALSE NOT NULL,
  follow_count INTEGER DEFAULT 0 NOT NULL,
  latest_follow_time TIMESTAMPTZ,
  next_follow_time TIMESTAMPTZ,
  
  -- 来源追踪
  source_package_id INTEGER,
  source_task_id INTEGER,
  first_call_time TIMESTAMPTZ,
  
  -- 数据质量
  is_valid BOOLEAN DEFAULT TRUE NOT NULL,
  invalid_reason VARCHAR(200),
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 索引
CREATE INDEX idx_leads_latest_call_time ON leads(latest_call_time);
CREATE INDEX idx_leads_is_success ON leads(is_success);
CREATE INDEX idx_leads_has_wechat ON leads(has_wechat);
CREATE INDEX idx_leads_intention_level ON leads(intention_level);
CREATE INDEX idx_leads_source_package ON leads(source_package_id);
```

**字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| phone | VARCHAR(20) | 电话号码（主键） |
| total_call_count | INTEGER | 总拨打次数 |
| connected_call_count | INTEGER | 总接通次数 |
| is_success | BOOLEAN | 是否成功单（关键指标） |
| intention_level | VARCHAR(20) | 意向等级（A/B/C/D） |
| tags | JSONB | 标签集合（灵活存储） |

---

### 2. lead_packages（数据包表）

**设计理念**：管理线索数据包的生命周期和层级

```sql
CREATE TABLE lead_packages (
  -- 主键
  id SERIAL PRIMARY KEY,
  
  -- 外部ID
  external_package_id INTEGER UNIQUE,
  
  -- 基本信息
  name VARCHAR(200) NOT NULL,
  source VARCHAR(100) NOT NULL,
  industry VARCHAR(100),
  region VARCHAR(100),
  grade VARCHAR(50),
  
  -- 数据包前缀管理
  internal_code VARCHAR(200) UNIQUE,
  first_task_prefix VARCHAR(200),
  
  -- 数据指标
  total_leads INTEGER DEFAULT 0,
  valid_leads INTEGER DEFAULT 0,
  contact_rate FLOAT DEFAULT 0.0,
  interest_rate FLOAT DEFAULT 0.0,
  
  -- 成本相关
  cost_per_lead FLOAT DEFAULT 1.0,
  total_cost FLOAT DEFAULT 0.0,
  
  -- 数据包层级管理
  package_type VARCHAR(10) DEFAULT 'N' NOT NULL, -- N=付费, P=练习
  package_level VARCHAR(10) DEFAULT 'N' NOT NULL, -- N/O1-O99/P1-P99
  available_leads INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 索引
CREATE INDEX idx_packages_internal_code ON lead_packages(internal_code);
CREATE INDEX idx_packages_package_type ON lead_packages(package_type);
CREATE INDEX idx_packages_created_at ON lead_packages(created_at);
```

---

### 3. agents（座席表）

```sql
CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  
  -- 基本信息
  account VARCHAR(100) UNIQUE NOT NULL,
  agent_group VARCHAR(200),
  
  -- 统计字段
  called_number INTEGER DEFAULT 0,
  connected_number INTEGER DEFAULT 0,
  inbound_number INTEGER DEFAULT 0,
  loss_number INTEGER DEFAULT 0,
  not_takeover_number INTEGER DEFAULT 0,
  takeover_number INTEGER DEFAULT 0,
  success_number INTEGER DEFAULT 0,
  followed_number INTEGER DEFAULT 0,
  
  -- 时长统计
  agent_talk_duration INTEGER DEFAULT 0,
  avg_takeover_duration INTEGER DEFAULT 0,
  online_duration FLOAT DEFAULT 0.0,
  total_talk_duration INTEGER DEFAULT 0,
  billing_duration INTEGER DEFAULT 0,
  
  -- 费用
  cost FLOAT DEFAULT 0.0,
  sms_count INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_agents_account ON agents(account);
```

---

### 4. dial_tasks（外呼任务表）

```sql
CREATE TABLE dial_tasks (
  id SERIAL PRIMARY KEY,
  
  -- 关联数据包
  package_id INTEGER REFERENCES lead_packages(id),
  
  -- 冠客任务信息
  guanke_task_id INTEGER UNIQUE,
  task_name VARCHAR(200) NOT NULL,
  state INTEGER, -- 1-5 任务状态
  
  -- 任务统计
  total_number INTEGER DEFAULT 0,
  called_number INTEGER DEFAULT 0,
  connected_number INTEGER DEFAULT 0,
  success_number INTEGER DEFAULT 0,
  
  -- 任务层级
  target_level VARCHAR(10), -- N/O1-O99/P1-P99
  
  -- 匹配状态
  match_status VARCHAR(20) DEFAULT 'pending', -- pending/matched/idle
  is_idle BOOLEAN DEFAULT FALSE,
  
  -- 时间信息
  created_date DATE,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_tasks_package_id ON dial_tasks(package_id);
CREATE INDEX idx_tasks_guanke_id ON dial_tasks(guanke_task_id);
CREATE INDEX idx_tasks_match_status ON dial_tasks(match_status);
CREATE INDEX idx_tasks_created_date ON dial_tasks(created_date);
```

---

### 5. call_records（通话记录表）

```sql
CREATE TABLE call_records (
  id SERIAL PRIMARY KEY,
  
  -- 关联任务
  task_id INTEGER REFERENCES dial_tasks(id),
  
  -- 冠客话单ID
  guanke_cdr_id VARCHAR(100) UNIQUE,
  
  -- 通话基本信息
  phone VARCHAR(20),
  duration INTEGER DEFAULT 0,
  call_time TIMESTAMPTZ,
  
  -- 意向标签
  grade VARCHAR(20), -- AF5/AS1/AS2等
  is_success BOOLEAN DEFAULT FALSE,
  
  -- 座席信息
  assigned_agent VARCHAR(100),
  agent_group VARCHAR(200),
  
  -- 录音和详情
  audio_url TEXT,
  conversation_detail TEXT,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_call_records_task_id ON call_records(task_id);
CREATE INDEX idx_call_records_phone ON call_records(phone);
CREATE INDEX idx_call_records_guanke_cdr_id ON call_records(guanke_cdr_id);
CREATE INDEX idx_call_records_call_time ON call_records(call_time);
```

---

### 6. calculator_history（计算器历史）

```sql
CREATE TABLE calculator_history (
  id SERIAL PRIMARY KEY,
  
  -- 计算参数
  current_leads INTEGER,
  daily_consumption INTEGER,
  support_days INTEGER,
  monthly_purchase INTEGER,
  
  -- 计算结果
  predicted_shortage INTEGER,
  recommended_purchase INTEGER,
  
  -- 备注
  note TEXT,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

---

## 🔧 数据库函数

### 自动更新 updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 应用到所有表
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_packages_updated_at 
  BEFORE UPDATE ON lead_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at 
  BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dial_tasks_updated_at 
  BEFORE UPDATE ON dial_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_call_records_updated_at 
  BEFORE UPDATE ON call_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 📈 高级查询函数

### 数据包层级分布统计

```sql
CREATE OR REPLACE FUNCTION get_package_level_distribution(pkg_id INTEGER)
RETURNS TABLE (
  level VARCHAR(10),
  lead_count INTEGER,
  percentage FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(dt.target_level, 'N') as level,
    COUNT(DISTINCT cr.phone)::INTEGER as lead_count,
    (COUNT(DISTINCT cr.phone)::FLOAT / NULLIF(SUM(COUNT(DISTINCT cr.phone)) OVER (), 0) * 100) as percentage
  FROM dial_tasks dt
  LEFT JOIN call_records cr ON dt.id = cr.task_id
  WHERE dt.package_id = pkg_id
  GROUP BY dt.target_level
  ORDER BY level;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔐 Row Level Security (RLS)

### 启用 RLS

```sql
-- 启用行级安全
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- 允许所有认证用户读取
CREATE POLICY "允许认证用户读取线索"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

-- 允许认证用户创建
CREATE POLICY "允许认证用户创建线索"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 允许认证用户更新自己创建的数据
CREATE POLICY "允许认证用户更新线索"
  ON leads FOR UPDATE
  TO authenticated
  USING (true);
```

---

## 🌐 Supabase REST & Realtime

- 每张表都会自动暴露 REST 端点，例如：`GET https://<project>.supabase.co/rest/v1/leads?select=*`。
- 在前端直接使用 `@supabase/supabase-js` 客户端即可完成 CRUD 操作，无需自建后台。
- Realtime 默认对所有表生效，前端可以通过 \`supabase.channel('leads')\` 订阅 `postgres_changes` 获取新增、更新、删除推送。
- 若启用了 Row Level Security，需要为 REST / Realtime 用户创建相应策略，确保匿名密钥只能执行允许的操作。

---

## 📊 表关系图

```
lead_packages (数据包)
    ↓ 1:N
dial_tasks (任务)
    ↓ 1:N
call_records (话单)
    ↓ N:1
leads (线索汇总)

agents (座席) ← N:1 → call_records
```

---

**最后更新**: 2025-11-06

