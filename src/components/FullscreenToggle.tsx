import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";

interface FullscreenToggleProps {
  isFullscreen: boolean;
  onToggle: () => void;
  className?: string;
}

export function FullscreenToggle({ isFullscreen, onToggle, className = "" }: FullscreenToggleProps) {
  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={onToggle}
      title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen (F11)"}
      className={className}
    >
      {isFullscreen ? (
        <Minimize className="h-4 w-4" />
      ) : (
        <Maximize className="h-4 w-4" />
      )}
    </Button>
  );
}
