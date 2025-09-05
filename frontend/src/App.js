import React from 'react';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>团队任务管理系统</h1>
        <p>四人小组协作项目</p>
      </header>
      <main>
        <TaskList />
      </main>
    </div>
  );
}

export default App;