import React, { useMemo, useRef, useEffect } from 'react';
import type { Task, TaskStatus } from '../data/roadmapData';
import './GanttChart.css';

interface GanttChartProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const DAY_WIDTH = 40; // width of one day cell in pixels

// Helpers for dates
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const diffDays = (date1: Date, date2: Date) => {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'done': return '#4caf50';
    case 'active': return '#2196f3';
    case 'todo': return '#ff9800';
    case 'milestone': return '#9c27b0';
    case 'important': return '#f44336';
    default: return '#777';
  }
};

export const GanttChart: React.FC<GanttChartProps> = ({ tasks, onTaskClick }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Synchronize scroll between timeline and header
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current && timelineRef.current) {
        headerRef.current.scrollLeft = timelineRef.current.scrollLeft;
      }
    };
    const tl = timelineRef.current;
    if (tl) {
      tl.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (tl) tl.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const {
    timelineDays,
    startDate,
    groupedTasks,
    months
  } = useMemo(() => {
    if (tasks.length === 0) {
      const today = new Date();
      return { timelineDays: [today], startDate: today, groupedTasks: [], months: [] };
    }

    let minDate = new Date();
    let maxDate = new Date();
    let first = true;

    const grouped: Record<string, Task[]> = {};

    tasks.forEach(t => {
      // Grouping
      if (!grouped[t.group]) grouped[t.group] = [];
      grouped[t.group].push(t);

      // Dates
      if (t.startDate) {
        const d = new Date(t.startDate);
        if (first || d < minDate) minDate = d;
        if (first || d > maxDate) maxDate = d;
        first = false;
      }
      if (t.endDate) {
        const d = new Date(t.endDate);
        if (d > maxDate) maxDate = d;
      }
    });

    // Add padding
    minDate = addDays(minDate, -7); // 1 week before
    maxDate = addDays(maxDate, 14); // 2 weeks after

    const totalDays = diffDays(minDate, maxDate) + 1;
    const daysArr: Date[] = [];
    const monthsMap: { name: string; colspan: number }[] = [];
    let currentMonth = '';
    let currentMonthCount = 0;

    for (let i = 0; i < totalDays; i++) {
      const d = addDays(minDate, i);
      daysArr.push(d);

      const mName = d.toLocaleString('uk-UA', { month: 'long', year: 'numeric' });
      if (mName !== currentMonth) {
        if (currentMonth !== '') {
          monthsMap.push({ name: currentMonth, colspan: currentMonthCount });
        }
        currentMonth = mName;
        currentMonthCount = 1;
      } else {
        currentMonthCount++;
      }
    }
    if (currentMonthCount > 0) {
      monthsMap.push({ name: currentMonth, colspan: currentMonthCount });
    }

    return {
      timelineDays: daysArr,
      startDate: minDate,
      groupedTasks: Object.entries(grouped),
      months: monthsMap
    };
  }, [tasks]);

  const todayOffset = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const offsetDays = diffDays(startDate, today);
    return offsetDays * DAY_WIDTH;
  }, [startDate]);

  return (
    <div className="gantt-container animate-fade-in">
      <div className="gantt-header-row">
        <div className="gantt-sidebar-header">
          <span>Task Name</span>
          <span>Status</span>
        </div>
        <div className="gantt-timeline-header-container" ref={headerRef}>
          <div className="gantt-timeline-header" style={{ width: timelineDays.length * DAY_WIDTH }}>
            {months.map((m, i) => (
              <div key={i} className="gantt-header-cell" style={{ width: m.colspan * DAY_WIDTH }}>
                <div className="gantt-header-month">{m.name}</div>
                <div className="gantt-header-days">
                  {timelineDays.slice(i === 0 ? 0 : months.slice(0, i).reduce((a, b) => a + b.colspan, 0), months.slice(0, i + 1).reduce((a, b) => a + b.colspan, 0)).map((d, j) => (
                    <div key={j} className="gantt-header-day">
                      {d.getDate()}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gantt-body">
        <div className="gantt-sidebar">
          {groupedTasks.map(([groupName, groupTasks]) => (
            <React.Fragment key={groupName}>
              <div className="gantt-group-row">{groupName}</div>
              {groupTasks.map(task => (
                <div key={task.id} className="gantt-task-row-sidebar" onClick={() => onTaskClick?.(task)} style={{ cursor: onTaskClick ? 'pointer' : 'default' }}>
                  <div className="gantt-task-name" title={task.title}>{task.title}</div>
                  <div className={`gantt-task-status ${task.status}`}>{task.status}</div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className="gantt-timeline-area" ref={timelineRef}>
          <div className="gantt-grid-bg" style={{ width: timelineDays.length * DAY_WIDTH }}>
            {timelineDays.map((_, i) => (
              <div key={i} className="gantt-grid-cell" style={{ width: DAY_WIDTH }} />
            ))}
          </div>
          
          {/* Today line */}
          {todayOffset >= 0 && todayOffset <= timelineDays.length * DAY_WIDTH && (
            <div className="gantt-today-line" style={{ left: todayOffset + DAY_WIDTH/2 }} title="Today" />
          )}

          <div style={{ width: timelineDays.length * DAY_WIDTH }}>
            {groupedTasks.map(([groupName, groupTasks]) => (
              <React.Fragment key={groupName}>
                <div className="gantt-group-row-timeline" />
                {groupTasks.map(task => {
                  let left = 0;
                  let width = DAY_WIDTH; // default for milestone or 1-day task
                  let isMilestone = false;

                  if (task.startDate) {
                    const start = new Date(task.startDate);
                    const offsetDays = diffDays(startDate, start);
                    left = offsetDays * DAY_WIDTH;

                    if (task.endDate) {
                      const end = new Date(task.endDate);
                      const durationDays = diffDays(start, end) + 1;
                      width = durationDays * DAY_WIDTH;
                    } else {
                      isMilestone = true;
                    }
                  } else {
                     return <div key={task.id} className="gantt-task-row-timeline" />; // invisible if no dates
                  }

                  const color = getStatusColor(task.status);

                  return (
                    <div key={task.id} className="gantt-task-row-timeline">
                      <div className="gantt-bar-container" style={{ left, width }}>
                        {isMilestone ? (
                          <div 
                            className="gantt-milestone" 
                            style={{ backgroundColor: color }} 
                            title={`${task.title} (Milestone)`}
                            onClick={() => onTaskClick?.(task)}
                          />
                        ) : (
                          <div 
                            className="gantt-bar" 
                            style={{ backgroundColor: color }}
                            title={`${task.title} (${task.startDate} - ${task.endDate})`}
                            onClick={() => onTaskClick?.(task)}
                          >
                            {task.title}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
