-- 创建线索表
CREATE TABLE IF NOT EXISTS leads (
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
CREATE INDEX IF NOT EXISTS idx_leads_latest_call_time ON leads(latest_call_time);
CREATE INDEX IF NOT EXISTS idx_leads_is_success ON leads(is_success);
CREATE INDEX IF NOT EXISTS idx_leads_has_wechat ON leads(has_wechat);
CREATE INDEX IF NOT EXISTS idx_leads_intention_level ON leads(intention_level);
CREATE INDEX IF NOT EXISTS idx_leads_source_package ON leads(source_package_id);

-- 注释
COMMENT ON TABLE leads IS '线索表 - 以电话号码为主键的学生家长线索';
COMMENT ON COLUMN leads.phone IS '电话号码（主键）';
COMMENT ON COLUMN leads.total_call_count IS '总拨打次数';
COMMENT ON COLUMN leads.connected_call_count IS '总接通次数';
COMMENT ON COLUMN leads.is_success IS '是否成功单';
COMMENT ON COLUMN leads.tags IS '标签集合（JSON）';

