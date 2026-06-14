import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Task, TaskStatus } from '../data/roadmapData';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTaskStatus: (id: string, newStatus: TaskStatus, newGroup: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) {
        // Fallback to local data if Supabase isn't configured yet
        console.error('Supabase error:', error.message);
        const { roadmapData } = await import('../data/roadmapData');
        set({ tasks: roadmapData, loading: false });
        return;
      }

      // Map Supabase rows to our Task type
      const mappedTasks: Task[] = data.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        assignee: row.assignee || '',
        startDate: row.start_date,
        endDate: row.end_date,
        status: row.status as TaskStatus,
        group: row.task_group,
      }));

      // If db is empty, load mock data for demonstration
      if (mappedTasks.length === 0) {
        const { roadmapData } = await import('../data/roadmapData');
        set({ tasks: roadmapData, loading: false });
      } else {
        set({ tasks: mappedTasks, loading: false });
      }
    } catch (err: any) {
      console.error(err);
      // Fallback
      const { roadmapData } = await import('../data/roadmapData');
      set({ tasks: roadmapData, loading: false, error: err.message });
    }
  },

  addTask: async (task) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: task.title,
          description: task.description,
          assignee: task.assignee,
          start_date: task.startDate,
          end_date: task.endDate,
          status: task.status,
          task_group: task.group
        }])
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description,
        assignee: data.assignee,
        startDate: data.start_date,
        endDate: data.end_date,
        status: data.status,
        group: data.task_group
      };

      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (err: any) {
      console.error('Failed to add task:', err);
      // Optimistic fallback for local demo
      const localId = Math.random().toString(36).substring(7);
      set((state) => ({ tasks: [...state.tasks, { ...task, id: localId }] }));
    }
  },

  updateTaskStatus: async (id, newStatus, newGroup) => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map(t => 
        t.id === id ? { ...t, status: newStatus, group: newGroup } : t
      )
    }));

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, task_group: newGroup })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to update task:', err);
      // Revert if needed (simplified for now)
    }
  },

  updateTask: async (id, updates) => {
     set((state) => ({
      tasks: state.tasks.map(t => 
        t.id === id ? { ...t, ...updates } : t
      )
    }));

    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.assignee !== undefined) dbUpdates.assignee = updates.assignee;
      if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
      if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.group !== undefined) dbUpdates.task_group = updates.group;

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  },

  deleteTask: async (id) => {
    set((state) => ({
      tasks: state.tasks.filter(t => t.id !== id)
    }));

    try {
      await supabase.from('tasks').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  }
}));
