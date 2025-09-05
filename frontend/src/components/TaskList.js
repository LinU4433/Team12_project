import React, { useState, useEffect } from 'react';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:3001/api';

  // 获取所有任务
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error('获取任务失败');
      }
      const data = await response.json();
      setTasks(data);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('获取任务错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 添加新任务
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setError('任务标题不能为空');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      
      if (!response.ok) {
        throw new Error('添加任务失败');
      }
      
      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
      setNewTask({ title: '', description: '', assignee: '', priority: 'medium' });
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('添加任务错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 更新任务状态
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('更新任务状态失败');
      }
      
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('更新任务状态错误:', err);
    }
  };

  // 删除任务
  const deleteTask = async (taskId) => {
    if (!window.confirm('确定要删除这个任务吗？')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('删除任务失败');
      }
      
      setTasks(tasks.filter(task => task.id !== taskId));
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('删除任务错误:', err);
    }
  };

  // 组件挂载时获取任务
  useEffect(() => {
    fetchTasks();
  }, []);

  // 获取状态对应的中文显示
  const getStatusText = (status) => {
    const statusMap = {
      'pending': '待处理',
      'in_progress': '进行中',
      'completed': '已完成'
    };
    return statusMap[status] || status;
  };

  // 获取优先级对应的中文显示
  const getPriorityText = (priority) => {
    const priorityMap = {
      'low': '低',
      'medium': '中',
      'high': '高'
    };
    return priorityMap[priority] || priority;
  };

  return (
    <div className="task-list-container">
      <div className="task-form-section">
        <h2>添加新任务</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={addTask} className="task-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="任务标题"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="form-input"
              required
            />
            <input
              type="text"
              placeholder="负责人"
              value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              className="form-input"
            />
          </div>
          
          <textarea
            placeholder="任务描述"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="form-textarea"
            rows="3"
          />
          
          <div className="form-row">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="form-select"
            >
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
            </select>
            
            <button type="submit" disabled={loading} className="add-button">
              {loading ? '添加中...' : '添加任务'}
            </button>
          </div>
        </form>
      </div>

      <div className="task-list-section">
        <div className="section-header">
          <h2>任务列表</h2>
          <button onClick={fetchTasks} className="refresh-button" disabled={loading}>
            {loading ? '刷新中...' : '刷新'}
          </button>
        </div>
        
        {loading && tasks.length === 0 ? (
          <div className="loading-message">加载中...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-message">暂无任务，请添加新任务</div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task.id} className={`task-card priority-${task.priority} status-${task.status}`}>
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <div className="task-priority">
                    {getPriorityText(task.priority)}
                  </div>
                </div>
                
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                
                <div className="task-meta">
                  <span className="task-assignee">
                    负责人: {task.assignee || '未分配'}
                  </span>
                  <span className="task-date">
                    创建: {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">待处理</option>
                    <option value="in_progress">进行中</option>
                    <option value="completed">已完成</option>
                  </select>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="delete-button"
                  >
                    删除
                  </button>
                </div>
                
                <div className="task-status">
                  状态: {getStatusText(task.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;