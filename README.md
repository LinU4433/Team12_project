# 团队任务管理系统

一个基于React + Node.js + SQLite的微型任务管理系统，适合四人小组协作开发。

## 👥 团队分工

| 成员 | 职责 | 分支 | 主要工作 |
|------|------|------|----------|
| **LJW** | 前端开发负责人 | `feature/frontend` | React界面开发、组件设计、用户体验优化 |
| **LWH** | 后端开发负责人 | `feature/backend` | Node.js API开发、业务逻辑实现、服务器优化 |
| **LZM** | 数据库设计负责人 | `feature/database` | 数据库结构设计、SQL脚本编写、性能调优 |
| **LZX** | 部署运维负责人 | `feature/deployment` | Docker配置、CI/CD搭建、服务器部署 |

## 项目概述

本项目是一个简单而实用的任务管理系统，支持任务的创建、分配、状态更新和删除功能。项目采用前后端分离架构，便于团队分工合作。

## 技术栈

### 前端 (Frontend)
- **React 18** - 用户界面框架
- **CSS3** - 样式设计
- **Fetch API** - HTTP请求

### 后端 (Backend)
- **Node.js** - 服务器运行环境
- **Express.js** - Web框架
- **SQLite3** - 轻量级数据库
- **CORS** - 跨域资源共享

### 部署 (Deployment)
- **Docker** - 容器化部署
- **Docker Compose** - 多容器编排

## 项目结构

```
Team_project/
├── frontend/                 # 前端模块
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskList.js
│   │   │   └── TaskList.css
│   │   ├── App.js
│   │   └── App.css
│   ├── package.json
│   └── Dockerfile
├── backend/                  # 后端模块
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── database/                 # 数据库模块
│   └── init.sql
├── deployment/               # 部署模块
│   └── docker-compose.yml
├── docs/                     # 文档目录
│   └── git-workflow.md
├── .gitignore
└── README.md
```

## 四人分工建议

### 👨‍💻 成员LJW - 前端开发负责人
**主要职责：**
- 负责React前端界面开发
- 组件设计和用户体验优化
- 前端状态管理和API集成
- 响应式设计实现

**工作分支：** `feature/frontend`

### 👩‍💻 成员LWH - 后端开发负责人
**主要职责：**
- 负责Node.js后端API开发
- 数据库操作和业务逻辑实现
- API接口设计和文档编写
- 服务器性能优化

**工作分支：** `feature/backend`

### 👨‍💼 成员LZM - 数据库设计负责人
**主要职责：**
- 数据库结构设计和优化
- SQL脚本编写和数据迁移
- 数据安全和备份策略
- 数据库性能调优

**工作分支：** `feature/database`

### 👩‍🔧 成员LZX - 部署运维负责人
**主要职责：**
- Docker容器化配置
- CI/CD流水线搭建
- 服务器部署和监控
- 项目文档和Git管理

**工作分支：** `feature/deployment`

## 快速开始

### 环境要求
- Node.js 14+
- npm 或 yarn
- Git
- SQLite3
- Docker (可选)

### 本地开发

#### 方式一：使用项目脚本（推荐）

1. **克隆项目**
```bash
git clone <repository-url>
cd Team_project
```

2. **安装依赖**
```bash
npm install
```

3. **初始化数据库**
```bash
npm run db:init
npm run db:seed
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
- 前端：http://localhost:3000
- 后端API：http://localhost:3001

#### 方式二：分别启动前后端

1. **启动后端服务**
```bash
cd backend
npm install
# 初始化数据库
node scripts/init-db.js
node scripts/seed-data.js
# 启动服务
npm start
```

2. **启动前端服务**
```bash
cd frontend
npm install
npm start
```

### 生产环境部署

#### 使用Docker

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

#### 手动部署

1. **构建前端**
```bash
cd frontend
npm run build
```

2. **部署后端**
```bash
cd backend
npm install --production
npm run build
npm start
```

## 功能特性

### 核心功能
- ✅ 任务创建和编辑
- ✅ 任务状态管理（待办、进行中、已完成）
- ✅ 任务优先级设置（低、中、高）
- ✅ 任务分配给团队成员
- ✅ 实时数据同步
- ✅ 响应式界面设计

### 技术特性
- 🚀 前后端分离架构
- 📱 移动端适配
- 🔄 RESTful API设计
- 💾 SQLite轻量级数据库
- 🐳 Docker容器化支持
- 🔧 完整的开发工具链

## API接口文档

### 健康检查
- `GET /api/health` - 服务器健康状态检查

### 任务管理
- `GET /api/tasks` - 获取所有任务列表
- `POST /api/tasks` - 创建新任务
- `PUT /api/tasks/:id` - 更新指定任务
- `DELETE /api/tasks/:id` - 删除指定任务

#### 请求示例

**创建任务**
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新任务",
    "description": "任务描述",
    "status": "pending",
    "priority": "medium",
    "assignee": "张三"
  }'
```

**更新任务**
```bash
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新的任务",
    "status": "in_progress",
    "priority": "high"
  }'
```

## Git协作流程

1. **主分支保护**：`main` 分支受保护，只能通过Pull Request合并
2. **功能分支**：每个成员在自己的功能分支上开发
3. **代码审查**：所有代码合并前需要至少一人审查
4. **提交规范**：使用约定式提交格式

详细的Git协作指南请查看：[Git工作流程](docs/git-workflow.md)

## 开发规范

### 代码风格
- 使用ESLint进行代码检查
- 统一使用2空格缩进
- 变量和函数使用驼峰命名
- 组件使用PascalCase命名

### 提交信息格式
```
type(scope): description

[optional body]

[optional footer]
```

类型说明：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 项目里程碑

- [ ] **第一周**：项目初始化和基础框架搭建
- [ ] **第二周**：核心功能开发
- [ ] **第三周**：功能完善和测试
- [ ] **第四周**：部署上线和文档完善

## 故障排除

### 常见问题

#### 1. 后端启动失败
**问题**：`MODULE_NOT_FOUND` 错误
**解决方案**：
```bash
cd backend
npm install
```

#### 2. 数据库连接失败
**问题**：SQLite数据库文件不存在
**解决方案**：
```bash
cd backend
node scripts/init-db.js
```

#### 3. 前端无法连接后端
**问题**：CORS错误或网络请求失败
**解决方案**：
- 确保后端服务在3001端口运行
- 检查防火墙设置
- 验证API地址配置

#### 4. 端口占用问题
**问题**：端口3000或3001被占用
**解决方案**：
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

#### 5. Docker部署问题
**问题**：容器启动失败
**解决方案**：
```bash
# 查看容器日志
docker-compose logs

# 重新构建镜像
docker-compose build --no-cache

# 清理并重启
docker-compose down
docker-compose up -d
```

### 开发调试

#### 查看日志
```bash
# 后端日志
npm run logs

# 前端开发服务器日志
npm start
```

#### 数据库操作
```bash
# 重置数据库
npm run db:reset

# 查看数据库内容
sqlite3 database/tasks.db ".tables"
sqlite3 database/tasks.db "SELECT * FROM tasks;"
```

## 性能优化建议

1. **前端优化**
   - 使用React.memo减少不必要的重渲染
   - 实现虚拟滚动处理大量任务
   - 添加加载状态和错误处理

2. **后端优化**
   - 添加数据库索引
   - 实现API响应缓存
   - 使用连接池管理数据库连接

3. **部署优化**
   - 启用gzip压缩
   - 配置CDN加速静态资源
   - 使用PM2管理Node.js进程

## 贡献指南

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 联系方式

如果您在使用过程中遇到问题，可以通过以下方式联系我们：
- 提交Issue：[GitHub Issues](https://github.com/your-repo/issues)
- 邮箱：team@example.com
- 文档：查看项目Wiki获取更多详细信息

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题，请联系项目团队或创建Issue。

---

**Happy Coding! 🚀**