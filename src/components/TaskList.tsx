import React from 'react';
import type { Task } from '../data/roadmapData';
import { TaskCard } from './TaskCard';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  filterAssignee: string | null;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, filterAssignee }) => {
  const filteredTasks = filterAssignee 
    ? tasks.filter(t => t.assignee === filterAssignee)
    : tasks;

  // Group tasks by their group property
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    if (!acc[task.group]) {
      acc[task.group] = [];
    }
    acc[task.group].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  if (filteredTasks.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <p>Не знайдено завдань для вибраного фільтра.</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      {Object.entries(groupedTasks).map(([group, groupTasks]) => (
        <div key={group} className="task-group">
          <h2 className="group-title">{group}</h2>
          <div className="task-grid">
            {groupTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
