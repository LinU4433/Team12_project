const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 数据库路径
const dbPath = path.join(__dirname, '../../database/tasks.db');

console.log('🔄 开始重置数据库...');

// 检查数据库文件是否存在
if (fs.existsSync(dbPath)) {
  console.log('📁 发现现有数据库文件');
  
  // 备份现有数据库
  const backupPath = path.join(__dirname, '../../database/tasks_backup_' + Date.now() + '.db');
  try {
    fs.copyFileSync(dbPath, backupPath);
    console.log(`💾 数据库已备份到: ${backupPath}`);
  } catch (err) {
    console.error('❌ 备份数据库失败:', err.message);
  }
  
  // 删除现有数据库
  try {
    fs.unlinkSync(dbPath);
    console.log('🗑️  现有数据库已删除');
  } catch (err) {
    console.error('❌ 删除数据库失败:', err.message);
    process.exit(1);
  }
} else {
  console.log('📁 未发现现有数据库文件');
}

// 创建新的数据库
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('🏗️  创建新的数据库表...');
  
  // 创建任务表
  db.run(`CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    assignee TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ 创建任务表失败:', err.message);
    } else {
      console.log('✅ 任务表创建成功');
    }
  });

  // 创建用户表（为将来扩展准备）
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ 创建用户表失败:', err.message);
    } else {
      console.log('✅ 用户表创建成功');
    }
  });

  // 创建项目表（为将来扩展准备）
  db.run(`CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error('❌ 创建项目表失败:', err.message);
    } else {
      console.log('✅ 项目表创建成功');
    }
  });

  // 创建索引以提高查询性能
  db.run('CREATE INDEX idx_tasks_status ON tasks(status)', (err) => {
    if (err) {
      console.error('❌ 创建状态索引失败:', err.message);
    } else {
      console.log('✅ 任务状态索引创建成功');
    }
  });

  db.run('CREATE INDEX idx_tasks_priority ON tasks(priority)', (err) => {
    if (err) {
      console.error('❌ 创建优先级索引失败:', err.message);
    } else {
      console.log('✅ 任务优先级索引创建成功');
    }
  });

  db.run('CREATE INDEX idx_tasks_assignee ON tasks(assignee)', (err) => {
    if (err) {
      console.error('❌ 创建分配人索引失败:', err.message);
    } else {
      console.log('✅ 任务分配人索引创建成功');
    }
  });
});

// 关闭数据库连接
db.close((err) => {
  if (err) {
    console.error('❌ 关闭数据库连接失败:', err.message);
  } else {
    console.log('\n✅ 数据库重置完成！');
    console.log(`📍 新数据库位置: ${dbPath}`);
    console.log('\n💡 提示:');
    console.log('   - 运行 "npm run db:seed" 添加测试数据');
    console.log('   - 运行 "npm start" 启动服务器');
  }
});

process.on('SIGINT', () => {
  console.log('\n🛑 数据库重置被中断');
  db.close();
  process.exit(0);
});