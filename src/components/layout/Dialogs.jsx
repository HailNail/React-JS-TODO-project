import Modal from "../Modal";
import ConfirmDialog from "../ConfirmDialog";
import TaskForm from "../TaskForm";

function Dialogs({ uiState, handlers, currentTask }) {
  return (
    <>
      {uiState.isFormVisible && (
        <Modal onClose={handlers.handleCloseTaskForm}>
          <TaskForm
            task={currentTask}
            onSave={handlers.handleSaveTask}
            onCancel={handlers.handleCloseTaskForm}
            onFormDirtyChange={handlers.handleTaskFormDirtyChange}
          />
        </Modal>
      )}

      {uiState.taskToDelete && (
        <Modal onClose={handlers.handleCancelDelete}>
          <ConfirmDialog
            message="Are you sure you want to delete this task?"
            onConfirm={handlers.handleConfirmDelete}
            onCancel={handlers.handleCancelDelete}
          />
        </Modal>
      )}

      {uiState.isDiscardConfirmVisible && (
        <Modal onClose={handlers.handleCancelDiscard}>
          <ConfirmDialog
            message="You have unsaved changes. Are you sure you want to discard them?"
            onConfirm={handlers.handleConfirmDiscard}
            onCancel={handlers.handleCancelDiscard}
          />
        </Modal>
      )}
    </>
  );
}

export default Dialogs;
