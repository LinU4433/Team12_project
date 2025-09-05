const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 连接到数据库
const dbPath = path.join(__dirname, 'tasks.db');
const db = new sqlite3.Database(dbPath);

console.log('=== 数据库测试脚本 ===\n');

// 测试函数
function testDatabase() {
    // 1. 测试表结构
    console.log('1. 检查数据库表结构:');
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
        if (err) {
            console.error('查询表结构失败:', err.message);
            return;
        }
        console.log('已创建的表:');
        tables.forEach(table => console.log(`- ${table.name}`));
        console.log();
        
        // 2. 测试视图
        console.log('2. 检查数据库视图:');
        db.all("SELECT name FROM sqlite_master WHERE type='view' ORDER BY name", (err, views) => {
            if (err) {
                console.error('查询视图失败:', err.message);
                return;
            }
            console.log('已创建的视图:');
            views.forEach(view => console.log(`- ${view.name}`));
            console.log();
            
            // 3. 测试示例数据 - 用户表
            console.log('3. 测试用户表数据:');
            db.all('SELECT id, username, email, role FROM users LIMIT 2', (err, users) => {
                if (err) {
                    console.error('查询用户数据失败:', err.message);
                    return;
                }
                console.log('用户数据样例:');
                users.forEach(user => console.log(`  - ${user.id}: ${user.username} (${user.email}, ${user.role})`));
                console.log();
                
                // 4. 测试示例数据 - 项目表
                console.log('4. 测试项目表数据:');
                db.all('SELECT id, name, status, created_by FROM projects LIMIT 2', (err, projects) => {
                    if (err) {
                        console.error('查询项目数据失败:', err.message);
                        return;
                    }
                    console.log('项目数据样例:');
                    projects.forEach(project => console.log(`  - ${project.id}: ${project.name} (${project.status}, 创建者ID: ${project.created_by})`));
                    console.log();
                    
                    // 5. 测试视图 - 任务详情
                    console.log('5. 测试任务详情视图:');
                    db.all('SELECT id, title, status, assignee_name, project_name FROM task_details LIMIT 2', (err, tasks) => {
                        if (err) {
                            console.error('查询任务详情失败:', err.message);
                            return;
                        }
                        console.log('任务详情样例:');
                        tasks.forEach(task => console.log(`  - ${task.id}: ${task.title} (${task.status}, 负责人: ${task.assignee_name}, 项目: ${task.project_name})`));
                        console.log();
                        
                        // 6. 测试视图 - 项目统计
                        console.log('6. 测试项目统计视图:');
                        db.all('SELECT id, name, total_tasks, completed_tasks, member_count FROM project_stats LIMIT 2', (err, stats) => {
                            if (err) {
                                console.error('查询项目统计失败:', err.message);
                                return;
                            }
                            console.log('项目统计样例:');
                            stats.forEach(stat => console.log(`  - ${stat.id}: ${stat.name} (总任务: ${stat.total_tasks}, 已完成: ${stat.completed_tasks}, 成员数: ${stat.member_count})`));
                            console.log();
                            
                            // 7. 测试外键约束
                            console.log('7. 测试外键约束:');
                            testForeignKeyConstraint();
                        });
                    });
                });
            });
        });
    });
}

// 测试外键约束
function testForeignKeyConstraint() {
    // 尝试插入一个无效的assignee_id
    const stmt = db.prepare('INSERT INTO tasks (title, assignee_id, created_by) VALUES (?, ?, ?)');
    stmt.run('测试外键约束', 999, 1, function(err) {
        if (err) {
            console.log('✓ 外键约束测试成功：无法插入不存在的用户ID');
            console.log(`  错误信息: ${err.message}`);
        } else {
            console.log('✗ 外键约束测试失败：成功插入了不存在的用户ID');
            // 清理测试数据
            db.run('DELETE FROM tasks WHERE id = ?', [this.lastID]);
        }
        console.log();
        
        // 完成测试
        console.log('=== 数据库测试完成 ===');
        db.close();
    });
    stmt.finalize();
}

// 运行测试
console.log('开始测试数据库...');
// 先检查是否已经有测试数据，如果没有则初始化
checkAndInitData();

function checkAndInitData() {
    db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
        if (err) {
            console.error('检查数据失败:', err.message);
            db.close();
            return;
        }
        
        if (result.count === 0) {
            console.log('数据库中没有数据，正在从init.sql初始化...');
            const fs = require('fs');
            const initSqlPath = path.join(__dirname, 'init.sql');
            if (fs.existsSync(initSqlPath)) {
                const initSql = fs.readFileSync(initSqlPath, 'utf8');
                db.serialize(() => {
                    db.exec(initSql, (err) => {
                        if (err) {
                            console.error('初始化数据失败:', err.message);
                            db.close();
                            return;
                        }
                        console.log('数据初始化完成');
                        testDatabase();
                    });
                });
            } else {
                console.error('未找到init.sql文件');
                db.close();
            }
        } else {
            console.log(`数据库中已有数据，共${result.count}个用户`);
            testDatabase();
        }
    });
}