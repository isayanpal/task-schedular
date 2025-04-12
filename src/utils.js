export const isTimeConflict = (tasks, newTask) => {
  return tasks.some(task => {
    return (
      (newTask.startTime < task.endTime && newTask.endTime > task.startTime)
    );
  });
};