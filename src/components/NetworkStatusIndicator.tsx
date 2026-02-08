import { useNetworkStatus } from "@/hooks/use-network-status";
import { Wifi, WifiOff, Signal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NetworkStatusIndicatorProps {
  className?: string;
  showLabel?: boolean;
}

export function NetworkStatusIndicator({ className, showLabel = false }: NetworkStatusIndicatorProps) {
  const { isOnline, connectionType } = useNetworkStatus();

  const getConnectionLabel = () => {
    if (!isOnline) return "Offline";
    if (!connectionType) return "Online";
    
    const labels: Record<string, string> = {
      "4g": "4G",
      "3g": "3G", 
      "2g": "2G",
      "slow-2g": "Slow",
      "wifi": "WiFi",
    };
    return labels[connectionType] || connectionType.toUpperCase();
  };

  const getConnectionColor = () => {
    if (!isOnline) return "text-destructive";
    if (connectionType === "4g" || connectionType === "wifi") return "text-green-500";
    if (connectionType === "3g") return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors",
              isOnline ? "bg-green-500/10" : "bg-destructive/10",
              className
            )}
          >
            {isOnline ? (
              connectionType ? (
                <Signal className={cn("h-4 w-4", getConnectionColor())} />
              ) : (
                <Wifi className="h-4 w-4 text-green-500" />
              )
            ) : (
              <WifiOff className="h-4 w-4 text-destructive animate-pulse" />
            )}
            {showLabel && (
              <span className={cn("text-xs font-medium", getConnectionColor())}>
                {getConnectionLabel()}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{isOnline ? `Connected${connectionType ? ` (${getConnectionLabel()})` : ""}` : "No internet connection"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
