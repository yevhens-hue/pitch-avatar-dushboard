import React, { useState } from 'react';
import './TaskModal.css';

interface GithubSyncModalProps {
  onClose: () => void;
  onSync: (issues: any[]) => Promise<void>;
}

export const GithubSyncModal: React.FC<GithubSyncModalProps> = ({ onClose, onSync }) => {
  const [repoPath, setRepoPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoPath) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/repos/${repoPath}/issues?state=open&per_page=30`);
      if (!response.ok) {
        throw new Error(`Помилка GitHub API: ${response.status} ${response.statusText}`);
      }
      const issues = await response.json();
      
      // Filter out pull requests
      const actualIssues = issues.filter((issue: any) => !issue.pull_request);
      
      await onSync(actualIssues);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Не вдалося завантажити Issues.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔄 GitHub Sync</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>×</button>
        </div>
        
        <form onSubmit={handleSync}>
          <div className="modal-body">
            <p style={{ color: '#888', marginBottom: '16px' }}>
              Введіть шлях до публічного репозиторію (наприклад, <strong>facebook/react</strong>), щоб імпортувати відкриті Issues як завдання на дошку.
            </p>
            
            {error && <div className="error" style={{ marginBottom: '16px', color: '#ff6b6b' }}>{error}</div>}

            <div className="form-group">
              <label>Owner/Repo</label>
              <input 
                type="text" 
                value={repoPath} 
                onChange={e => setRepoPath(e.target.value)}
                placeholder="напр. microsoft/vscode"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Скасувати
            </button>
            <button type="submit" className="btn-primary" disabled={loading || !repoPath}>
              {loading ? 'Завантаження...' : 'Імпортувати Issues'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
