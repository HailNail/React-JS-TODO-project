// App.jsx
import { TaskContext } from "./utils/TaskContext";
import { loadFromStorage } from "./utils/storage";

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
import { useUIState } from "./hooks/useUIState"; // 👈 Import the new hook

import "./App.css";
// This is the main App component that ties everything together
// It uses context to provide task data and handlers to child components
// It also manages UI state such as form visibility and search filters

function App() {
  const { uiState, uiSetters } = useUIState();

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
    ...uiState, // Spread UI states into context
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
        <Modal onClose={() => uiSetters.setFormVisible(false)}>
          <TaskForm
            task={taskManager.currentTask}
            onSave={(task) => {
              taskManager.handleAddOrUpdate(task);
              uiSetters.setFormVisible(false);
            }}
            onCancel={() => uiSetters.setFormVisible(false)}
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
