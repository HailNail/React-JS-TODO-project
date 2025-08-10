// App.jsx
import { TaskContext } from "./utils/TaskContext";
import { loadFromStorage } from "./utils/storage";
import { useState } from "react";

// Components
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Modal from "./components/Modal";
import GuideModal from "./components/GuideModal/GuideModal";

// Hooks
import { useTaskManager } from "./hooks/useTaskManager";
import { useTaskSearch } from "./hooks/useTaskSearch";
import { useVisibleTasks } from "./hooks/useVisibleTasks";
import { useProgress } from "./hooks/useProgress";
import { useUIState } from "./hooks/useUIState";

import "./App.css";
import ConfirmDialog from "./components/ConfirmDialog";
// This is the main App component that ties everything together
// It uses context to provide task data and handlers to child components
// It also manages UI state such as form visibility and search filters

function App() {
  const { uiState, uiSetters } = useUIState();

  const [isTaskFormDirty, setIsTaskFormDirty] = useState(false);
  const [isDiscardConfirmVisible, setIsDiscardConfirmVisible] = useState(false);

  const taskManager = useTaskManager(loadFromStorage("data") || []);

  const searchManager = useTaskSearch(
    taskManager.taskData,
    uiState.showFavoritesOnly
  );

  const visibleTasks = useVisibleTasks({
    taskData: taskManager.taskData,
    searchedTasks: searchManager.searchedTasks,
    hasSearched: searchManager.hasSearched,
    searchPerformedQuery: searchManager.searchPerformedQuery,
    showFavoritesOnly: uiState.showFavoritesOnly,
  });

  const progress = useProgress(
    visibleTasks.filteredList,
    visibleTasks.ghostList
  );

  const handleDeleteClick = (id) => {
    uiSetters.setTaskToDelete(id);
    uiSetters.setIsConfirmDeleteVisible(true);
  };

  const contextValue = {
    tasks: visibleTasks.filteredList,
    onEdit: (task) => {
      taskManager.setCurrentTask(task);
      uiSetters.setFormVisible(true);
    },
    onDelete: taskManager.handleDelete,
    onMarkDone: taskManager.handleMarkDone,
    onRestore: taskManager.handleRestore,
    onAddClick: () => {
      taskManager.setCurrentTask(null);
      uiSetters.setFormVisible(true);
    },
    ...uiState,
    onDeleteClick: handleDeleteClick,
  };

  const handleConfirmDelete = () => {
    if (uiState.taskToDelete) {
      taskManager.handleDelete(uiState.taskToDelete);
      uiSetters.setIsConfirmDeleteVisible(false);
      uiSetters.setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    uiSetters.setIsConfirmDeleteVisible(false);
    uiSetters.setTaskToDelete(null);
  };

  const handleTaskFormDirtyChange = (dirty) => {
    setIsTaskFormDirty(dirty);
  };

  const handleCloseTaskForm = () => {
    if (isTaskFormDirty) {
      setIsDiscardConfirmVisible(true);
    } else {
      uiSetters.setFormVisible(false);
      taskManager.setCurrentTask(null);
    }
  };

  const handleConfirmDiscard = () => {
    uiSetters.setFormVisible(false); // Close the TaskForm modal
    taskManager.setCurrentTask(null); // Clear current task
    setIsDiscardConfirmVisible(false); // Hide the confirmation modal
    setIsTaskFormDirty(false); // Reset dirty state
  };

  const handleCancelDiscard = () => {
    setIsDiscardConfirmVisible(false); // Hide the confirmation modal
  };

  const handleSaveTask = (task) => {
    taskManager.handleAddOrUpdate(task);
    uiSetters.setFormVisible(false); // Close the form after saving
    taskManager.setCurrentTask(null);
    setIsTaskFormDirty(false); // Reset dirty state
  };

  return (
    <>
      <div>
        <Header />
        <Navbar
          searchManager={searchManager}
          uiState={uiState}
          onToggleFavorites={uiSetters.toggleFavorites}
          onToggleView={uiSetters.toggleViewAndCollapse}
          onShowHelp={() => uiSetters.setShowGuide(true)}
        />

        <div className="card-container">
          <TaskContext.Provider value={contextValue}>
            <TaskList />
          </TaskContext.Provider>
        </div>
      </div>

      {uiState.isFormVisible && (
        <Modal onClose={handleCloseTaskForm}>
          <TaskForm
            task={taskManager.currentTask}
            onSave={handleSaveTask}
            onCancel={handleCloseTaskForm}
            onFormDirtyChange={handleTaskFormDirtyChange}
          />
        </Modal>
      )}

      {uiState.taskToDelete && (
        <Modal onClose={handleCancelDelete}>
          <ConfirmDialog
            message="Are you sure you want to delete this task?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </Modal>
      )}

      {isDiscardConfirmVisible && (
        <Modal onClose={handleCancelDiscard}>
          <ConfirmDialog
            message="You have unsaved changes. Are you sure you want to discard them?"
            onConfirm={handleConfirmDiscard}
            onCancel={handleCancelDiscard}
          />
        </Modal>
      )}

      <Footer {...progress} />

      {uiState.showGuide && (
        <GuideModal onClose={() => uiSetters.setShowGuide(false)} />
      )}
    </>
  );
}

export default App;
