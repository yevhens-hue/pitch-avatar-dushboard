import React from 'react';
import type { Task } from '../data/roadmapData';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'done': return 'Виконано';
    case 'active': return 'В процесі';
    case 'todo': return 'Заплановано';
    case 'important': return 'Важливо';
    case 'milestone': return 'Майлстоун';
    default: return status;
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={`task-card glass-panel animate-fade-in ${isDragging ? 'dragging' : ''}`}
      onClick={onClick}
    >
      <div className="task-header">
        <span className={`badge ${task.status}`}>
          {getStatusLabel(task.status)}
        </span>
        <span className="task-assignee">{task.assignee}</span>
      </div>
      <h3 className="task-title">{task.title}</h3>
      <p className="task-desc">{task.description}</p>
      
      <div className="task-footer">
        <div className="task-date">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {task.startDate} {task.endDate && task.startDate !== task.endDate ? ` - ${task.endDate}` : ''}
        </div>
      </div>
    </div>
  );
};
