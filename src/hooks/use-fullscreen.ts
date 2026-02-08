import { useState, useEffect, useCallback, useRef } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreenAction = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        const element = containerRef.current || document.documentElement;
        await element.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen not supported:', error);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // F11 key or F key (when not in an input/textarea)
      if (e.key === 'F11' || (e.key.toLowerCase() === 'f' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName))) {
        if (e.key === 'F11') {
          e.preventDefault(); // Prevent browser's default F11 behavior
        }
        if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
          toggleFullscreenAction();
        } else if (e.key === 'F11') {
          toggleFullscreenAction();
        }
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleFullscreenAction]);

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
