// This component creates a modal that can be used to display content over the main application
// It uses React Portals to render the modal outside the main DOM hierarchy, allowing for better accessibility and user experience.

import ReactDOM from "react-dom";
import { useEscapeKey } from "../hooks/useEscapeKey";

const modalRoot = document.getElementById("modal-root");

const Modal = ({ children, onClose }) => {
  useEscapeKey(onClose);

  if (!modalRoot) {
    console.error("Modal root element #modal-root not found!");
    return null; // Don't render if root is missing
  }
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
