import React from 'react';
import type { Task } from '../data/roadmapData';
import './MetricsPanel.css';

interface MetricsPanelProps {
  tasks: Task[];
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done');
  const progressPercent = totalTasks === 0 ? 0 : Math.round((doneTasks.length / totalTasks) * 100);

  // Time to Delivery estimation (for done tasks with start and end dates)
  let totalDays = 0;
  let validDeliveryTasks = 0;
  doneTasks.forEach(t => {
    if (t.startDate && t.endDate) {
      const start = new Date(t.startDate);
      const end = new Date(t.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDays += diffDays;
      validDeliveryTasks++;
    }
  });
  const avgTimeToDelivery = validDeliveryTasks === 0 ? 0 : Math.round(totalDays / validDeliveryTasks);

  // Workload per Assignee (open tasks)
  const openTasks = tasks.filter(t => t.status !== 'done');
  const workload: Record<string, number> = {};
  openTasks.forEach(t => {
    const assignee = t.assignee || 'Unassigned';
    workload[assignee] = (workload[assignee] || 0) + 1;
  });

  const workloadArray = Object.entries(workload).sort((a, b) => b[1] - a[1]);

  return (
    <div className="metrics-panel glass-panel animate-fade-in">
      <h2>📊 Дашборд Метрик (KPIs)</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">Загальний Прогрес</div>
          <div className="metric-value">{progressPercent}%</div>
          <div className="metric-subtitle">{doneTasks.length} з {totalTasks} завдань виконано</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Average Time to Delivery</div>
          <div className="metric-value">{avgTimeToDelivery} днів</div>
          <div className="metric-subtitle">Середній час для виконаних завдань</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Відкриті Завдання</div>
          <div className="metric-value">{openTasks.length}</div>
          <div className="metric-subtitle">Потребують уваги</div>
        </div>
      </div>

      <div className="workload-section">
        <h3>Завантаженість команди (Відкриті завдання)</h3>
        {workloadArray.length === 0 ? (
          <p>Всі завдання виконані!</p>
        ) : (
          <div className="workload-list">
            {workloadArray.map(([assignee, count]) => (
              <div key={assignee} className="workload-item">
                <span className="workload-name">{assignee}</span>
                <div className="workload-bar-container">
                  <div 
                    className="workload-bar" 
                    style={{ width: `${Math.min(100, (count / openTasks.length) * 100)}%` }}
                  ></div>
                </div>
                <span className="workload-count">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
