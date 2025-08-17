export const useTaskHandlers = ({ taskManager, uiState, uiSetters }) => {
  const handleDeleteClick = (id) => {
    uiSetters.setTaskToDelete(id);
    uiSetters.setIsConfirmDeleteVisible(true);
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
    uiSetters.setIsTaskFormDirty(dirty);
  };

  const handleCloseTaskForm = () => {
    if (uiState.isTaskFormDirty) {
      uiSetters.setIsDiscardConfirmVisible(true);
    } else {
      uiSetters.setFormVisible(false);
      taskManager.setCurrentTask(null);
    }
  };

  const handleConfirmDiscard = () => {
    uiSetters.setFormVisible(false);
    taskManager.setCurrentTask(null);
    uiSetters.setIsDiscardConfirmVisible(false);
    uiSetters.setIsTaskFormDirty(false);
  };

  const handleCancelDiscard = () => {
    uiSetters.setIsDiscardConfirmVisible(false);
  };

  const handleSaveTask = (task) => {
    taskManager.handleAddOrUpdate(task);
    uiSetters.setFormVisible(false);
    taskManager.setCurrentTask(null);
    uiSetters.setIsTaskFormDirty(false);
  };

  return {
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleTaskFormDirtyChange,
    handleCloseTaskForm,
    handleConfirmDiscard,
    handleCancelDiscard,
    handleSaveTask,
  };
};
