const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 数据库路径
const dbDir = path.join(__dirname, '../../database');
const dbPath = path.join(dbDir, 'tasks.db');

// 确保数据库目录存在
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ 数据库目录已创建');
}

// 创建数据库连接
const db = new sqlite3.Database(dbPath);

console.log('🚀 开始初始化数据库...');

db.serialize(() => {
  // 创建任务表
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
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

  // 创建用户表（可选，为将来扩展准备）
  db.run(`CREATE TABLE IF NOT EXISTS users (
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

  // 创建项目表（可选，为将来扩展准备）
  db.run(`CREATE TABLE IF NOT EXISTS projects (
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

  // 为现有表添加priority字段（如果不存在）
  db.run(`ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'medium'`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('❌ 添加priority字段失败:', err.message);
    } else if (!err) {
      console.log('✅ priority字段添加成功');
    }
  });
});

// 关闭数据库连接
db.close((err) => {
  if (err) {
    console.error('❌ 关闭数据库连接失败:', err.message);
  } else {
    console.log('✅ 数据库初始化完成！');
    console.log(`📍 数据库位置: ${dbPath}`);
  }
});

process.on('SIGINT', () => {
  console.log('\n🛑 数据库初始化被中断');
  db.close();
  process.exit(0);
});