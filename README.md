# 团队任务管理系统

一个基于React + Node.js + SQLite的微型任务管理系统，适合四人小组协作开发。

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

### 👨‍💻 成员A - 前端开发负责人
**主要职责：**
- 负责React前端界面开发
- 组件设计和用户体验优化
- 前端状态管理和API集成
- 响应式设计实现

**工作分支：** `feature/frontend`

### 👩‍💻 成员B - 后端开发负责人
**主要职责：**
- 负责Node.js后端API开发
- 数据库操作和业务逻辑实现
- API接口设计和文档编写
- 服务器性能优化

**工作分支：** `feature/backend`

### 👨‍💼 成员C - 数据库设计负责人
**主要职责：**
- 数据库结构设计和优化
- SQL脚本编写和数据迁移
- 数据安全和备份策略
- 数据库性能调优

**工作分支：** `feature/database`

### 👩‍🔧 成员D - 部署运维负责人
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
- Docker (可选)

### 本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd Team_project
```

2. **启动后端服务**
```bash
cd backend
npm install
npm run dev
```

3. **启动前端服务**
```bash
cd frontend
npm install
npm start
```

4. **访问应用**
- 前端：http://localhost:3000
- 后端API：http://localhost:3001

### Docker部署

```bash
cd deployment
docker-compose up -d
```

## API接口

### 任务管理
- `GET /api/tasks` - 获取所有任务
- `POST /api/tasks` - 创建新任务
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务
- `GET /api/health` - 健康检查

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

## 贡献指南

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题，请联系项目团队或创建Issue。

---

**Happy Coding! 🚀**