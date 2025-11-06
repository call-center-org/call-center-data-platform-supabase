-- 创建自动更新 updated_at 的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 leads 表创建触发器
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为 lead_packages 表创建触发器
DROP TRIGGER IF EXISTS update_lead_packages_updated_at ON lead_packages;
CREATE TRIGGER update_lead_packages_updated_at 
  BEFORE UPDATE ON lead_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为 agents 表创建触发器
DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at 
  BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

