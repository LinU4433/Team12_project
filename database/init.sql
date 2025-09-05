-- 团队任务管理系统数据库初始化脚本
-- SQLite版本: 3.x
-- 最后更新: 2025-09-05

-- 配置PRAGMA优化SQLite性能
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = -64000; -- 64MB缓存

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL CHECK (LENGTH(username) >= 2 AND LENGTH(username) <= 50),
    email TEXT UNIQUE NOT NULL CHECK (email LIKE '%@%'),
    password_hash TEXT NOT NULL, -- 存储密码哈希值
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK (LENGTH(name) >= 1 AND LENGTH(name) <= 100),
    description TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold')),
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 创建任务表
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    title TEXT NOT NULL CHECK (LENGTH(title) >= 1 AND LENGTH(title) <= 200),
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
    assignee_id INTEGER,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    estimated_hours REAL CHECK (estimated_hours > 0),
    actual_hours REAL CHECK (actual_hours >= 0),
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 创建任务评论表
CREATE TABLE IF NOT EXISTS task_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL CHECK (LENGTH(content) >= 1),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 创建项目成员表（多对多关系）
CREATE TABLE IF NOT EXISTS project_members (
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role TEXT DEFAULT 'contributor' CHECK (role IN ('manager', 'contributor')),
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建任务标签表
CREATE TABLE IF NOT EXISTS task_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL CHECK (LENGTH(name) >= 1 AND LENGTH(name) <= 50)
);

-- 创建任务-标签关联表（多对多关系）
CREATE TABLE IF NOT EXISTS task_tag_relations (
    task_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (task_id, tag_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES task_tags(id) ON DELETE CASCADE
);

-- 创建索引以提高查询性能
-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 项目表索引
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);

-- 任务表索引
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- 任务评论表索引
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_user_id ON task_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_created_at ON task_comments(created_at);

-- 项目成员表索引
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);

-- 触发器：自动更新updated_at字段
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_projects_timestamp 
AFTER UPDATE ON projects
FOR EACH ROW
BEGIN
    UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_tasks_timestamp 
AFTER UPDATE ON tasks
FOR EACH ROW
BEGIN
    UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_task_comments_timestamp 
AFTER UPDATE ON task_comments
FOR EACH ROW
BEGIN
    UPDATE task_comments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- 插入示例数据
-- 用户数据（密码哈希示例，实际项目中应使用bcrypt等工具生成）
INSERT OR IGNORE INTO users (username, email, password_hash, role) VALUES
('张三', 'zhangsan@example.com', 'hashed_password_1', 'admin'),
('李四', 'lisi@example.com', 'hashed_password_2', 'member'),
('王五', 'wangwu@example.com', 'hashed_password_3', 'member'),
('赵六', 'zhaoliu@example.com', 'hashed_password_4', 'member');

-- 项目数据
INSERT OR IGNORE INTO projects (name, description, status, created_by) VALUES
('团队任务管理系统开发', '开发一个基于React+Node.js+SQLite的任务管理系统', 'active', 1),
('系统文档编写', '编写用户手册和技术文档', 'active', 1);

-- 项目成员关联
INSERT OR IGNORE INTO project_members (project_id, user_id, role) VALUES
(1, 1, 'manager'),
(1, 2, 'contributor'),
(1, 3, 'contributor'),
(1, 4, 'contributor'),
(2, 4, 'manager');

-- 任务标签
INSERT OR IGNORE INTO task_tags (name) VALUES
('前端开发'),
('后端开发'),
('数据库'),
('文档编写'),
('测试'),
('部署');

-- 任务数据
INSERT OR IGNORE INTO tasks (project_id, title, description, status, assignee_id, priority, due_date, estimated_hours, created_by) VALUES
(1, '设计数据库结构', '设计任务管理系统的数据库表结构', 'completed', 1, 'high', '2025-09-10', 8, 1),
(1, '开发前端界面', '使用React开发用户界面', 'in_progress', 2, 'high', '2025-09-15', 20, 1),
(1, '实现后端API', '使用Node.js和Express开发REST API', 'in_progress', 3, 'high', '2025-09-15', 20, 1),
(2, '编写项目文档', '编写README和API文档', 'pending', 4, 'medium', '2025-09-20', 12, 1),
(1, '部署到服务器', '将应用部署到云服务器', 'pending', 1, 'low', '2025-09-25', 6, 1);

-- 任务标签关联
INSERT OR IGNORE INTO task_tag_relations (task_id, tag_id) VALUES
(1, 3),
(2, 1),
(3, 2),
(4, 4),
(5, 6);

-- 任务评论
INSERT OR IGNORE INTO task_comments (task_id, user_id, content) VALUES
(1, 1, '数据库结构设计已完成，包含用户、项目、任务等核心表'),
(2, 2, '前端界面已完成基本布局，正在实现组件'),
(3, 3, 'API框架搭建完成，正在实现各个端点');

-- 创建视图：任务详情视图（包含关联信息）
CREATE VIEW IF NOT EXISTS task_details AS
SELECT 
    t.id, 
    t.title, 
    t.description, 
    t.status, 
    t.priority, 
    t.due_date, 
    t.estimated_hours, 
    t.actual_hours, 
    t.created_at, 
    t.updated_at,
    u.username AS assignee_name,
    p.name AS project_name,
    creator.username AS creator_name
FROM tasks t
LEFT JOIN users u ON t.assignee_id = u.id
LEFT JOIN projects p ON t.project_id = p.id
LEFT JOIN users creator ON t.created_by = creator.id;

-- 创建视图：项目统计视图
CREATE VIEW IF NOT EXISTS project_stats AS
SELECT
    p.id,
    p.name,
    p.status,
    COUNT(t.id) AS total_tasks,
    SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks,
    SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) AS pending_tasks,
    SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_tasks,
    SUM(CASE WHEN t.status = 'blocked' THEN 1 ELSE 0 END) AS blocked_tasks,
    COUNT(DISTINCT pm.user_id) AS member_count
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
LEFT JOIN project_members pm ON p.id = pm.project_id
GROUP BY p.id, p.name, p.status;

-- 显示创建结果
SELECT '数据库初始化完成！创建的表结构：' AS message;
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;