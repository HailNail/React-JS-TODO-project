import { useEffect } from "react";

export const useArrowsKey = ({ onLeft, onRight, onUp, onDown }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          onLeft && onLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          onRight && onRight();
          break;
        case "ArrowUp":
          e.preventDefault();
          onUp && onUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          onDown && onDown();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onLeft, onRight, onUp, onDown]);
};
