-- 创建座席表
CREATE TABLE IF NOT EXISTS agents (
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

-- 索引
CREATE INDEX IF NOT EXISTS idx_agents_account ON agents(account);

-- 注释
COMMENT ON TABLE agents IS '座席表（对应冠客CSV：坐席维度数据）';
COMMENT ON COLUMN agents.account IS '座席账号（子账号）';
COMMENT ON COLUMN agents.agent_group IS '坐席组';

