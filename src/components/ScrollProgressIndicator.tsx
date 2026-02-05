import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export function ScrollProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  // Only show when there's content to scroll
  if (scrollProgress === 0 && window.scrollY === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress value={scrollProgress} className="h-1 rounded-none bg-transparent" />
    </div>
  );
}
