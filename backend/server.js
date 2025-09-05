const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库初始化
const dbPath = path.join(__dirname, '../database/tasks.db');
const db = new sqlite3.Database(dbPath);

// 创建任务表
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    assignee TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// API 路由

// 获取所有任务
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 创建新任务
app.post('/api/tasks', (req, res) => {
  const { title, description, assignee } = req.body;
  
  if (!title) {
    res.status(400).json({ error: '任务标题不能为空' });
    return;
  }

  const stmt = db.prepare('INSERT INTO tasks (title, description, assignee) VALUES (?, ?, ?)');
  stmt.run(title, description || '', assignee || '', function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, title, description, assignee, status: 'pending' });
  });
  stmt.finalize();
});

// 更新任务
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, assignee } = req.body;
  
  const stmt = db.prepare(`
    UPDATE tasks 
    SET title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        assignee = COALESCE(?, assignee),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  
  stmt.run(title, description, status, assignee, id, function(err) {
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

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '服务器运行正常' });
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