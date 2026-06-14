import React, { useState } from 'react';
import type { Task, TaskStatus } from '../data/roadmapData';
import './TaskModal.css';

interface TaskModalProps {
  task?: Task;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [assignee, setAssignee] = useState(task?.assignee || '');
  const [startDate, setStartDate] = useState(task?.startDate || '');
  const [endDate, setEndDate] = useState(task?.endDate || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'todo');
  const [group, setGroup] = useState(task?.group || 'Розробка та QA');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, assignee, startDate, endDate, status, group });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel animate-fade-in">
        <h2>{task ? 'Редагувати Завдання' : 'Нове Завдання'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Назва</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Опис</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Відповідальний</label>
              <input value={assignee} onChange={e => setAssignee(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Група</label>
              <input required value={group} onChange={e => setGroup(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Початок</label>
              <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Кінець</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Статус</label>
            <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
              <option value="todo">Заплановано</option>
              <option value="active">В процесі</option>
              <option value="done">Виконано</option>
              <option value="milestone">Майлстоун</option>
              <option value="important">Важливо</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Скасувати</button>
            <button type="submit" className="btn-primary">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
};
