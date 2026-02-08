import { useState, useEffect, useCallback, useRef } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        // Try container first, fallback to document element
        const element = containerRef.current || document.documentElement;
        await element.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen not supported:', error);
    }
  }, []);

  const enterFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        const element = containerRef.current || document.documentElement;
        await element.requestFullscreen();
      } catch (error) {
        console.warn('Fullscreen not supported:', error);
      }
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.warn('Exit fullscreen failed:', error);
      }
    }
  }, []);

  return {
    isFullscreen,
    containerRef,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
  };
}
