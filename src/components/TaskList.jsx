import TaskItem from "./Card/TaskItem";
import { useTasks } from "../utils/TaskContext";
import { generalMessages, favoriteMessages } from "../utils/messages";
import { FaPlusCircle } from "react-icons/fa";
import { useMemo } from "react";
import "./Card/TaskItemGrid.css";
import "./Card/TaskItemCollapsed.css";

// This component represents the task list
// It displays a list of tasks, allows adding new tasks, and shows messages when the list is empty
// It also handles the display of tasks in either list or grid view based on user preference.

const TaskList = () => {
  const { tasks, onAddClick, showFavoritesOnly, isListView } = useTasks();
  const isEmpty = tasks.length === 0;

  const randomMessage = useMemo(() => {
    const source = showFavoritesOnly ? favoriteMessages : generalMessages;
    return source[Math.floor(Math.random() * source.length)];
  }, [showFavoritesOnly, isEmpty]);

  return (
    <div className={`task-list ${isListView ? "list" : "grid"}`}>
      <button className="add-card" id="add-button" onClick={onAddClick}>
        <FaPlusCircle />
      </button>

      {isEmpty ? (
        <div className="empty-message card-grid card-collapse">
          {randomMessage}
        </div>
      ) : (
        tasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </div>
  );
};

export default TaskList;
