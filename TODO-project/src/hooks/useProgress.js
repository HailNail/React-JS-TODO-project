// hooks/useProgress.js

// This hook calculates the progress of tasks based on their completion status
// and returns relevant data such as total tasks, completed tasks, percentage, and completion status.
import { useMemo } from "react";

export const useProgress = (filteredList, ghostList) => {
  const allRelevantTasks = useMemo(() => {
    return filteredList.filter((task) => !task.isGhost);
  }, [filteredList]);

  const ghostCompletedTasks = ghostList.length;

  const totalTasks = allRelevantTasks.length + ghostCompletedTasks;
  const completedTasks = ghostCompletedTasks;

  const percent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isComplete = totalTasks > 0 && completedTasks === totalTasks;

  return {
    totalTasks,
    completedTasks,
    percent,
    isComplete,
  };
};
