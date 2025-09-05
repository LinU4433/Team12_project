# 团队任务管理系统 - 数据库设计文档

## 数据库概述

本项目使用SQLite作为数据库引擎，设计了一套完整的关系型数据库结构，用于支持团队任务管理系统的各项功能。

## 数据库文件结构

- `init.sql`: 数据库初始化脚本，包含表结构创建、索引、触发器、视图和示例数据
- `test_db.js`: 数据库测试脚本，用于验证数据库结构和功能
- `tasks.db`: SQLite数据库文件（运行时生成）

## 数据库设计

### 实体关系图 (ERD)

```
users       projects      task_tags
  |           |              |
  |           |              |
  v           v              v
users  <- project_members  task_tags
  |         |                  |
  |         |                  |
  v         v                  v
assignee_id project_id          |
    \         /                 |
     \       /                  |
      v     v                   |
      tasks ------------------- |
        |                       |
        |                       |
        v                       |
  task_comments                 |
                                |
                                |
                        task_tag_relations
```

### 核心表结构

#### 1. users (用户表)
- **id**: 用户ID (主键)
- **username**: 用户名 (唯一，2-50字符)
- **email**: 邮箱 (唯一，格式验证)
- **password_hash**: 密码哈希值
- **role**: 角色 (admin/member)
- **avatar_url**: 头像URL
- **created_at**: 创建时间
- **updated_at**: 更新时间
- **last_login**: 最后登录时间

#### 2. projects (项目表)
- **id**: 项目ID (主键)
- **name**: 项目名称 (1-100字符)
- **description**: 项目描述
- **start_date**: 开始日期
- **end_date**: 结束日期
- **status**: 项目状态 (active/completed/on_hold)
- **created_by**: 创建者ID (外键关联users表)
- **created_at**: 创建时间
- **updated_at**: 更新时间

#### 3. tasks (任务表)
- **id**: 任务ID (主键)
- **project_id**: 项目ID (外键关联projects表)
- **title**: 任务标题 (1-200字符)
- **description**: 任务描述
- **status**: 任务状态 (pending/in_progress/completed/blocked)
- **assignee_id**: 负责人ID (外键关联users表)
- **priority**: 优先级 (low/medium/high/urgent)
- **due_date**: 截止日期
- **estimated_hours**: 预估工时
- **actual_hours**: 实际工时
- **created_by**: 创建者ID (外键关联users表)
- **created_at**: 创建时间
- **updated_at**: 更新时间

#### 4. task_comments (任务评论表)
- **id**: 评论ID (主键)
- **task_id**: 任务ID (外键关联tasks表)
- **user_id**: 用户ID (外键关联users表)
- **content**: 评论内容 (至少1字符)
- **created_at**: 创建时间
- **updated_at**: 更新时间

#### 5. project_members (项目成员表 - 多对多关系)
- **project_id**: 项目ID (复合主键，外键关联projects表)
- **user_id**: 用户ID (复合主键，外键关联users表)
- **role**: 成员角色 (manager/contributor)
- **joined_at**: 加入时间

#### 6. task_tags (任务标签表)
- **id**: 标签ID (主键)
- **name**: 标签名称 (唯一，1-50字符)

#### 7. task_tag_relations (任务-标签关联表 - 多对多关系)
- **task_id**: 任务ID (复合主键，外键关联tasks表)
- **tag_id**: 标签ID (复合主键，外键关联task_tags表)

### 视图

#### 1. task_details (任务详情视图)
整合任务及其关联的用户和项目信息，便于查询完整的任务详情。

#### 2. project_stats (项目统计视图)
提供项目的统计信息，包括任务数量、状态分布和成员数量等。

### 索引

为常用查询字段创建了索引，以提高查询性能：
- 用户表：username, email
- 项目表：name, status, created_by
- 任务表：project_id, status, assignee_id, priority, due_date, created_by, created_at
- 任务评论表：task_id, user_id, created_at
- 项目成员表：user_id

### 触发器

为各表创建了自动更新`updated_at`字段的触发器，确保数据更新时时间戳自动刷新。

## 性能优化

1. **PRAGMA配置**：启用了WAL模式、外键约束和合理的缓存大小
2. **索引优化**：针对高频查询字段创建了适当的索引
3. **视图应用**：创建了常用查询的视图，简化查询逻辑
4. **数据完整性**：通过外键约束、CHECK约束和UNIQUE约束确保数据完整性

## 使用指南

### 初始化数据库

1. 确保项目已安装Node.js环境
2. 运行后端服务时，系统会自动从`init.sql`初始化数据库

```bash
cd ../backend
npm install
npm start
```

### 测试数据库

使用提供的测试脚本来验证数据库结构和功能：

```bash
cd database
node test_db.js
```

### 数据库迁移

如果需要更新数据库结构，请修改`init.sql`文件，然后重新初始化数据库。注意：重新初始化会清空现有数据，建议在开发环境下操作。

## 安全注意事项

1. 密码存储：使用哈希值存储密码，禁止明文存储
2. 外键约束：启用外键约束以维护数据完整性
3. 输入验证：所有用户输入应在应用层进行验证，然后再写入数据库
4. 定期备份：重要数据应定期进行备份

## 扩展建议

1. **全文搜索**：对于大型数据集，可以考虑添加全文搜索功能
2. **分区表**：如果数据量增长迅速，可以考虑对历史数据进行分区
3. **连接池**：在高并发环境下，考虑使用连接池管理数据库连接
4. **数据同步**：根据业务需求，可以考虑实现数据同步机制

## 版本历史

- **v1.0** (2025-09-05): 初始数据库设计完成，包含基本表结构和关系

---

*最后更新：2025-09-05*