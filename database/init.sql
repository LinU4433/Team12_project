-- 团队任务管理系统数据库初始化脚本
-- 创建任务表
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    assignee TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建用户表（可选扩展）
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例数据
INSERT OR IGNORE INTO tasks (title, description, status, assignee, priority) VALUES
('设计数据库结构', '设计任务管理系统的数据库表结构', 'completed', '张三', 'high'),
('开发前端界面', '使用React开发用户界面', 'in_progress', '李四', 'high'),
('实现后端API', '使用Node.js和Express开发REST API', 'in_progress', '王五', 'high'),
('编写项目文档', '编写README和API文档', 'pending', '赵六', 'medium'),
('部署到服务器', '将应用部署到云服务器', 'pending', '张三', 'low');

-- 插入示例用户
INSERT OR IGNORE INTO users (username, email, role) VALUES
('张三', 'zhangsan@example.com', 'admin'),
('李四', 'lisi@example.com', 'member'),
('王五', 'wangwu@example.com', 'member'),
('赵六', 'zhaoliu@example.com', 'member');

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- 创建触发器自动更新 updated_at 字段
CREATE TRIGGER IF NOT EXISTS update_tasks_timestamp 
AFTER UPDATE ON tasks
FOR EACH ROW
BEGIN
    UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;