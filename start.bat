@echo off
echo 正在启动团队任务管理系统...
echo.

echo 检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo 检查npm环境...
npm --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到npm，请先安装npm
    pause
    exit /b 1
)

echo.
echo 安装后端依赖...
cd backend
if not exist node_modules (
    echo 正在安装后端依赖包...
    npm install
    if errorlevel 1 (
        echo 错误: 后端依赖安装失败
        pause
        exit /b 1
    )
)

echo.
echo 安装前端依赖...
cd ../frontend
if not exist node_modules (
    echo 正在安装前端依赖包...
    npm install
    if errorlevel 1 (
        echo 错误: 前端依赖安装失败
        pause
        exit /b 1
    )
)

echo.
echo 创建数据库目录...
cd ..
if not exist database mkdir database

echo.
echo 启动服务...
echo 后端服务将在 http://localhost:3001 运行
echo 前端服务将在 http://localhost:3000 运行
echo.
echo 按 Ctrl+C 停止服务
echo.

start "后端服务" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul
start "前端服务" cmd /k "cd frontend && npm start"

echo 服务启动完成！
echo 请在浏览器中访问 http://localhost:3000
pause