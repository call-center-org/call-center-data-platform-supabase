-- 测试数据

-- 插入测试数据包
INSERT INTO lead_packages (name, source, region, grade, total_leads, cost_per_lead, package_type, package_level) VALUES
('淮安-1105-高中-5000', '抖音', '淮安', '高中', 5000, 2.5, 'N', 'N'),
('南京-1106-初中-3000', '快手', '南京', '初中', 3000, 2.0, 'N', 'N'),
('苏州-1107-高中-8000', '抖音', '苏州', '高中', 8000, 3.0, 'N', 'N')
ON CONFLICT DO NOTHING;

-- 插入测试线索
INSERT INTO leads (phone, total_call_count, connected_call_count, is_success, intention_level) VALUES
('13800138001', 3, 2, true, 'A'),
('13800138002', 5, 3, false, 'B'),
('13800138003', 2, 1, false, 'C'),
('13800138004', 4, 4, true, 'A'),
('13800138005', 1, 0, false, 'D')
ON CONFLICT DO NOTHING;

-- 插入测试座席
INSERT INTO agents (account, agent_group, called_number, connected_number, success_number) VALUES
('淮安职场-小黄', '淮安职场-高中A-组', 150, 80, 10),
('淮安职场-小李', '淮安职场-高中A-组', 200, 120, 15),
('南京职场-小王', '南京职场-初中B-组', 180, 100, 12)
ON CONFLICT DO NOTHING;

