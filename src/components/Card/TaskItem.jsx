import "./TaskItemGrid.css";
import "./TaskItemCollapsed.css";
import { useState, useEffect } from "react";
import { useTasks } from "../../utils/TaskContext";
import { FaCheck, FaTrashAlt, FaEdit } from "react-icons/fa";
import { IoMdStarOutline, IoMdStar } from "react-icons/io";
import { MdOutlineRestorePage } from "react-icons/md";
import {
  addTaskToList,
  removeTaskFromList,
  isTaskInList,
} from "../../utils/storage";

// This component represents a single task item in the task list.
// It displays task details, allows editing, deleting, marking as done, and toggling favorites

const FAVORITES_KEY = "favoriteTasks";

const TaskItem = ({ task }) => {
  const { onEdit, onDelete, onMarkDone, onRestore, isCollapsed } = useTasks();

  const [isOpen, setIsOpen] = useState(!isCollapsed);
  const [isFavorite, setIsFavorite] = useState(
    isTaskInList(FAVORITES_KEY, task.id)
  );

  const isGhost = task.isGhost || false;

  const displayTitle = isGhost
    ? task.title.replace(/\s*\(Completed!\)\s*$/i, "").trim()
    : task.title;

  useEffect(() => {
    setIsOpen(!isCollapsed);
  }, [isCollapsed]);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeTaskFromList(FAVORITES_KEY, task.id);
    } else {
      addTaskToList(FAVORITES_KEY, task);
    }
    setIsFavorite(!isFavorite);
  };

  const handleHeaderClick = () => {
    if (isCollapsed) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div
      className={`${isCollapsed ? "card-collapse" : "card-grid"} ${
        isGhost ? "ghost-card" : "task-card"
      }`}
      id={`${isGhost ? "ghost-card-" : "task-card-"}${task.id}`}
    >
      <div className="card-header">
        <h3
          className="card-title"
          onClick={handleHeaderClick}
          style={{ cursor: isCollapsed ? "pointer" : "default" }}
        >
          {displayTitle}
        </h3>

        {!isGhost && (
          <button
            className="card-icon favorite-button"
            onClick={handleToggleFavorite}
          >
            {isFavorite ? <IoMdStar /> : <IoMdStarOutline />}
          </button>
        )}
      </div>

      <div className={`card-content-wrapper ${!isOpen ? "closed" : "opened"}`}>
        <p>
          <span>Date:</span> {task.date}
        </p>
        <p className="card-description">
          <span>Description:</span> {task.description}
        </p>

        <div className="card-icons">
          <button className="card-icon trash" onClick={() => onDelete(task.id)}>
            <FaTrashAlt />
          </button>

          {isGhost ? (
            <button
              className="card-icon restore"
              onClick={() => onRestore(task)}
            >
              <MdOutlineRestorePage />
            </button>
          ) : (
            <>
              <button className="card-icon edit" onClick={() => onEdit(task)}>
                <FaEdit />
              </button>
              <button
                className="card-icon check"
                onClick={() => onMarkDone(task)}
              >
                <FaCheck />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
