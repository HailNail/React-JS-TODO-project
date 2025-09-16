import { TaskContext } from "../../utils/TaskContext";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import TaskList from "../TaskList";
import Footer from "../Footer/Footer";

function MainLayout({
  contextValue,
  searchManager,
  uiState,
  uiSetters,
  progress,
}) {
  return (
    <div>
      <div className="main-container">
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
      </div>

      <Footer {...progress} />
    </div>
  );
}

export default MainLayout;
