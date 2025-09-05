const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库路径
const dbPath = path.join(__dirname, '../../database/tasks.db');
const db = new sqlite3.Database(dbPath);

console.log('🌱 开始添加测试数据...');

// 测试任务数据
const sampleTasks = [
  {
    title: '设计系统架构',
    description: '设计整个任务管理系统的技术架构，包括前端、后端和数据库设计',
    status: 'completed',
    priority: 'high',
    assignee: '张三'
  },
  {
    title: '实现用户认证功能',
    description: '开发用户登录、注册和权限管理功能',
    status: 'in_progress',
    priority: 'high',
    assignee: '李四'
  },
  {
    title: '创建任务管理界面',
    description: '设计和实现任务列表、添加、编辑和删除功能的用户界面',
    status: 'in_progress',
    priority: 'medium',
    assignee: '王五'
  },
  {
    title: '编写API文档',
    description: '为所有后端API接口编写详细的文档说明',
    status: 'pending',
    priority: 'medium',
    assignee: '赵六'
  },
  {
    title: '性能优化',
    description: '优化前端加载速度和后端响应时间',
    status: 'pending',
    priority: 'low',
    assignee: '张三'
  },
  {
    title: '单元测试编写',
    description: '为核心功能模块编写单元测试用例',
    status: 'pending',
    priority: 'medium',
    assignee: '李四'
  },
  {
    title: '部署配置',
    description: '配置生产环境的部署流程和CI/CD管道',
    status: 'pending',
    priority: 'low',
    assignee: '王五'
  },
  {
    title: '用户体验测试',
    description: '进行用户界面和交互体验的测试和优化',
    status: 'pending',
    priority: 'medium',
    assignee: '赵六'
  }
];

db.serialize(() => {
  // 清空现有数据（可选）
  console.log('🗑️  清理现有测试数据...');
  db.run('DELETE FROM tasks WHERE assignee IN ("张三", "李四", "王五", "赵六")', (err) => {
    if (err) {
      console.error('❌ 清理数据失败:', err.message);
    } else {
      console.log('✅ 现有测试数据已清理');
    }
  });

  // 插入测试数据
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, status, priority, assignee, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', '-' || ? || ' days'), datetime('now', '-' || ? || ' days'))
  `);

  sampleTasks.forEach((task, index) => {
    const daysAgo = Math.floor(Math.random() * 7) + 1; // 1-7天前
    stmt.run(
      task.title,
      task.description,
      task.status,
      task.priority,
      task.assignee,
      daysAgo,
      Math.max(0, daysAgo - Math.floor(Math.random() * 3)) // 更新时间稍晚一些
    );
  });

  stmt.finalize((err) => {
    if (err) {
      console.error('❌ 插入测试数据失败:', err.message);
    } else {
      console.log(`✅ 成功插入 ${sampleTasks.length} 条测试数据`);
      
      // 显示插入的数据统计
      db.all('SELECT status, priority, COUNT(*) as count FROM tasks GROUP BY status, priority', (err, rows) => {
        if (!err) {
          console.log('\n📊 数据统计:');
          rows.forEach(row => {
            console.log(`   ${row.status} (${row.priority}): ${row.count} 个任务`);
          });
        }
      });
      
      // 显示所有任务
      db.all('SELECT id, title, status, priority, assignee FROM tasks ORDER BY created_at DESC', (err, rows) => {
        if (!err) {
          console.log('\n📋 当前任务列表:');
          rows.forEach(row => {
            console.log(`   [${row.id}] ${row.title} - ${row.status} (${row.priority}) - ${row.assignee}`);
          });
        }
      });
    }
  });
});

// 关闭数据库连接
db.close((err) => {
  if (err) {
    console.error('❌ 关闭数据库连接失败:', err.message);
  } else {
    console.log('\n✅ 测试数据添加完成！');
  }
});

process.on('SIGINT', () => {
  console.log('\n🛑 数据添加被中断');
  db.close();
  process.exit(0);
});