import "./Footer.css";

// This component displays the footer of the application
// It shows the progress of tasks, including total tasks, completed tasks, and a progress bar

const Footer = ({ totalTasks, completedTasks, percent, isComplete }) => {
  return (
    <div>
      <div className="footer-container">
        <p>
          {isComplete
            ? "All tasks complete!"
            : `Progress: ${completedTasks} / ${totalTasks} tasks completed`}
        </p>
        <div className={`progress-bar ${isComplete ? "complete" : ""}`}>
          <div className="progress-fill" style={{ width: `${percent}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
