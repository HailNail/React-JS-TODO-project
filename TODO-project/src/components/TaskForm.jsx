import { useEffect, useMemo, useState } from "react";
import {
  removeSpecialChars,
  formatDate,
  formatDateForDisplay,
} from "../utils/helpers";
import suggestions from "../utils/suggestions.json";

// This component represents a form for adding or editing tasks
// It allows users to input a task title, date, and description
// It handles both creating new tasks and updating existing ones

const TaskForm = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(formatDate(new Date()));
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDate(formatDateForDisplay(task.date || new Date()));
      setDescription(task.description || "");
    } else {
      setTitle("");
      setDate(formatDate(new Date()));
      setDescription("");
    }
  }, [task]);

  const placeholder = useMemo(() => {
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please provide a title");

    const newTask = {
      id: task?.id || `${removeSpecialChars(title)}-${Date.now()}`,
      title: removeSpecialChars(title),
      date: formatDateForDisplay(date),
      description: removeSpecialChars(description),
    };
    onSave(newTask);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={"e.g. " + placeholder}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="You can add something interesting..."
      />
      <div className="buttons">
        <button className="modal-button" type="submit">
          {task ? "Update" : "Add"} Task
        </button>
        <button className="modal-button" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
