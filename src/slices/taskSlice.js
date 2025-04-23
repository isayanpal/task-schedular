import { createSlice } from '@reduxjs/toolkit';
import { isTimeConflict } from '../utils';
import toast from 'react-hot-toast';

const loadTasksFromStorage = () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

const saveTasksToStorage = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const initialState = {
  tasks: loadTasksFromStorage(),
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      if (isTimeConflict(state.tasks, action.payload)) {
        state.error = 'Time Conflict with another task';
        toast.error('Time Conflict with another task');
      } else {
        state.tasks.push(action.payload);
        state.error = null;
        saveTasksToStorage(state.tasks);
        toast.success('Task added successfully!');
      }
    },
    editTask: (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        const newTasks = [...state.tasks];
        newTasks.splice(index, 1);
        if (isTimeConflict(newTasks, action.payload)) {
          state.error = 'Time conflict with another task.';
          toast.error('Time conflict with another task.');
        } else {
          state.tasks[index] = action.payload;
          state.error = null;
          saveTasksToStorage(state.tasks);
          toast.success('Task updated successfully!');
        }
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      state.error = null;
      saveTasksToStorage(state.tasks);
      toast.success('Task deleted successfully!');
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { addTask, editTask, deleteTask, clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
