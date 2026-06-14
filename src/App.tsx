import { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { MetricsPanel } from './components/MetricsPanel';
import { ReleaseNotesModal } from './components/ReleaseNotesModal';
import { GithubSyncModal } from './components/GithubSyncModal';
import { useTaskStore } from './store/taskStore';
import type { Task } from './data/roadmapData';
import './App.css';

function App() {
  const { tasks, loading, error, fetchTasks, addTask, updateTask } = useTaskStore();
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReleaseNotesOpen, setIsReleaseNotesOpen] = useState(false);
  const [isGithubSyncOpen, setIsGithubSyncOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [currentView, setCurrentView] = useState<'board' | 'metrics'>('board');
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  const isReadonly = new URLSearchParams(window.location.search).get('readonly') === 'true';

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

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('readonly', 'true');
    navigator.clipboard.writeText(url.toString());
    alert('Посилання для читання (Read-Only) скопійовано в буфер обміну!');
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

  const handleGithubSync = async (issues: any[]) => {
    // Basic mapping from GitHub issue to our task
    for (const issue of issues) {
      const taskData: Omit<Task, 'id'> = {
        title: issue.title,
        description: issue.body || 'Імпортовано з GitHub',
        assignee: issue.assignee?.login || '',
        startDate: new Date().toISOString().split('T')[0], // today
        status: 'todo', // all new imported issues go to todo
        group: 'github-sync' // we can assign a default group
      };
      await addTask(taskData);
    }
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
            
            {!isReadonly && (
              <button className="btn-primary" onClick={openNewTaskModal}>
                + Нове Завдання
              </button>
            )}
            <button className="btn-secondary" onClick={handleShare}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 6}}>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share
            </button>
            <div className="view-toggle">
              <button 
                className={`btn-toggle ${currentView === 'board' ? 'active' : ''}`}
                onClick={() => setCurrentView('board')}
              >
                Board
              </button>
              <button 
                className={`btn-toggle ${currentView === 'metrics' ? 'active' : ''}`}
                onClick={() => setCurrentView('metrics')}
              >
                Metrics
              </button>
            </div>

            {!isReadonly && (
              <button className="btn-secondary" onClick={() => setIsGithubSyncOpen(true)}>
                🔄 GitHub Sync
              </button>
            )}

            <button className="btn-secondary" onClick={() => setIsReleaseNotesOpen(true)}>
              📝 Release Notes
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
        ) : currentView === 'metrics' ? (
          <MetricsPanel tasks={tasks} />
        ) : (
          <TaskList 
            tasks={tasks} 
            filterAssignee={filterAssignee} 
            onEditTask={(task) => {
              setEditingTask(task);
              setIsModalOpen(true);
            }} 
            isReadonly={isReadonly}
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

      {isReleaseNotesOpen && (
        <ReleaseNotesModal 
          tasks={tasks} 
          onClose={() => setIsReleaseNotesOpen(false)} 
        />
      )}

      {isGithubSyncOpen && (
        <GithubSyncModal 
          onClose={() => setIsGithubSyncOpen(false)} 
          onSync={handleGithubSync} 
        />
      )}
    </div>
  );
}

export default App;
