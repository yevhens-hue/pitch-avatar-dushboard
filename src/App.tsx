import { useState } from 'react';
import { roadmapData } from './data/roadmapData';
import { TaskList } from './components/TaskList';
import './App.css';

function App() {
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);

  const assignees = Array.from(new Set(roadmapData.map(t => t.assignee).filter(Boolean)));

  return (
    <div className="app-container animate-fade-in">
      <header className="header glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Pitch Avatar Roadmap</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Червень 2026 - Спринт та Релізи</p>
        </div>
        
        <div className="filters-bar">
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Фільтр:</span>
          <button 
            className={`filter-btn ${filterAssignee === null ? 'active' : ''}`}
            onClick={() => setFilterAssignee(null)}
          >
            Всі
          </button>
          {assignees.map(assignee => (
            <button
              key={assignee}
              className={`filter-btn ${filterAssignee === assignee ? 'active' : ''}`}
              onClick={() => setFilterAssignee(assignee)}
            >
              {assignee}
            </button>
          ))}
        </div>
      </header>

      <main>
        <TaskList tasks={roadmapData} filterAssignee={filterAssignee} />
      </main>
    </div>
  );
}

export default App;
