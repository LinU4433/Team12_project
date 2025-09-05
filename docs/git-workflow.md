# Git 协作工作流程指南

本文档详细说明了团队任务管理系统项目的Git协作流程和规范。

## 分支策略

### 主要分支

- **`main`** - 主分支，始终保持可部署状态
- **`develop`** - 开发分支，集成各功能分支

### 功能分支

每个团队成员负责一个主要模块，使用以下分支：

- **`feature/frontend`** - 前端开发分支 (成员A)
- **`feature/backend`** - 后端开发分支 (成员B)
- **`feature/database`** - 数据库开发分支 (成员C)
- **`feature/deployment`** - 部署配置分支 (成员D)

### 临时分支

- **`hotfix/*`** - 紧急修复分支
- **`bugfix/*`** - Bug修复分支
- **`task/*`** - 小任务分支

## 工作流程

### 1. 初始设置

```bash
# 克隆仓库
git clone <repository-url>
cd Team_project

# 创建并切换到你的功能分支
git checkout -b feature/frontend  # 根据你的角色调整分支名

# 设置上游分支
git push -u origin feature/frontend
```

### 2. 日常开发流程

```bash
# 1. 确保在正确的分支上
git checkout feature/frontend

# 2. 拉取最新代码
git pull origin feature/frontend

# 3. 开始开发...
# 编写代码、测试等

# 4. 添加修改到暂存区
git add .

# 5. 提交修改（遵循提交规范）
git commit -m "feat(frontend): add task list component"

# 6. 推送到远程分支
git push origin feature/frontend
```

### 3. 合并到开发分支

当功能开发完成后，需要合并到 `develop` 分支：

```bash
# 1. 切换到develop分支
git checkout develop

# 2. 拉取最新的develop分支
git pull origin develop

# 3. 合并你的功能分支
git merge feature/frontend

# 4. 推送合并后的develop分支
git push origin develop
```

### 4. 创建Pull Request

推荐使用Pull Request进行代码审查：

1. 在GitHub/GitLab上创建Pull Request
2. 从你的功能分支到 `develop` 分支
3. 添加详细的描述和变更说明
4. 请求至少一名团队成员进行代码审查
5. 审查通过后合并

## 提交规范

### 提交信息格式

```
type(scope): subject

[optional body]

[optional footer]
```

### 类型 (type)

- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响功能）
- **refactor**: 代码重构
- **test**: 添加或修改测试
- **chore**: 构建过程或辅助工具的变动
- **perf**: 性能优化

### 范围 (scope)

- **frontend**: 前端相关
- **backend**: 后端相关
- **database**: 数据库相关
- **deployment**: 部署相关
- **docs**: 文档相关

### 示例

```bash
# 好的提交信息
git commit -m "feat(frontend): add task creation form"
git commit -m "fix(backend): resolve database connection issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(frontend): improve task list layout"

# 不好的提交信息
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

## 代码审查指南

### 审查要点

1. **功能正确性**: 代码是否实现了预期功能
2. **代码质量**: 是否遵循编码规范
3. **性能考虑**: 是否有性能问题
4. **安全性**: 是否存在安全隐患
5. **测试覆盖**: 是否有足够的测试
6. **文档更新**: 是否需要更新文档

### 审查流程

1. 仔细阅读Pull Request描述
2. 检查代码变更
3. 本地测试（如有必要）
4. 提供建设性反馈
5. 批准或请求修改

## 冲突解决

### 合并冲突处理

```bash
# 1. 拉取最新的目标分支
git checkout develop
git pull origin develop

# 2. 切换回你的功能分支
git checkout feature/frontend

# 3. 合并develop分支到你的分支
git merge develop

# 4. 解决冲突
# 编辑冲突文件，解决冲突标记

# 5. 添加解决后的文件
git add .

# 6. 完成合并
git commit -m "resolve merge conflicts with develop"

# 7. 推送更新
git push origin feature/frontend
```

## 最佳实践

### 1. 频繁提交
- 小步快跑，频繁提交
- 每个提交应该是一个逻辑完整的变更
- 避免一次性提交大量代码

### 2. 保持分支同步
- 定期从 `develop` 分支拉取更新
- 及时解决冲突
- 保持功能分支相对较新

### 3. 代码审查
- 所有代码合并前必须经过审查
- 积极参与他人代码的审查
- 虚心接受审查意见

### 4. 分支管理
- 及时删除已合并的功能分支
- 保持仓库整洁
- 使用有意义的分支名称

### 5. 文档维护
- 及时更新相关文档
- 保持README的准确性
- 记录重要的设计决策

## 常用Git命令速查

```bash
# 查看状态
git status

# 查看分支
git branch -a

# 切换分支
git checkout <branch-name>

# 创建并切换分支
git checkout -b <new-branch>

# 查看提交历史
git log --oneline

# 查看差异
git diff

# 暂存修改
git stash
git stash pop

# 重置修改
git reset --hard HEAD

# 查看远程仓库
git remote -v

# 同步远程分支信息
git fetch --prune
```

## 紧急情况处理

### 回滚提交

```bash
# 回滚最后一次提交（保留修改）
git reset --soft HEAD~1

# 回滚最后一次提交（丢弃修改）
git reset --hard HEAD~1

# 创建反向提交
git revert <commit-hash>
```

### 修改提交信息

```bash
# 修改最后一次提交信息
git commit --amend -m "new commit message"

# 修改历史提交（谨慎使用）
git rebase -i HEAD~n
```

## 团队协作建议

1. **沟通优先**: 遇到问题及时沟通
2. **文档先行**: 重要决策要有文档记录
3. **测试保障**: 确保代码质量
4. **持续集成**: 保持代码库的健康状态
5. **学习分享**: 分享经验和最佳实践

---

遵循这些规范和流程，我们的团队协作将更加高效和顺畅！