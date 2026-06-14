import React, { useState } from 'react';
import type { Task } from '../data/roadmapData';
import './TaskModal.css'; // Reusing modal styles

interface ReleaseNotesModalProps {
  tasks: Task[];
  onClose: () => void;
}

export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ tasks, onClose }) => {
  const [copied, setCopied] = useState(false);

  const doneTasks = tasks.filter(t => t.status === 'done');

  // Group by milestone or just list them
  const markdown = `# 🚀 Release Notes\n\nМи раді представити останні оновлення та виконані завдання!\n\n## Що нового:\n\n${doneTasks.length > 0 ? doneTasks.map(t => `- **${t.title}**\n  ${t.description ? `*${t.description}*` : ''}`).join('\n\n') : '*Немає виконаних завдань для цього релізу.*'}\n\n---\n*Згенеровано Pitch Avatar Roadmap*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 Release Notes Generator</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p style={{ color: '#888', marginBottom: '16px' }}>
            Нижче наведено автоматично згенерований список виконаних завдань. Ви можете скопіювати його для публікації.
          </p>
          <textarea 
            readOnly 
            value={markdown} 
            style={{ width: '100%', height: '300px', backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', fontFamily: 'monospace', resize: 'none' }}
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Закрити
          </button>
          <button type="button" className="btn-primary" onClick={handleCopy}>
            {copied ? '✓ Скопійовано!' : 'Копіювати Markdown'}
          </button>
        </div>
      </div>
    </div>
  );
};
