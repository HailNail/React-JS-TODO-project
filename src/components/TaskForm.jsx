import { useEffect, useMemo, useState, useRef } from "react";
import {
  removeSpecialChars,
  formatDate,
  formatDateForDisplay,
  isEqual,
} from "../utils/helpers";
import suggestions from "../utils/suggestions.json";
import "./../App.css";

// This component represents a form for adding or editing tasks
// It allows users to input a task title, date, and description
// It handles both creating new tasks and updating existing ones

const TaskForm = ({ task, onSave, onCancel, onFormDirtyChange }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(formatDate(new Date()));
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const initialTaskRef = useRef(null);

  const getCurrentFormData = () => ({
    title: title,
    date: date,
    description: description,
  });

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDate(formatDateForDisplay(task.date || new Date()));
      setDescription(task.description || "");
      initialTaskRef.current = {
        title: task.title || "",
        date: formatDateForDisplay(task.date || new Date()),
        description: task.description || "",
      };
    } else {
      setTitle("");
      setDate(formatDate(new Date()));
      setDescription("");
      initialTaskRef.current = {
        title: "",
        date: formatDate(new Date()),
        description: "",
      };
    }
  }, [task]);

  useEffect(() => {
    const isFormDirty = !isEqual(initialTaskRef.current, getCurrentFormData());
    onFormDirtyChange(isFormDirty);
    if (title.trim() && titleError) {
      setTitleError(false);
    }
  }, [title, date, description, onFormDirtyChange]);

  const placeholder = useMemo(() => {
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError(true);
      setShakeKey((prevKey) => prevKey + 1);
      return;
    }

    setTitleError(false);

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
        className={titleError ? "input-error" : ""}
        key={shakeKey}
      />
      {titleError && <p className="error-message">Please provide a title</p>}
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
