import { useEffect, useState } from "react";
import ReactDOM from "react-dom"; // Import ReactDOM
import "./GuideModal.css";
import { IoClose } from "react-icons/io5";
import { useEscapeKey } from "../../hooks/useEscapeKey";

// This component provides a guided tour of the application
// It highlights key features and explains their functionality step by step.

const guideSteps = [
  {
    title: "Search Bar",
    description:
      "This is your compass! Use it to search through tasks. Try typing keywords and hit Enter or click the search icon.",
    targetClass: "search-bar",
  },
  {
    title: "Navbar Buttons",
    description:
      "These icons let you switch views, toggle dark mode, show favorites, and open this guide again.",
    targetClass: "nav-icons",
  },
  {
    title: "Add-Card Button",
    description:
      "Click this to create a brand new task. It opens a form where you define your mission.",
    targetClass: "add-card",
  },
  {
    title: "Task Card",
    description:
      "Here lies your task. Click the title to expand, edit, complete, or delete as needed.",
    targetClass: "task-card",
  },
  {
    title: "Ghost Card",
    description:
      "These are your completed tasks—haunting you from the past. You can restore or exorcise them.",
    targetClass: "ghost-card",
  },
];

// Helper function to get target element properties
const getTargetRect = (targetClass) => {
  const elements = document.querySelectorAll(`.${targetClass}`);
  if (elements.length === 0) return null;

  // For simplicity, we'll use the first found element.
  // If `targetClass` applies to multiple, you might need more complex logic.
  const el = elements[0];
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY, // Add scroll for absolute positioning relative to document
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
};

const GuideModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const isLast = step === guideSteps.length - 1;
  const isFirst = step === 0;

  // State to store the position/size of the target element for the highlight clone
  const [highlightRect, setHighlightRect] = useState(null);

  useEscapeKey(onClose);

  const handleNext = () => {
    if (!isLast) setStep(step + 1);
    else onClose();
  };

  const handlePrev = () => {
    if (!isFirst) setStep(step - 1);
  };

  // Effect to update highlight position
  useEffect(() => {
    const currentTargetClass = guideSteps[step].targetClass;
    const rect = getTargetRect(currentTargetClass);
    setHighlightRect(rect);

    // Re-calculate on window resize or scroll
    const handleResizeOrScroll = () => {
      const updatedRect = getTargetRect(currentTargetClass);
      setHighlightRect(updatedRect);
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [step]); // Only re-run when step changes

  // Get the modal root element
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    console.error("Modal root element #modal-root not found!");
    return null; // Don't render if root is missing
  }

  // Render the modal and highlight clone using a Portal
  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div className="guide-modal-overlay" onClick={onClose}></div>{" "}
      {/* Now just a dimming layer */}
      {/* Highlight Clone (positioned over the original element) */}
      {highlightRect && (
        <div
          className={`guide-highlight-clone ${guideSteps[step].targetClass}`} // Add original class for specific styling
          style={{
            position: "absolute", // Absolute positioning within the portal's stacking context
            top: `${highlightRect.top}px`,
            left: `${highlightRect.left}px`,
            width: `${highlightRect.width}px`,
            height: `${highlightRect.height}px`,

            // Add your highlight styles here, or let CSS handle it
            zIndex: 9999, // Lower than the modal box, higher than overlay
          }}
        ></div>
      )}
      {/* Guide Modal Box (content) */}
      <div className="guide-modal">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close Guide"
        >
          <IoClose />
        </button>
        <h2>{guideSteps[step].title}</h2>
        <p>{guideSteps[step].description}</p>

        <div className="guide-buttons">
          <button onClick={handlePrev} disabled={isFirst}>
            Back
          </button>
          <span className="step-indicator">
            Step {step + 1} of {guideSteps.length}
          </span>
          <button onClick={handleNext}>{isLast ? "Finish" : "Next"}</button>
        </div>
      </div>
    </>,
    modalRoot // Render into the #modal-root div
  );
};

export default GuideModal;
