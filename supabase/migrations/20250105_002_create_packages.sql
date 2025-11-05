-- 创建数据包表
CREATE TABLE IF NOT EXISTS lead_packages (
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
  package_type VARCHAR(10) DEFAULT 'N' NOT NULL,
  package_level VARCHAR(10) DEFAULT 'N' NOT NULL,
  available_leads INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_packages_internal_code ON lead_packages(internal_code);
CREATE INDEX IF NOT EXISTS idx_packages_package_type ON lead_packages(package_type);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON lead_packages(created_at);

-- 注释
COMMENT ON TABLE lead_packages IS '线索数据包表';
COMMENT ON COLUMN lead_packages.internal_code IS '内部代号（数据包前缀）';
COMMENT ON COLUMN lead_packages.package_type IS '数据包类型: N=付费, P=练习';
COMMENT ON COLUMN lead_packages.package_level IS '当前层级: N/O1-O99/P1-P99';

