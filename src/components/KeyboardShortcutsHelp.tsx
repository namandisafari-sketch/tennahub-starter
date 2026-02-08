import { Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShortcutConfig {
  key: string;
  route: string;
  description: string;
}

interface KeyboardShortcutsHelpProps {
  shortcuts: ShortcutConfig[];
  className?: string;
}

export function KeyboardShortcutsHelp({ shortcuts, className }: KeyboardShortcutsHelpProps) {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className={className}>
                <Keyboard className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Keyboard Shortcuts (?)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Global shortcuts */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Global</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Toggle Fullscreen</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 text-xs bg-muted rounded font-mono">F11</kbd>
                  <span className="text-muted-foreground">or</span>
                  <kbd className="px-2 py-1 text-xs bg-muted rounded font-mono">F</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Shortcuts</span>
                <kbd className="px-2 py-1 text-xs bg-muted rounded font-mono">?</kbd>
              </div>
            </div>
          </div>

          {/* Navigation shortcuts */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Navigation (Alt + Key)</h4>
            <div className="space-y-2">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.key} className="flex items-center justify-between">
                  <span className="text-sm">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 text-xs bg-muted rounded font-mono">Alt</kbd>
                    <span className="text-muted-foreground">+</span>
                    <kbd className="px-2 py-1 text-xs bg-muted rounded font-mono uppercase">{shortcut.key}</kbd>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
