const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库初始化
const dbPath = path.join(__dirname, '../database/tasks.db');
const db = new sqlite3.Database(dbPath);

// 启用外键约束
db.run('PRAGMA foreign_keys = ON');

// 从init.sql文件初始化数据库
const initSqlPath = path.join(__dirname, '../database/init.sql');
if (fs.existsSync(initSqlPath)) {
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    db.serialize(() => {
        db.exec(initSql, (err) => {
            if (err) {
                console.error('数据库初始化错误:', err.message);
            } else {
                console.log('数据库初始化完成');
            }
        });
    });
} else {
    console.warn('未找到init.sql文件，跳过数据库初始化');
}

// API 路由

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '服务器运行正常' });
});

// ===== 用户相关API =====

// 获取所有用户
app.get('/api/users', (req, res) => {
  db.all('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 获取单个用户
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }
    res.json(row);
  });
});

// ===== 项目相关API =====

// 获取所有项目
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 获取单个项目
app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: '项目不存在' });
      return;
    }
    res.json(row);
  });
});

// 创建项目
app.post('/api/projects', (req, res) => {
  const { name, description, start_date, end_date, status, created_by } = req.body;
  
  if (!name || !created_by) {
    res.status(400).json({ error: '项目名称和创建者ID不能为空' });
    return;
  }

  const stmt = db.prepare('INSERT INTO projects (name, description, start_date, end_date, status, created_by) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(name, description || null, start_date || null, end_date || null, status || 'active', created_by, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, description, status: status || 'active' });
  });
  stmt.finalize();
});

// ===== 任务相关API =====

// 获取所有任务（使用视图获取关联信息）
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM task_details ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 获取单个任务详情
app.get('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM task_details WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: '任务不存在' });
      return;
    }
    res.json(row);
  });
});

// 创建新任务
app.post('/api/tasks', (req, res) => {
  const { title, description, project_id, assignee_id, priority, due_date, estimated_hours, created_by } = req.body;
  
  if (!title || !created_by) {
    res.status(400).json({ error: '任务标题和创建者ID不能为空' });
    return;
  }

  const stmt = db.prepare('INSERT INTO tasks (title, description, project_id, assignee_id, priority, due_date, estimated_hours, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  stmt.run(title, description || null, project_id || null, assignee_id || null, priority || 'medium', due_date || null, estimated_hours || null, created_by, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, title, description, status: 'pending' });
  });
  stmt.finalize();
});

// 更新任务
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, project_id, assignee_id, priority, due_date, estimated_hours, actual_hours } = req.body;
  
  const stmt = db.prepare(`
    UPDATE tasks 
    SET title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        project_id = COALESCE(?, project_id),
        assignee_id = COALESCE(?, assignee_id),
        priority = COALESCE(?, priority),
        due_date = COALESCE(?, due_date),
        estimated_hours = COALESCE(?, estimated_hours),
        actual_hours = COALESCE(?, actual_hours),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  
  stmt.run(title, description, status, project_id, assignee_id, priority, due_date, estimated_hours, actual_hours, id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: '任务不存在' });
      return;
    }
    res.json({ message: '任务更新成功' });
  });
  stmt.finalize();
});

// 删除任务
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: '任务不存在' });
      return;
    }
    res.json({ message: '任务删除成功' });
  });
  stmt.finalize();
});

// ===== 任务评论API =====

// 获取任务的评论
app.get('/api/tasks/:id/comments', (req, res) => {
  const { id } = req.params;
  db.all('SELECT c.*, u.username FROM task_comments c JOIN users u ON c.user_id = u.id WHERE c.task_id = ? ORDER BY c.created_at DESC', [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 添加任务评论
app.post('/api/task-comments', (req, res) => {
  const { task_id, user_id, content } = req.body;
  
  if (!task_id || !user_id || !content) {
    res.status(400).json({ error: '任务ID、用户ID和评论内容不能为空' });
    return;
  }

  const stmt = db.prepare('INSERT INTO task_comments (task_id, user_id, content) VALUES (?, ?, ?)');
  stmt.run(task_id, user_id, content, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, task_id, user_id, content });
  });
  stmt.finalize();
});

// ===== 项目统计API =====

// 获取项目统计信息
app.get('/api/project-stats', (req, res) => {
  db.all('SELECT * FROM project_stats', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  db.close((err) => {
    if (err) {
      console.error('关闭数据库连接时出错:', err.message);
    } else {
      console.log('数据库连接已关闭');
    }
    process.exit(0);
  });
});