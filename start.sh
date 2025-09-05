#!/bin/bash

echo "正在启动团队任务管理系统..."
echo

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 检查npm环境
if ! command -v npm &> /dev/null; then
    echo "错误: 未找到npm，请先安装npm"
    exit 1
fi

echo "Node.js版本: $(node --version)"
echo "npm版本: $(npm --version)"
echo

# 安装后端依赖
echo "安装后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "正在安装后端依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "错误: 后端依赖安装失败"
        exit 1
    fi
else
    echo "后端依赖已存在，跳过安装"
fi

# 安装前端依赖
echo
echo "安装前端依赖..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "正在安装前端依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "错误: 前端依赖安装失败"
        exit 1
    fi
else
    echo "前端依赖已存在，跳过安装"
fi

# 创建数据库目录
echo
echo "创建数据库目录..."
cd ..
mkdir -p database

# 启动服务
echo
echo "启动服务..."
echo "后端服务将在 http://localhost:3001 运行"
echo "前端服务将在 http://localhost:3000 运行"
echo
echo "按 Ctrl+C 停止服务"
echo

# 启动后端服务（后台运行）
echo "启动后端服务..."
cd backend
npm start &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端服务
echo "启动前端服务..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo
echo "服务启动完成！"
echo "请在浏览器中访问 http://localhost:3000"
echo
echo "按任意键停止所有服务..."
read -n 1

# 停止服务
echo "正在停止服务..."
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null
echo "服务已停止"