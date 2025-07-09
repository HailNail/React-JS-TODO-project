// This is a custom hook that listens for the Escape key press
// and performs actions like blurring an input, resetting focus, and calling a callback function

import { useEffect } from "react";

export const useEscapeKey = ({
  onEscape = () => {},
  blurRef = null,
  resetFocus = null,
  resetIndex = null,
  tempDisable = null,
  justBlurredRef = null,
} = {}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;

      resetFocus?.(false);
      resetIndex?.();
      justBlurredRef && (justBlurredRef.current = true);
      tempDisable?.(true);
      blurRef?.current?.blur();

      setTimeout(() => {
        justBlurredRef && (justBlurredRef.current = false);
        tempDisable?.(false);
        onEscape?.();
      }, 150);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onEscape, blurRef, resetFocus, resetIndex, tempDisable, justBlurredRef]);
};
