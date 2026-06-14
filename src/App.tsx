import { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { useTaskStore } from './store/taskStore';
import type { Task } from './data/roadmapData';
import './App.css';

function App() {
  const { tasks, loading, error, fetchTasks, addTask, updateTask } = useTaskStore();
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignee).filter(Boolean)));

  const handleExport = async () => {
    if (!dashboardRef.current) return;
    
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        backgroundColor: '#0a0a0a', // Use the dark background
        scale: 2, // High resolution
        ignoreElements: (element) => element.classList.contains('no-export')
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `pitch-avatar-roadmap-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export dashboard:', err);
      alert('Не вдалося експортувати зображення.');
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await addTask(taskData as Omit<Task, 'id'>);
    }
    setIsModalOpen(false);
  };

  const openNewTaskModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="app">
      <header className="header glass-panel">
        <div className="header-content">
          <div>
            <h1 className="gradient-text">Pitch Avatar</h1>
            <p className="subtitle">Product Roadmap Dashboard</p>
          </div>
          
          <div className="header-actions no-export">
            <select 
              className="assignee-select"
              value={filterAssignee || ''} 
              onChange={e => setFilterAssignee(e.target.value || null)}
            >
              <option value="">Всі виконавці</option>
              {uniqueAssignees.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            
            <button className="btn-primary" onClick={openNewTaskModal}>
              + Нове Завдання
            </button>
            <button className="btn-secondary" onClick={handleExport}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 6}}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export PNG
            </button>
          </div>
        </div>
      </header>

      <main className="main-content" ref={dashboardRef}>
        {loading ? (
          <div className="loading">Завантаження...</div>
        ) : error ? (
          <div className="error">Помилка: {error}</div>
        ) : (
          <TaskList 
            tasks={tasks} 
            filterAssignee={filterAssignee} 
            onEditTask={(task) => {
              setEditingTask(task);
              setIsModalOpen(true);
            }} 
          />
        )}
      </main>

      {isModalOpen && (
        <TaskModal 
          task={editingTask} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveTask} 
        />
      )}
    </div>
  );
}

export default App;
