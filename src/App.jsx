import { loadFromStorage } from "./utils/storage";
import { useTaskManager } from "./hooks/useTaskManager";
import { useTaskSearch } from "./hooks/useTaskSearch";
import { useVisibleTasks } from "./hooks/useVisibleTasks";
import { useProgress } from "./hooks/useProgress";
import { useUIState } from "./hooks/useUIState";
import { useTaskHandlers } from "./hooks/useTaskHandlers";

import MainLayout from "./components/layout/MainLayout";
import Dialogs from "./components/layout/Dialogs";
import GuideWrapper from "./components/layout/GuideWrapper";

import "./App.css";

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

  const handlers = useTaskHandlers({ taskManager, uiState, uiSetters });

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
    onDeleteClick: handlers.handleDeleteClick,
  };

  return (
    <>
      <MainLayout
        contextValue={contextValue}
        searchManager={searchManager}
        uiState={uiState}
        uiSetters={uiSetters}
        progress={progress}
      />
      <Dialogs
        uiState={uiState}
        handlers={handlers}
        currentTask={taskManager.currentTask}
      />
      <GuideWrapper uiState={uiState} uiSetters={uiSetters} />
    </>
  );
}

export default App;
