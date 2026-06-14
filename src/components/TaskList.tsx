import React, { useState } from 'react';
import type { Task, TaskStatus } from '../data/roadmapData';
import { TaskCard } from './TaskCard';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useTaskStore } from '../store/taskStore';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  filterAssignee: string | null;
  onEditTask: (task: Task) => void;
  isReadonly?: boolean;
}

const STATUSES: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'Заплановано' },
  { id: 'active', label: 'В процесі' },
  { id: 'done', label: 'Виконано' },
  { id: 'important', label: 'Важливо' },
  { id: 'milestone', label: 'Майлстоун' }
];

export const TaskList: React.FC<TaskListProps> = ({ tasks, filterAssignee, onEditTask, isReadonly = false }) => {
  const updateTaskStatus = useTaskStore(state => state.updateTaskStatus);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const filteredTasks = filterAssignee 
    ? tasks.filter(t => t.assignee === filterAssignee)
    : tasks;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = filteredTasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = filteredTasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    
    // Check if dragging over a column directly
    const isOverColumn = STATUSES.some(s => s.id === overId);
    if (isOverColumn) {
      if (activeTask.status !== overId) {
        updateTaskStatus(activeTask.id, overId as TaskStatus, activeTask.group);
      }
      return;
    }

    // Dragging over another task
    const overTask = filteredTasks.find(t => t.id === overId);
    if (overTask && overTask.status !== activeTask.status) {
      updateTaskStatus(activeTask.id, overTask.status, activeTask.group);
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <p>Не знайдено завдань для вибраного фільтра.</p>
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-list-container kanban-board">
        {STATUSES.map(status => {
          const colTasks = filteredTasks.filter(t => t.status === status.id);
          
          return (
            <div key={status.id} className="task-group kanban-col" id={status.id}>
              <h2 className="group-title">
                {status.label} <span className="task-count">{colTasks.length}</span>
              </h2>
              <SortableContext items={colTasks.map(t => t.id)} strategy={rectSortingStrategy}>
                <div className="task-grid kanban-grid">
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => onEditTask(task)} isReadonly={isReadonly} />
                  ))}
                  {/* Drop zone placeholder for empty columns */}
                  {colTasks.length === 0 && (
                    <div className="empty-col-dropzone" />
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
